import React, { useState, useEffect } from "react";
import axios from "axios";

function IssuePage() {
  const [stockItems, setStockItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [issuedItems, setIssuedItems] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStockItems();
  }, []);

  const fetchStockItems = async () => {
    try {
      const res = await axios.get("/api/stock-items", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStockItems(res.data);
    } catch (err) {
      setErrorMessage("ไม่สามารถโหลดข้อมูลพัสดุได้");
    }
  };

  const toggleItem = (id) => {
    const exists = selectedItems.find(item => item.stock_item_id === id);
    if (exists) {
      setSelectedItems(selectedItems.filter(item => item.stock_item_id !== id));
    } else {
      setSelectedItems([...selectedItems, { stock_item_id: id, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, qty) => {
    setSelectedItems(prev =>
      prev.map(item =>
        item.stock_item_id === id ? { ...item, quantity: parseInt(qty) } : item
      )
    );
  };

  const submitIssue = async () => {
    try {
      await axios.post("/api/issues", { items: selectedItems }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage("✅ เบิกพัสดุเรียบร้อย");
      setIssuedItems(selectedItems);
      setSelectedItems([]);
      fetchStockItems();
    } catch (e) {
      setErrorMessage("❌ " + (e.response?.data?.error || e.message));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">📦 แบบฟอร์มเบิกพัสดุ</h2>

      {successMessage && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4">{errorMessage}</div>
      )}

      <table className="table-auto w-full border text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border px-2 py-1">เลือก</th>
            <th className="border px-2 py-1">รายการ</th>
            <th className="border px-2 py-1">คงเหลือ</th>
            <th className="border px-2 py-1">จำนวนที่ต้องการ</th>
          </tr>
        </thead>
        <tbody>
          {stockItems.map((item, index) => {
            const selected = selectedItems.find(s => s.stock_item_id === item.id);
            return (
              <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border text-center">
                  <input type="checkbox" checked={!!selected} onChange={() => toggleItem(item.id)} />
                </td>
                <td className="border px-2 py-1">{item.description}</td>
                <td className="border text-center">{item.quantity}</td>
                <td className="border text-center">
                  {selected && (
                    <input
                      type="number"
                      value={selected.quantity}
                      min="1"
                      max={item.quantity}
                      className="w-16 border rounded px-1 text-center"
                      onChange={e => updateQuantity(item.id, e.target.value)}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button
        onClick={submitIssue}
        disabled={selectedItems.length === 0}
        className={`mt-6 px-6 py-2 rounded text-white font-semibold ${
          selectedItems.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        ✅ ยืนยันการเบิก
      </button>

      {issuedItems.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2 text-green-700">📝 รายการที่เบิกล่าสุด:</h3>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {issuedItems.map(item => {
              const stock = stockItems.find(s => s.id === item.stock_item_id);
              return (
                <li key={item.stock_item_id}>
                  {stock ? `${stock.description} - จำนวน ${item.quantity}` : `รหัส ${item.stock_item_id} - จำนวน ${item.quantity}`}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default IssuePage;