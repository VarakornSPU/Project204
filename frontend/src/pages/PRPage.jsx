// src/pages/PRPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PRPage.css";

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

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
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
    <div className="pr-container">
      <h1 className="pr-title">สร้างใบขอซื้อ (Purchase Request - PR)</h1>

      <table className="pr-table">
        <thead>
          <tr>
            <th>สินค้า</th>
            <th>จำนวน</th>
            <th>ราคาต่อหน่วย</th>
            <th>รวม</th>
            <th>ลบ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <select
                  value={row.item_id}
                  onChange={(e) =>
                    handleChange(index, "item_id", e.target.value)
                  }
                >
                  <option value="">-- เลือกสินค้า --</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.unit})
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={row.quantity}
                  onChange={(e) =>
                    handleChange(index, "quantity", e.target.value)
                  }
                />
              </td>
              <td>{row.unit_price.toFixed(2)}</td>
              <td>{row.total.toFixed(2)}</td>
              <td>
                <button
                  onClick={() => handleDeleteRow(index)}
                  className="delete-button"
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="button-container">
        <button onClick={addRow} className="pr-button add-item">
          + เพิ่มสินค้า
        </button>
        <button onClick={handleSubmit} className="pr-button submit-pr">
          ✅ สร้างใบ PR
        </button>
      </div>
    </div>
  );
}
