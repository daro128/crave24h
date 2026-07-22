import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrash,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

const AddressBook = () => {
  const addresses = [
    {
      id: 1,
      type: "Home",
      address: "2425 Beverly Hills Dr.",
      location: "Los Angeles, CA 90210, United States",
      note: "Leave at the front gate, ring the buzzer #402",
      phone: "+1 (555) 123-4567",
      image:
        "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400",
    },
    {
      id: 2,
      type: "Work",
      address: "Tech Hub Plaza, Suite 800",
      location: "San Francisco, CA 94105, United States",
      note: "Deliver to reception desk on the 8th floor",
      phone: "+1 (555) 987-6543",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
        <h1 className="text-2xl font-bold text-[#1f2937]">
          Address Book
        </h1>

        <button className="btn-press bg-[#00565B] text-white px-5 py-2 rounded-full flex items-center gap-2 hover:cursor-pointer self-start sm:self-auto">
          <FontAwesomeIcon icon={faPlus}/>
          Add new address
        </button>
      </div>
      <div className="space-y-5">
        {addresses.map((item) => (
          <div
            key={item.id}
            className="card-hover bg-white rounded-xl shadow-sm border-l-4 border-[#00565B] p-2"
          >
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {item.type}
                </span>
                <h2 className="font-bold text-xl mt-3">
                  {item.address}
                </h2>
                <p className="text-gray-500 mt-2">
                  {item.location}
                </p>
                <p className="italic text-gray-500 mt-3">
                  "{item.note}"
                </p>
                <div className="flex items-center gap-2 mt-4 text-[#00565B]">
                  <FontAwesomeIcon icon={faPhone}/>
                  <span>{item.phone}</span>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col items-start sm:items-end gap-4">
                <img
                  src={item.image}
                  alt=""
                  className="w-24 h-20 rounded-lg object-cover shrink-0"
                />
                <div className="flex gap-4">
                  <button className="btn-press text-[#00565B] flex items-center gap-1">
                    <FontAwesomeIcon icon={faPen} />
                    Edit
                  </button>
                  <button className="btn-press text-red-500 flex items-center gap-1">
                    <FontAwesomeIcon icon={faTrash}/>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressBook;