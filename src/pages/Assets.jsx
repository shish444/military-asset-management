import { useState, useEffect } from 'react';
import api from '../api';

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [newAsset, setNewAsset] = useState({
    name: '',
    type: 'weapon',
    currentBase: 'Base Alpha',
    currentBalance: 0
  });

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const { data } = await api.get('/assets');
        setAssets(data);
      } catch (error) {
        console.error('Assets load error:', error);
      }
    };
    loadAssets();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/assets', newAsset);
      setAssets([...assets, data]);
      setNewAsset({ name: '', type: 'weapon', currentBase: 'Base Alpha', currentBalance: 0 });
    } catch (error) {
      console.error('Asset creation failed:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Asset Management</h1>
      
      {/* Create Asset Form */}
      <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Asset Name"
            className="p-2 border rounded"
            value={newAsset.name}
            onChange={e => setNewAsset({...newAsset, name: e.target.value})}
            required
          />
          <select
            className="p-2 border rounded"
            value={newAsset.type}
            onChange={e => setNewAsset({...newAsset, type: e.target.value})}
          >
            <option value="weapon">Weapon</option>
            <option value="vehicle">Vehicle</option>
            <option value="ammunition">Ammunition</option>
          </select>
          <input
            type="number"
            placeholder="Initial Quantity"
            className="p-2 border rounded"
            value={newAsset.currentBalance}
            onChange={e => setNewAsset({...newAsset, currentBalance: e.target.value})}
            min="0"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Add New Asset
          </button>
        </div>
      </form>

      {/* Assets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Base</th>
              <th className="px-6 py-3 text-left">Quantity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assets.map(asset => (
              <tr key={asset.id}>
                <td className="px-6 py-4">{asset.name}</td>
                <td className="px-6 py-4 capitalize">{asset.type}</td>
                <td className="px-6 py-4">{asset.currentBase}</td>
                <td className="px-6 py-4 font-medium">{asset.currentBalance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}