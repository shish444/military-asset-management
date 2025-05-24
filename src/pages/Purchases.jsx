import { useState, useEffect } from 'react';
import api from '../api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: 'All',
    startDate: null,
    endDate: null
  });

  const [formData, setFormData] = useState({
    baseName: 'Base Alpha',
    assetId: '',
    quantity: 1
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [purchasesRes, assetsRes] = await Promise.all([
          api.get('/purchases', {
            params: {
              type: filters.type !== 'All' ? filters.type : undefined,
              start: filters.startDate?.toISOString(),
              end: filters.endDate?.toISOString()
            }
          }),
          api.get('/assets')
        ]);
        
        setPurchases(purchasesRes.data);
        setAssets(assetsRes.data);
      } catch (err) {
        setError('Failed to load data. Please check your permissions.');
        console.error('Load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

  const handlePurchase = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        asset: { id: formData.assetId }
      };

      const { data } = await api.post('/purchases', payload);
      setPurchases([data, ...purchases]);
      setFormData({ baseName: 'Base Alpha', assetId: '', quantity: 1 });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed. Check asset availability.');
    }
  };

  if (loading) return <div className="p-6 text-center">Loading purchases...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Purchases Management</h1>
      
      {/* Purchase Form */}
      <form onSubmit={handlePurchase} className="bg-white p-6 rounded-lg shadow space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            className="p-2 border rounded"
            value={formData.baseName}
            onChange={e => setFormData({...formData, baseName: e.target.value})}
            required
          >
            <option value="Base Alpha">Base Alpha</option>
            <option value="Base Beta">Base Beta</option>
            <option value="Base Charlie">Base Charlie</option>
          </select>

          <select
            className="p-2 border rounded"
            value={formData.assetId}
            onChange={e => setFormData({...formData, assetId: e.target.value})}
            required
          >
            <option value="">Select Asset</option>
            {assets.map(asset => (
              <option key={asset.id} value={asset.id}>
                {asset.name} ({asset.type})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            className="p-2 border rounded"
            value={formData.quantity}
            onChange={e => setFormData({...formData, quantity: Math.max(1, e.target.value)})}
            min="1"
            required
          />

          <button
            type="submit"
            className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition-colors"
          >
            Record Purchase
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Equipment Type</label>
          <select
            className="w-full p-2 border rounded"
            value={filters.type}
            onChange={e => setFilters({...filters, type: e.target.value})}
          >
            <option value="All">All Types</option>
            <option value="Weapon">Weapons</option>
            <option value="Vehicle">Vehicles</option>
            <option value="Ammunition">Ammunition</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <DatePicker
            selected={filters.startDate}
            onChange={date => setFilters({...filters, startDate: date})}
            className="w-full p-2 border rounded"
            placeholderText="Any Start Date"
            isClearable
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <DatePicker
            selected={filters.endDate}
            onChange={date => setFilters({...filters, endDate: date})}
            className="w-full p-2 border rounded"
            placeholderText="Any End Date"
            isClearable
          />
        </div>
      </div>

      {/* Purchase History */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Base</th>
              <th className="px-6 py-3 text-left">Asset</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Qty</th>
              <th className="px-6 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {purchases.map(purchase => (
              <tr key={purchase.id}>
                <td className="px-6 py-4">{purchase.baseName}</td>
                <td className="px-6 py-4 font-medium">{purchase.asset?.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{purchase.asset?.type}</td>
                <td className="px-6 py-4">{purchase.quantity}</td>
                <td className="px-6 py-4">
                  {new Date(purchase.purchaseDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {purchases.length === 0 && (
          <div className="p-6 text-center text-gray-500">No purchases found for selected filters</div>
        )}
      </div>
    </div>
  );
}