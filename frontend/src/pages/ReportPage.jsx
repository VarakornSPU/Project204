import { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../pages/ReportPage.css';
import '../App.css';

export default function ReportPage() {
  const [type, setType] = useState('pr');
  const [docId, setDocId] = useState('');
  const [result, setResult] = useState(null);
  const [vendorId, setVendorId] = useState('');
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const handlePrint = async () => {
    if (!docId) return alert('กรุณาใส่ Document ID');
    console.log("Token:", token);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/report/print/${type}/${docId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data.document);
      setError(null);
    } catch (err) {
      console.error("API Error:", err.response ? err.response.data : err.message);
      setResult(null);
      setError('ไม่สามารถดึงข้อมูลเอกสารได้');
    }
  };

  const handleBalance = async () => {
    if (!vendorId) return alert('กรุณาใส่ Vendor ID');

    try {
      const res = await axios.get(
        `http://localhost:5000/api/report/balance/${vendorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBalance(res.data.balance);
      setError(null);
    } catch (err) {
      setBalance(null);
      setError('ไม่สามารถดึงยอด Vendor ได้');
    }
  };

  const handleExportPDF = () => {
    if (!result) {
      alert("ไม่มีข้อมูลสำหรับ export");
      return;
    }
  
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text('Document Report', 14, 20);
  
    // แปลง object result เป็น array แสดงในตาราง
    const rows = Object.entries(result).map(([key, value]) => [key, String(value)]);
  
    autoTable(doc, {
      startY: 30,
      head: [['Field', 'Value']],
      body: rows,
    });
  
    doc.save(`document_${type}_${docId}.pdf`);
  };
  
  return (
    <>
      <h2 className="title">ใบรายงาน (Reports)</h2>
      <div className="rp-container p-6 space-y-6">
        <div>
          <h1 className="text-xl font-semibold mb-2">Print Document</h1>
          <select
            className="rp-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
            >
            <option value="pr">PR</option>
            <option value="po">PO</option>
            <option value="asset">Asset</option>
            <option value="stock">Stock</option>
          </select>
          <input
            className="rp-input border p-2 mr-2"
            placeholder="Document ID"
            value={docId}
            onChange={(e) => setDocId(e.target.value)}
          />
          <button
            onClick={handlePrint}
            className="fetch-button bg-blue-600 text-white px-4 py-2 rounded"
          >
            Fetch Document
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {result && (
            <pre className="bg-gray-100 p-4 mt-4 text-sm rounded max-w-3xl overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
          {result && (
  <div className="bg-white p-6 rounded shadow max-w-3xl mt-6 space-y-4">
    <h2 className="text-lg font-semibold mb-4">รายละเอียดเอกสาร ({type.toUpperCase()})</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(result).map(([key, value]) => (
        <div key={key}>
          <label className="font-medium text-gray-700 capitalize">
            {key.replace(/_/g, ' ')}
          </label>
          <p className="border p-2 rounded bg-gray-50">
            {typeof value === 'string' && value.includes('T') && value.includes(':')
              ? new Date(value).toLocaleString() // แปลง datetime
              : value?.toString()}
          </p>
        </div>
      ))}
    </div>

    <button
      onClick={handleExportPDF}
      className="bg-purple-600 text-white px-4 py-2 rounded mt-4"
    >
      Export PDF
    </button>
  </div>
)}

        </div>

        {/* <div>
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
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {balance !== null && (
            <p className="mt-2 text-md font-medium">Outstanding Balance: ฿{parseFloat(balance).toFixed(2)}</p>
          )}
        </div> */}
      </div>
    </>
  );
}