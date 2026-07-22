import Notification from "../models/Notification.js";
import User from "../models/user.js";
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        user_id: req.user.id,
      },
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      total_notifications: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const unread = await Notification.count({
      where: {
        user_id: req.user.id,
        is_read: false,
      },
    });

    return res.status(200).json({
      unread,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: {
        notification_id: id,
        user_id: req.user.id,
      },
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.is_read = true;

    await notification.save();

    return res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      {
        is_read: true,
      },
      {
        where: {
          user_id: req.user.id,
          is_read: false,
        },
      }
    );

    return res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: {
        notification_id: id,
        user_id: req.user.id,
      },
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    await notification.destroy();

    return res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};