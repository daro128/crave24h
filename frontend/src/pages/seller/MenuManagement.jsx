import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import CategoryTabs from '../../components/Seller/CategoryTabs';
import MenuItemCard from '../../components/Seller/MenuItemCard';
import MenuModal from '../../components/Seller/MenuModal';
import Reveal from '../../components/common/Reveal';
import {
  getProducts,
  getCategories,
  createProduct,
  toggleProductStatus,
  restockProduct,
  deleteProduct,
} from '../../api/sellerApi';

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({ name: '', price: '', category: '', description: '', image: null, imagePreview: null });

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([getProducts(), getCategories()]);

        if (!productsRes.success) {
          setError(productsRes.message || "Failed to load menu.");
          return;
        }

        setItems(productsRes.data);
        setCategories(categoriesRes.data ?? []);
        setFormData((prev) => ({ ...prev, category: categoriesRes.data?.[0]?.category_id ?? '' }));
      } catch {
        setError("Server unreachable. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const categoryTabs = [
    { id: 'all', label: 'Full Menu' },
    ...categories.map((c) => ({ id: c.category_id, label: c.category_name })),
  ];

  const handleToggleStatus = async (id) => {
    const res = await toggleProductStatus(id);
    if (res.success) {
      setItems((prev) => prev.map((item) => (item.product_id === id ? res.data : item)));
    }
  };

  const handleRestockItem = async (id) => {
    const res = await restockProduct(id);
    if (res.success) {
      setItems((prev) => prev.map((item) => (item.product_id === id ? res.data : item)));
    }
  };

  const handleDeleteItem = async (id) => {
    const res = await deleteProduct(id);
    if (res.success) {
      setItems((prev) => prev.filter((item) => item.product_id !== id));
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();

    const res = await createProduct({
      product_name: formData.name,
      description: formData.description || 'No description provided.',
      price: parseFloat(formData.price) || 0.0,
      category_id: formData.category,
      ...(formData.image && { image: formData.image }),
    });

    if (res.success) {
      setItems((prev) => [res.data, ...prev]);
      setIsModalOpen(false);
      setFormData({ name: '', price: '', category: categories[0]?.category_id ?? '', description: '', image: null, imagePreview: null });
    }
  };

  const filteredItems = items.filter((item) => activeCategory === 'all' || item.category_id === activeCategory);

  if (loading) return <p className="text-center text-gray-400 py-12 text-sm">Loading menu...</p>;
  if (error) return <p className="text-center text-red-500 py-12 text-sm">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight">Menu Catalog</h2>
          <p className="text-sm text-gray-500 mt-0.5">Maintain active product configurations, modify retail values, and shift item stock configurations.</p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: '', price: '', category: categories[0]?.category_id ?? '', description: '', image: null, imagePreview: null });
            setIsModalOpen(true);
          }}
          className="btn-press bg-[#004D40] text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#003d33] transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} categories={categoryTabs} />

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <Reveal key={item.product_id} delay={Math.min(index, 6) * 80}>
              <MenuItemCard item={item} onToggleStatus={handleToggleStatus} onDeleteItem={handleDeleteItem} onRestockItem={handleRestockItem} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm">
          <p className="text-sm font-bold text-gray-800">No Items Found</p>
          <p className="text-xs text-gray-400 mt-1">There are no items populated inside this specific category matrix yet.</p>
        </div>
      )}

      <MenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddItem}
        formData={formData}
        setFormData={setFormData}
        categories={categoryTabs}
      />
    </div>
  );
};

export default MenuManagement;
