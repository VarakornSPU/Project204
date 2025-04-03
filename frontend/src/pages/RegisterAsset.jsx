import { useState } from 'react';
import axios from 'axios';

export default function RegisterAsset() {
  const [poId, setPoId] = useState('');
  const [name, setName] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/api/asset',
        { po_id: poId, name, unit_cost: unitCost, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Asset registered successfully');
    } catch (err) {
      alert('Failed to register asset');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Register Asset</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="border p-2 w-full" type="text" placeholder="PO ID" value={poId} onChange={(e) => setPoId(e.target.value)} />
        <input className="border p-2 w-full" type="text" placeholder="Asset Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-2 w-full" type="number" placeholder="Unit Cost" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} />
        <input className="border p-2 w-full" type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">Register Asset</button>
      </form>
    </div>
  );
}
