// src/pages/PRPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PRPage() {
  const [items, setItems] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
      } catch (err) {
        console.error("ไม่สามารถโหลดสินค้าได้", err);
      }
    };
    fetchItems();
  }, []);

  const addRow = () => {
    setRows([...rows, { item_id: "", quantity: 1, unit_price: 0, total: 0 }]);
  };

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    if (field === "item_id") {
      const selectedItem = items.find((item) => item.id === parseInt(value));
      if (selectedItem) {
        updatedRows[index] = {
          item_id: selectedItem.id,
          quantity: 1,
          unit_price: parseFloat(selectedItem.unit_price),
          total: parseFloat(selectedItem.unit_price),
        };
      }
    } else if (field === "quantity") {
      const quantity = parseInt(value);
      updatedRows[index].quantity = quantity;
      updatedRows[index].total = updatedRows[index].unit_price * quantity;
    }
    setRows(updatedRows);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/pr",
        {
          description: "รายการเบิกพัสดุทั่วไป",
          items: rows.map((r) => ({
            item_id: r.item_id,
            quantity: r.quantity,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ สร้าง PR สำเร็จ!");
      setRows([]);
    } catch (err) {
      console.error("❌ สร้าง PR ล้มเหลว", err);
      alert("❌ สร้าง PR ล้มเหลว");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">สร้างใบขอซื้อ (Purchase Request - PR)</h1>
      <button
        onClick={addRow}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        + เพิ่มสินค้า
      </button>

      <table className="table-auto w-full border mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">สินค้า</th>
            <th className="p-2 border">จำนวน</th>
            <th className="p-2 border">ราคาต่อหน่วย</th>
            <th className="p-2 border">รวม</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="border p-1">
                <select
                  value={row.item_id}
                  onChange={(e) =>
                    handleChange(index, "item_id", e.target.value)
                  }
                  className="w-full border p-1"
                >
                  <option value="">-- เลือกสินค้า --</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.unit})
                    </option>
                  ))}
                </select>
              </td>
              <td className="border p-1">
                <input
                  type="number"
                  min="1"
                  value={row.quantity}
                  onChange={(e) =>
                    handleChange(index, "quantity", e.target.value)
                  }
                  className="w-full border p-1"
                />
              </td>
              <td className="border text-center">{row.unit_price.toFixed(2)}</td>
              <td className="border text-center">{row.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSubmit}
        className="mt-2 px-6 py-2 bg-green-600 text-white rounded"
      >
        ✅ สร้างใบ PR
      </button>
    </div>
  );
}
