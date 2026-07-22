import Navbar from "../../components/userComponent/HomepageComponent/Navbar";
import Footer from "../../components/userComponent/HomepageComponent/Footer";
import LeftSectionFilter from "../../components/userComponent/AllFoodComponent/LeftSectionFilter";
import RightSectionFood from "../../components/userComponent/AllFoodComponent/RightSectionFood";
import Loading from "./LoadingPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchProducts, getAllProducts, filterProducts } from "../../service/productService";

const AllFoodPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("search") || "";

  const [inputValue, setInputValue] = useState(keyword);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(null);
  const [clientFilters, setClientFilters] = useState({ sort: "popular" });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let res;

        if (filters) {
          const backendSort = (filters.sort === "highest_price" || filters.sort === "newest") ? "popular" : filters.sort;
          res = await filterProducts({ categories: filters.categories, maxPrice: filters.maxPrice, sort: backendSort });
        } else if (keyword.trim()) {
          res = await searchProducts(keyword);
        } else {
          res = await getAllProducts();
        }
        setProducts(res.data.products);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, filters]);

  const handleFilterApply = (incoming) => {
    if (!incoming) {
      setFilters(null);
      setClientFilters({ sort: "popular" });
      return;
    }
    const { sort = "popular", ...rest } = incoming;
    setFilters({ ...rest, sort });
    setClientFilters({ sort });
  };

  const displayProducts = products
    .sort((a, b) => {
      if (clientFilters.sort === "highest_price") return b.price - a.price;
      if (clientFilters.sort === "lowest_price") return a.price - b.price;
      if (clientFilters.sort === "newest") return new Date(b.created_at) - new Date(a.created_at);
      return 0;
    });

  const handleSearch = () => {
    if (inputValue.trim()) {
      setSearchParams({ search: inputValue.trim() });
    } else {
      setSearchParams({});
    }
    setFilters(null);
  };

  const clearSearch = () => {
    setInputValue("");
    setSearchParams({});
    setFilters(null);
  };

  return (
    <div>
      <Navbar />

      <div className="px-4 sm:px-8 lg:px-15 py-4 gap-6 lg:gap-15 grid grid-cols-1 lg:grid-cols-7 items-start">
        <LeftSectionFilter onApply={handleFilterApply} />

        <div className="col-span-1 lg:col-span-5 w-full min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 mb-6 gap-3">
            <div>
              <h2 className="font-bold text-[#004953] text-2xl">
                {keyword ? `Results for "${keyword}"` : "All Food"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {displayProducts.length} item{displayProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="flex items-center bg-white rounded-2xl shadow-md border border-gray-200 px-4 py-2.5 gap-3 w-full sm:w-80">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[#004953]" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                placeholder="Search dishes, cuisines..."
                className="flex-1 min-w-0 outline-none text-sm placeholder:text-gray-400"
              />
              {inputValue && (
                <button
                  onClick={clearSearch}
                  className="btn-press text-gray-400 hover:text-gray-600 text-lg leading-none"
                >
                  ×
                </button>
              )}
              <button
                onClick={handleSearch}
                className="btn-press bg-[#004953] hover:bg-black text-white px-4 py-1.5 rounded-xl text-sm font-semibold transition whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </div>

          {loading ? <Loading /> : <RightSectionFood products={displayProducts} />}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AllFoodPage;