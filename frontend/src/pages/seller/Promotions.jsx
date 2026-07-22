import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import PromoMetrics from '../../components/Seller/PromoMetrics';
import PromoTable from '../../components/Seller/PromoTable';
import PromoModal from '../../components/Seller/PromoModal';
import Reveal from '../../components/common/Reveal';
import { getPromotions, createPromotion } from '../../api/sellerApi';

const Promotions = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', discountPercent: '15', startDate: '', endDate: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPromotions();
        if (!res.success) {
          setError(res.message || "Failed to load promotions.");
          return;
        }
        setCampaigns(res.data);
        setSummary(res.summary);
      } catch {
        setError("Server unreachable. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleCreatePromo = async (e) => {
    e.preventDefault();

    const res = await createPromotion({
      name: formData.name,
      code: formData.code,
      discount_percent: parseInt(formData.discountPercent, 10) || 10,
      start_date: formData.startDate,
      end_date: formData.endDate,
    });

    if (res.success) {
      setCampaigns((prev) => [res.data, ...prev]);
      setIsModalOpen(false);
      setFormData({ name: '', code: '', discountPercent: '15', startDate: '', endDate: '' });
    }
  };

  if (loading) return <p className="text-center text-gray-400 py-12 text-sm">Loading promotions...</p>;
  if (error) return <p className="text-center text-red-500 py-12 text-sm">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight">Promotions & Offers</h2>
          <p className="text-sm text-gray-500 mt-0.5">Deploy store discount rules, monitor user coupon claims, and schedule flashes.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-press bg-[#004D40] text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#003d33] transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Plus size={16} /> Create Campaign
        </button>
      </div>

      <Reveal>
        <PromoMetrics summary={summary} />
      </Reveal>
      <Reveal delay={80}>
        <PromoTable campaigns={campaigns} />
      </Reveal>

      <PromoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePromo}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default Promotions;
