import { useEffect, useState } from 'react';
import api from '../api';
import NetMovementModal from './NetMovementModal';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({});
  const [showNetModal, setShowNetModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    base: 'Base Alpha',
    type: 'All',
    startDate: '1970-01-01',
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const params = {
          base: filters.base,
          type: filters.type !== 'All' ? filters.type : undefined,
          startDate: filters.startDate,
          endDate: filters.endDate
        };

        const { data } = await api.get('/dashboard', { params });
        setMetrics(data);
      } catch (err) {
        setError('Failed to load dashboard data. Please check your permissions and try again.');
        console.error('API Error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Military Asset Dashboard</h1>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Base</label>
          <select
            className="w-full p-2 border rounded-md"
            value={filters.base}
            onChange={(e) => handleFilterChange('base', e.target.value)}
          >
            <option value="Base Alpha">Base Alpha</option>
            <option value="Base Beta">Base Beta</option>
            <option value="Base Charlie">Base Charlie</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Type</label>
          <select
            className="w-full p-2 border rounded-md"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Weapon">Weapons</option>
            <option value="Vehicle">Vehicles</option>
            <option value="Ammunition">Ammunition</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MetricCard 
          title="Opening Balance" 
          value={metrics.openingBalance || 0}
        />
        <MetricCard 
          title="Closing Balance" 
          value={metrics.closingBalance || 0}
        />
        <div 
          className="cursor-pointer hover:transform hover:scale-105 transition-all"
          onClick={() => setShowNetModal(true)}
        >
          <MetricCard
            title="Net Movement"
            value={metrics.netMovement || 0}
            isDelta={true}
          />
        </div>
        <MetricCard 
          title="Assigned" 
          value={metrics.assigned || 0}
        />
        <MetricCard 
          title="Expended" 
          value={metrics.expended || 0}
        />
      </div>

      {/* Net Movement Modal */}
      {showNetModal && (
        <NetMovementModal
          purchases={metrics.purchases || 0}
          transfersIn={metrics.transfersIn || 0}
          transfersOut={metrics.transfersOut || 0}
          netMovement={metrics.netMovement || 0}
          onClose={() => setShowNetModal(false)}
        />
      )}
    </div>
  );
}

const MetricCard = ({ title, value, isDelta }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <h3 className="text-sm font-medium text-gray-600">{title}</h3>
    <div className="mt-2 flex items-baseline">
      <span className="text-2xl font-semibold text-gray-900">
        {value}
      </span>
      {isDelta && (
        <span className={`ml-2 text-sm ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {value >= 0 ? '▲' : '▼'} {Math.abs(value)}
        </span>
      )}
    </div>
  </div>
);