import React, { useEffect, useState } from "react";
import axios from "axios";
import "../pages/PRPage.css";
import "../app.css";

const PRPage = () => {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [budget, setBudget] = useState({ initial_amount: 0, used_amount: 0 });
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
    fetchBudget();
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

  const fetchBudget = async () => {
    const res = await axios.get("/api/budgets", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const raw = res.data[0];
    setBudget({
      ...raw,
      initial_amount: parseFloat(raw.initial_amount),
      used_amount: parseFloat(raw.used_amount),
    });
  };

  const generatePrNumber = async () => {
    const res = await axios.get("/api/pr/generate-number", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForm((prev) => ({ ...prev, pr_number: res.data.pr_number }));
  };

  const handleChange = (index, field, value) => {
    const updated = [...form.items];
    const val = field === "quantity" ? Number(value) : value;

    if (field === "quantity" && val < 0) return; // Prevent negative

    updated[index][field] = val;
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

    const hasNegative = preparedItems.some((i) => i.quantity < 0);
    if (hasNegative) return alert("❌ ห้ามใส่จำนวนติดลบ");

    const totalAmount = preparedItems.reduce(
      (sum, i) => sum + i.unit_price * i.quantity,
      0
    );

    const remaining = budget.initial_amount - budget.used_amount;
    if (totalAmount > remaining) {
      return alert("❌ งบประมาณคงเหลือไม่เพียงพอ");
    }

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

      alert("✅ สร้างใบขอซื้อสำเร็จ");
      setLatestPR(res.data);
      setForm({
        pr_number: "",
        created_date: "",
        description: "",
        required_date: "",
        items: [{ item_id: "", quantity: 1 }],
      });
      generatePrNumber();
      fetchBudget();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message?.includes("งบประมาณ")) {
        alert("❌ " + err.response.data.message);
      } else {
        alert("ไม่สามารถสร้าง PR ได้");
      }
    }
  };

  return (
    <>
      <h2 className="title">สร้างใบขอซื้อ (Purchase Request)</h2>
      <div className="pr-container">
        <div className="pr-input mb-4 p-3 bg-gray-100 rounded">
          <p>
            💰 <strong>งบประมาณ:</strong> {new Date().getFullYear()} | รวม: ฿
            {budget.initial_amount.toFixed(2)} | ใช้ไป: ฿
            {budget.used_amount.toFixed(2)} | คงเหลือ: ฿
            {(budget.initial_amount - budget.used_amount).toFixed(2)}
          </p>
        </div>

        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">เลขที่ใบขอซื้อ</label>
            <input
              type="text"
              className="pr-input w-full border p-2 bg-gray-100"
              value={form.pr_number}
              readOnly
            />
          </div>
          <div>
            <label className="block font-medium mb-1">ผู้จัดทำ</label>
            <input
              type="text"
              className="pr-input w-full border p-2 bg-gray-100"
              value={user ? `${user.first_name} ${user.last_name}` : ""}
              readOnly
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              วันที่<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="pr-select w-full border p-2"
              value={form.created_date}
              onChange={(e) =>
                setForm({ ...form, created_date: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">คำอธิบายหัวรายการ</label>
          <input
            type="text"
            className="pr-select w-full border p-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-1">
            วันที่ต้องการ <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className="pr-select w-full border p-2"
            value={form.required_date}
            onChange={(e) =>
              setForm({ ...form, required_date: e.target.value })
            }
            required
          />
        </div>

        <h3 className="font-semibold text-lg mb-2">
          รายการพัสดุ<span className="text-red-500">*</span>
        </h3>
        <div className="pr-header grid grid-cols-6 gap-2 font-bold text-sm bg-gray-100 p-2 rounded mb-2">
          <div>ชื่อสินค้า</div>
          <div>หน่วยนับ</div>
          <div>จำนวน</div>
          <div>ราคาต่อหน่วย</div>
          <div>จำนวนเงิน</div>
        </div>

        <div className="pr-container-scroll">
          {form.items.map((row, index) => {
            const selected = items.find((i) => i.id === Number(row.item_id));
            return (
              <div
                key={index}
                className="grid grid-cols-6 gap-2 mb-2 items-center"
              >
                <select
                  className="pr-select border p-2"
                  value={row.item_id}
                  onChange={(e) =>
                    handleChange(index, "item_id", e.target.value)
                  }
                >
                  <option value="">เลือกสินค้า</option>
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  className="pr-input border p-2 bg-gray-100"
                  readOnly
                  value={selected?.unit || ""}
                  placeholder="หน่วย"
                />

                <input
                  type="number"
                  className="pr-select border p-2"
                  value={row.quantity}
                  placeholder="จำนวน"
                  min="1"
                  onChange={(e) =>
                    handleChange(index, "quantity", e.target.value)
                  }
                />

                <input
                  type="text"
                  className="pr-input border p-2 bg-gray-100"
                  readOnly
                  value={selected?.unit_price || ""}
                  placeholder="ราคาต่อหน่วย"
                />

                <input
                  type="text"
                  className="pr-input border p-2 bg-gray-100"
                  readOnly
                  value={
                    selected
                      ? (row.quantity * selected.unit_price).toFixed(2)
                      : ""
                  }
                  placeholder="จำนวนเงิน"
                />

                {form.items.length > 1 && (
                  <button
                    onClick={() => removeRow(index)}
                    className="text-red-500"
                  >
                    ลบ
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* ปุ่มและยอดรวม */}
        <div className="button-container">
          <button
            onClick={addRow}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 shadow-lg transition duration-300"
          >
            เพิ่มรายการ
          </button>
          <button
            onClick={handleSubmit}
            className="submit-pr bg-blue-600 text-white px-4 py-2 rounded"
          >
            บันทึก
          </button>
        </div>

        <p className="total-amount text-right font-bold text-lg mb-4">
          รวมทั้งสิ้น:{" "}
          {form.items
            .reduce((sum, row) => {
              const selected = items.find((i) => i.id === Number(row.item_id));
              return sum + (selected ? row.quantity * selected.unit_price : 0);
            }, 0)
            .toFixed(2)}{" "}
          บาท
        </p>
      </div>
    </>
  );
};

export default PRPage;
