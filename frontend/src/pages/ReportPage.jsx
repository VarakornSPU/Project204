import { useState } from 'react';
import axios from 'axios';

export default function ReportPage() {
  const [type, setType] = useState('pr');
  const [docId, setDocId] = useState('');
  const [result, setResult] = useState(null);
  const [vendorId, setVendorId] = useState('');
  const [balance, setBalance] = useState(null);

  const token = localStorage.getItem('token');

  const handlePrint = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/report/print/${type}/${docId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data.document);
    } catch (err) {
      alert('Failed to fetch document');
    }
  };

  const handleBalance = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/report/balance/${vendorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBalance(res.data.balance);
    } catch (err) {
      alert('Failed to fetch vendor balance');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold mb-2">Print Document</h1>
        <select
          className="border p-2 mr-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="pr">PR</option>
          <option value="po">PO</option>
          <option value="asset">Asset</option>
          <option value="stock">Stock</option>
        </select>
        <input
          className="border p-2 mr-2"
          placeholder="Document ID"
          value={docId}
          onChange={(e) => setDocId(e.target.value)}
        />
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Fetch Document
        </button>
        {result && (
          <pre className="bg-gray-100 p-4 mt-4 text-sm rounded max-w-3xl overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>

      <div>
        <h1 className="text-xl font-semibold mb-2">Vendor Balance Report</h1>
        <input
          className="border p-2 mr-2"
          placeholder="Vendor ID"
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
        />
        <button
          onClick={handleBalance}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Get Balance
        </button>
        {balance && (
          <p className="mt-2 text-md">Outstanding Balance: ฿{balance}</p>
        )}
      </div>
    </div>
  );
}
