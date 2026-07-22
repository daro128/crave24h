import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../path";

const Search = () => {
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");

  const trending = [
    "Pizza",
    "Burger",
    "Sushi",
    "Noodles",
    "Coffee",
    "Dessert",
  ];

  const handleSearch = () => {
    if (!keyword.trim()) return;

    navigate(`${PATH.USER.AllFood}?search=${keyword}`);
  };

  const handleTrending = (item) => {
    navigate(`${PATH.USER.AllFood}?search=${item}`);
  };

  return (
    <div className="flex flex-col items-center py-4 px-4 sm:px-[10%] lg:px-[15%] gap-6">
      <div
        onClick={() => inputRef.current?.focus()}
        className="w-full bg-white rounded-3xl shadow-xl border border-gray-200 flex flex-wrap sm:flex-nowrap items-center p-3 gap-4 transition-all hover:shadow-2xl"
      >
        <div className="w-12 h-12 rounded-full bg-[#004953] flex items-center justify-center shrink-0">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-white text-lg"
          />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Search dishes, restaurants, cuisines..."
          className="flex-1 min-w-0 outline-none text-lg placeholder:text-gray-400"
        />

        <button className="btn-press flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#004953] px-6 py-3 rounded-2xl transition">
          <FontAwesomeIcon icon={faSliders} />
          Filter
        </button>

        <button
          onClick={handleSearch}
          className="btn-press bg-[#004953] hover:bg-black text-white px-8 py-3 rounded-2xl font-semibold transition"
        >
          Search
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="font-semibold text-[#004953]">
          🔥 Trending Searches
        </span>

        {trending.map((item) => (
          <button
            key={item}
            onClick={() => handleTrending(item)}
            className="btn-press bg-[#d7e7e9] text-[#004953] px-5 py-2 rounded-full font-medium transition-all hover:bg-[#004953] hover:text-white hover:scale-105"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Search;