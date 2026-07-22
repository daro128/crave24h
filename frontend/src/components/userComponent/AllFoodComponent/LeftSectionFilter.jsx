import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAllCategories } from "../../../service/productService";

const SORT_OPTIONS = [
  { label: "Most Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Lowest Price", value: "lowest_price" },
  { label: "Highest Price", value: "highest_price" },
];

const Divider = () => <hr className="border-gray-100" />;

const LeftSectionFilter = ({ onApply }) => {
  const [showAll, setShowAll] = useState(false);
  const [maxPrice, setMaxPrice] = useState(30);
  const [sort, setSort] = useState("popular");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.data.categories || []);
      } catch (err) {
        console.log(err);
      }
    };
    loadCategories();
  }, []);

  const toggleCategory = (name) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleReset = () => {
    setMaxPrice(30);
    setSort("popular");
    setSelectedCategories([]);
    onApply?.(null);
  };

  const handleApply = () => {
    onApply?.({
      categories: selectedCategories,
      maxPrice: Number(maxPrice),
      sort,
    });
  };

  const displayedCategories = showAll ? categories : categories.slice(0, 5);

  return (
    <div className="lg:col-span-2 sticky top-20">
      <div className="flex flex-col bg-white border border-gray-100 shadow-md rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-gray-100">
          <h2 className="text-[#004953] font-bold text-lg">Filters</h2>
          <button
            onClick={handleReset}
            className="btn-press text-sm text-[#004953] font-medium cursor-pointer hover:underline"
          >
            Reset all
          </button>
        </div>

        <div className="overflow-y-auto scrollbar-hide px-5 py-4 flex flex-col gap-5 max-h-[70vh]">

          {/* Categories */}
          <div>
            <p className="text-[#004953] font-semibold mb-2">Categories</p>
            <div className="flex flex-col gap-2">
              {displayedCategories.map((cat) => {
                const checked = selectedCategories.includes(cat.category_name);
                return (
                  <label
                    key={cat.category_id}
                    onClick={() => toggleCategory(cat.category_name)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                        checked
                          ? "bg-[#004953] border-[#004953]"
                          : "border-gray-300 group-hover:border-[#004953]"
                      }`}
                    >
                      {checked && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-700 text-sm">{cat.category_name}</span>
                  </label>
                );
              })}
            </div>

            {categories.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-[#004953] flex items-center gap-1 mt-2 text-sm font-medium cursor-pointer"
              >
                {showAll ? "Show Less" : `+${categories.length - 5} More`}
                <FontAwesomeIcon icon={showAll ? faChevronUp : faChevronDown} className="text-xs" />
              </button>
            )}
          </div>

          <Divider />

          {/* Price Range */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-[#004953] font-semibold">Max Price</p>
              <span className="bg-[#004953] text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                ${maxPrice}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-[#004953]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$0</span>
              <span>$30</span>
            </div>
          </div>

          <Divider />

          {/* Sort By */}
          <div>
            <p className="text-[#004953] font-semibold mb-3">Sort By</p>
            <div className="flex flex-col gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={`btn-press text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    sort === opt.value
                      ? "bg-[#004953] text-white shadow-sm"
                      : "bg-gray-50 text-gray-700 hover:bg-[#004953] hover:text-[#004953]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>


        </div>

        <div className="px-5 pb-5 pt-1 border-t border-gray-100">
          <button
            onClick={handleApply}
            className="btn-press w-full bg-[#004953] text-white py-3 rounded-2xl font-semibold hover:bg-black transition-all cursor-pointer"
          >
            Apply Filters
          </button>
        </div>

      </div>
    </div>
  );
};

export default LeftSectionFilter;
