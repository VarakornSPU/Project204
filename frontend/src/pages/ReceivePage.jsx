import { useState, useEffect } from "react";
import axios from "axios";

const ReceivePage = () => {
  const [poList, setPoList] = useState([]);
  const [poDetail, setPoDetail] = useState(null);
  const [form, setForm] = useState({
    po_id: "",
    description: "",
    quantity: "",
    unit: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("/api/po", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPoList(res.data))
      .catch((err) => {
        console.error("Error loading PO list:", err);
        alert("โหลดใบสั่งซื้อไม่สำเร็จ หรือคุณไม่มีสิทธิ์");
      });
  }, []);

  const handleSelectPO = async (e) => {
    const po_id = e.target.value;
    if (!po_id) {
      setForm({ po_id: "", description: "", quantity: "", unit: "" });
      setPoDetail(null);
      return;
    }

    setForm((prev) => ({ ...prev, po_id }));

    try {
      const res = await axios.get(`/api/po/${po_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const po = res.data;
      setPoDetail(po);

      const item = po.items?.[0]; // กรอกอัตโนมัติแค่รายการแรก
      if (item) {
        setForm((prev) => ({
          ...prev,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
        }));
      }
    } catch (err) {
      console.error("Error fetching PO by ID:", err);
      alert("ไม่สามารถโหลดข้อมูล PO ที่เลือกได้");
    }
  };

  const submit = async () => {
    if (!form.po_id || !form.description || !form.quantity || !form.unit) {
      return alert("กรุณาเลือกใบสั่งซื้อให้ครบ");
    }

    try {
      await axios.post("/api/receipts", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("รับพัสดุเรียบร้อยแล้ว");
      setForm({ po_id: "", description: "", quantity: "", unit: "" });
      setPoDetail(null);
    } catch (err) {
      console.error("Submit error:", err);
      alert("ไม่สามารถบันทึกข้อมูลได้");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">📦 รับพัสดุ</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">เลือกใบสั่งซื้อ</label>
        <select
          name="po_id"
          value={form.po_id}
          onChange={handleSelectPO}
          className="w-full border rounded p-2"
        >
          <option value="">-- กรุณาเลือก --</option>
          {poList.map((po) => (
            <option key={po.id} value={po.id}>
              PO: {po.reference_no}
            </option>
          ))}
        </select>
      </div>

      {poDetail && (
        <div className="mb-4 border rounded p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2 text-blue-700">
            รายละเอียดใบสั่งซื้อ
          </h3>
          <p><strong>PO No:</strong> {poDetail.reference_no}</p>
          <p><strong>ผู้ขาย:</strong> {poDetail?.Vendor?.name || '-'}</p>
          <p><strong>เงื่อนไขการชำระเงิน:</strong> {poDetail.payment_terms}</p>
          <p><strong>ยอดรวม:</strong> ฿{parseFloat(poDetail.total_amount).toFixed(2)}</p>

          <div className="mt-2">
            <h4 className="font-semibold mb-1">📋 รายการสินค้า</h4>
            <ul className="list-disc ml-5">
              {poDetail.items?.map((item, index) => (
                <li key={index}>
                  {item.description} - {item.quantity} {item.unit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1 font-medium">คำอธิบาย</label>
        <input
          name="description"
          value={form.description}
          readOnly
          className="w-full border rounded p-2 bg-gray-100"
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">ปริมาณ</label>
          <input
            name="quantity"
            value={form.quantity}
            readOnly
            className="w-full border rounded p-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">หน่วย</label>
          <input
            name="unit"
            value={form.unit}
            readOnly
            className="w-full border rounded p-2 bg-gray-100"
          />
        </div>
      </div>

      <button
        onClick={submit}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        ✅ บันทึกการรับพัสดุ
      </button>
    </div>
  );
};

export default ReceivePage;
