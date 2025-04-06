import React, { useEffect, useState } from "react";
import axios from "axios";

const PRPage = () => {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    pr_number: "",
    created_date: "",
    description: "",
    required_date: "",
    items: [{ item_id: "", quantity: 1 }],
  });
  const [latestPR, setLatestPR] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchItems();
    fetchUser();
    generatePrNumber();
  }, []);

  const fetchItems = async () => {
    const res = await axios.get("/api/items", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setItems(res.data);
  };

  const fetchUser = async () => {
    const res = await axios.get("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data);
  };

  const generatePrNumber = async () => {
    const res = await axios.get("/api/pr/generate-number", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForm((prev) => ({ ...prev, pr_number: res.data.pr_number }));
  };

  const handleChange = (index, field, value) => {
    const updated = [...form.items];
    updated[index][field] = field === "quantity" ? Number(value) : value;
    setForm({ ...form, items: updated });
  };

  const addRow = () => {
    setForm({
      ...form,
      items: [...form.items, { item_id: "", quantity: 1 }],
    });
  };

  const removeRow = (index) => {
    if (form.items.length === 1) return;
    const updated = [...form.items];
    updated.splice(index, 1);
    setForm({ ...form, items: updated });
  };

  const handleSubmit = async () => {
    const preparedItems = form.items.map((row) => {
      const selectedItem = items.find((i) => i.id === Number(row.item_id));
      return {
        item_id: row.item_id,
        quantity: row.quantity,
        unit_price: selectedItem?.unit_price || 0,
      };
    });

    const hasEmpty = preparedItems.some((i) => !i.item_id);
    if (hasEmpty) return alert("กรุณาเลือกรายการสินค้าให้ครบ");

    try {
      const res = await axios.post(
        "/api/pr",
        {
          ...form,
          items: preparedItems,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("สร้างใบขอซื้อสำเร็จ");
      setLatestPR(res.data);
      setForm({
        pr_number: "",
        created_date: "",
        description: "",
        required_date: "",
        items: [{ item_id: "", quantity: 1 }],
      });
      generatePrNumber();
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถสร้าง PR ได้");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">สร้างใบขอซื้อ (Purchase Request)</h2>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-medium mb-1">เลขที่ใบขอซื้อ</label>
          <input
            type="text"
            className="w-full border p-2 bg-gray-100"
            value={form.pr_number}
            readOnly
          />
        </div>
        <div>
          <label className="block font-medium mb-1">ผู้จัดทำ</label>
          <input
            type="text"
            className="w-full border p-2 bg-gray-100"
            value={user ? `${user.first_name} ${user.last_name}` : ""}
            readOnly
          />
        </div>
        <div>
          <label className="block font-medium mb-1">วันที่</label>
          <input
            type="date"
            className="w-full border p-2"
            value={form.created_date}
            onChange={(e) => setForm({ ...form, created_date: e.target.value })}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">คำอธิบายหัวรายการ</label>
        <input
          type="text"
          className="w-full border p-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-1">วันที่ต้องการ</label>
        <input
          type="date"
          className="w-full border p-2"
          value={form.required_date}
          onChange={(e) => setForm({ ...form, required_date: e.target.value })}
        />
      </div>

      <h3 className="font-semibold text-lg mb-2">รายการพัสดุ</h3>
      <div className="grid grid-cols-6 gap-2 font-bold text-sm bg-gray-100 p-2 rounded mb-2">
        <div>ชื่อสินค้า</div>
        <div>หน่วยนับ</div>
        <div>จำนวน</div>
        <div>ราคาต่อหน่วย</div>
        <div>จำนวนเงิน</div>
        <div></div>
      </div>

      {form.items.map((row, index) => {
        const selected = items.find((i) => i.id === Number(row.item_id));
        return (
          <div key={index} className="grid grid-cols-6 gap-2 mb-2 items-center">
            <select
              className="border p-2"
              value={row.item_id}
              onChange={(e) => handleChange(index, "item_id", e.target.value)}
            >
              <option value="">-- เลือกสินค้า --</option>
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="border p-2 bg-gray-100"
              readOnly
              value={selected?.unit || ""}
              placeholder="หน่วย"
            />

            <input
              type="number"
              className="border p-2"
              value={row.quantity}
              placeholder="จำนวน"
              onChange={(e) => handleChange(index, "quantity", e.target.value)}
            />

            <input
              type="text"
              className="border p-2 bg-gray-100"
              readOnly
              value={selected?.unit_price || ""}
              placeholder="ราคาต่อหน่วย"
            />

            <input
              type="text"
              className="border p-2 bg-gray-100"
              readOnly
              value={
                selected
                  ? (row.quantity * selected.unit_price).toFixed(2)
                  : ""
              }
              placeholder="จำนวนเงิน"
            />

            {form.items.length > 1 && (
              <button onClick={() => removeRow(index)} className="text-red-500">
                ลบ
              </button>
            )}
          </div>
        );
      })}

      <button
        onClick={addRow}
        className="bg-gray-200 px-3 py-1 rounded mb-4 mt-2"
      >
        + เพิ่มรายการ
      </button>

      <p className="text-right font-bold text-lg mb-4">
        รวมทั้งสิ้น: {form.items.reduce((sum, row) => {
          const selected = items.find((i) => i.id === Number(row.item_id));
          return sum + (selected ? row.quantity * selected.unit_price : 0);
        }, 0).toFixed(2)} บาท
      </p>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        บันทึกใบขอซื้อ
      </button>
    </div>
  );
};

export default PRPage;
