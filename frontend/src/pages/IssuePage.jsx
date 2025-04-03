import { useState } from 'react';
import axios from 'axios';

export default function IssuePage() {
  const [stockId, setStockId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/api/inventory/issue',
        { stock_id: stockId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Item issued successfully');
    } catch (err) {
      alert('Failed to issue item');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Issue Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border p-2 w-full"
          type="text"
          placeholder="Stock ID"
          value={stockId}
          onChange={(e) => setStockId(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit Issue
        </button>
      </form>
    </div>
  );
}
