import { useState, useEffect } from 'react';
import api from '../api';
import { Spinner } from './Spinner'
import { useAuth } from '../auth/AuthContext';

export default function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({
    assetId: '',
    fromBase: 'Base Alpha',
    toBase: 'Base Bravo',
    quantity: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const validateTransfer = (transferData) => {
    if (user.role === 'LOGISTICS' && transferData.fromBase !== user.base) {
      throw new Error('You can only transfer from your assigned base');
    }
  };

  // Filter assets based on selected fromBase
  const filteredAssets = assets.filter(
    asset => asset.currentBase === formData.fromBase
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transfersRes, assetsRes] = await Promise.all([
          api.get('/transfers'),
          api.get('/assets')
        ]);
        
        setTransfers(transfersRes.data);
        setAssets(assetsRes.data);
        setError('');
      } catch (err) {
        console.error('Data load error:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!formData.assetId || formData.quantity <= 0) return;

    try {
        validateTransfer(formData);

      const { data } = await api.post('/transfers', formData);
      
      // Update transfers list
      setTransfers([data, ...transfers]);
      
      // Update assets locally
      setAssets(assets.map(asset => {
        if (asset.id === data.asset.id) {
          return data.asset; // Updated asset from backend
        }
        if (asset.id === data.targetAsset?.id) {
          return data.targetAsset; // Updated target asset
        }
        return asset;
      }));

      // Reset form
      setFormData(prev => ({
        ...prev,
        quantity: 0,
        assetId: ''
      }));
      
    } catch (err) {
      console.error('Transfer failed:', err);
      setError('Transfer failed. Check quantity and try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Asset Transfers</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleTransfer} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={formData.fromBase}
            onChange={e => setFormData({
              ...formData,
              fromBase: e.target.value,
              assetId: '' // Reset asset selection when base changes
            })
            }
            disabled={user.role==='LOGISTICS'}
          >
            <option>Base Alpha</option>
            <option>Base Bravo</option>
            <option>Base Charlie</option>
          </select>

          <select
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={formData.assetId}
            onChange={e => setFormData({...formData, assetId: e.target.value})}
            required
          >
            <option value="">Select Asset ({filteredAssets.length} available)</option>
            {filteredAssets.map(asset => (
              <option 
                key={asset.id} 
                value={asset.id}
                disabled={asset.currentBalance <= 0}
              >
                {asset.name} (Qty: {asset.currentBalance})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={formData.quantity}
            onChange={e => setFormData({
              ...formData,
              quantity: Math.max(0, parseInt(e.target.value) || 0)
            })}
            min="1"
            max={filteredAssets.find(a => a.id === formData.assetId)?.currentBalance || 0}
            required
          />

          <select
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={formData.toBase}
            onChange={e => setFormData({...formData, toBase: e.target.value})}
          >
            {['Base Bravo', 'Base Alpha', 'Base Charlie']
              .filter(base => base !== formData.fromBase)
              .map(base => (
                <option key={base} value={base}>{base}</option>
              ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700 
                     transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : 'Execute Transfer'}
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Asset', 'From', 'To', 'Qty', 'Date'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transfers.map(transfer => (
              <tr key={transfer.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="font-medium">{transfer.asset?.name}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      (ID: {transfer.asset?.id})
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{transfer.fromBase}</td>
                <td className="px-6 py-4 whitespace-nowrap">{transfer.toBase}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">
                  {transfer.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transfer.transferTime).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transfers.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No transfers recorded yet
          </div>
        )}
      </div>
    </div>
  );
}
