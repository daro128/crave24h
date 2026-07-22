import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCheckDouble,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../../service/notificationService";



const timeAgo = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
};

const NotificationBell = () => {
  const [isLoggedIn] = useState(!!localStorage.getItem("accessToken"));
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const panelRef = useRef(null);

  const fetchUnreadCount = async () => {
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.unread || 0);
    } catch(error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.notifications || []);
      setLoaded(true);
    } catch(error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = () => fetchUnreadCount();
    if (isLoggedIn) handler();
    const interval = setInterval(handler, 60000);
    window.addEventListener("focus", handler);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handler);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setOpen((o) => {
      const next = !o;
      if (next && !loaded) fetchNotifications();
      return next;
    });
  };

  const handleMarkRead = async (notification) => {
    if (notification.is_read) return;
    setNotifications((prev) =>
      prev.map((n) =>
        n.notification_id === notification.notification_id
          ? { ...n, is_read: true }
          : n
      )
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await markNotificationAsRead(notification.notification_id);
    } catch(error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsAsRead();
    } catch(error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleDelete = async (e, notification) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.filter((n) => n.notification_id !== notification.notification_id)
    );
    if (!notification.is_read) setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await deleteNotification(notification.notification_id);
    } catch(error) {
      console.error("Error deleting notification:", error);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={handleToggle}
        className="btn-press relative p-2.5 rounded-xl text-gray-600 hover:bg-[#004953] hover:text-white transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <FontAwesomeIcon icon={faBell} className="text-lg" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-4.5 min-h-4.5 flex items-center justify-center rounded-full leading-none px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="animate-fade-in-scale absolute right-0 mt-2 w-96 max-w-[90vw] bg-white rounded-2xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-[#004953]">Notifications</p>
              {unreadCount > 0 && (
                <span className="bg-[#004953] text-white text-[11px] font-semibold rounded-full px-2 py-0.5">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 text-xs font-medium text-[#004953] hover:text-[#003940] transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faCheckDouble} className="text-[11px]" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col gap-3 p-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-2.5 bg-gray-100 rounded w-2/3" />
                      <div className="h-2.5 bg-gray-100 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-[#FFF8EF] flex items-center justify-center">
                  <FontAwesomeIcon icon={faBell} className="text-[#004953] text-lg" />
                </div>
                <p className="text-sm font-medium text-gray-600">You're all caught up</p>
                <p className="text-xs text-gray-400">No notifications yet</p>
              </div>
            ) : (
              <ul>
                {notifications.map((n) => {
                  return (
                    <li key={n.notification_id}>
                      <button
                        onClick={() => handleMarkRead(n)}
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors cursor-pointer group ${
                          n.is_read ? "hover:bg-gray-50" : "bg-[#FFF8EF] hover:bg-[#fdf1de]"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full bg-[#FFF8EF] text-[#004953] flex items-center justify-center shrink-0`}
                        >
                          <FontAwesomeIcon icon={faBell} className="text-sm" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {n.title}
                            </p>
                            {!n.is_read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#004953] shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                            {n.message}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1">
                            {timeAgo(n.created_at)}
                          </p>
                        </div>

                        <span
                          onClick={(e) => handleDelete(e, n)}
                          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all p-1.5 shrink-0 cursor-pointer"
                          aria-label="Delete notification"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-xs" />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
