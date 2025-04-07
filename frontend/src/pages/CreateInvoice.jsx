// Project204/frontend/src/pages/CreateInvoice.jsx
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const CreateInvoice = () => {
  const [poList, setPoList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [formData, setFormData] = useState({
    po_id: "",
    vendor_id: "",
    invoice_number: "",
    invoice_date: "",
    due_date: "",
    total_amount: "",
    status: "pending",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [poRes, vendorRes, numberRes] = await Promise.all([
          axios.get("/api/invoices/pos"),
          axios.get("/api/invoices/vendors"),
          axios.get("/api/invoices/next-number"),
        ]);
        setPoList(poRes.data);
        setVendorList(vendorRes.data);
        setFormData((prev) => ({
          ...prev,
          invoice_number: numberRes.data.invoice_number,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // กรณีเลือก PO → Autofill vendor_id และ total_amount
    if (name === "po_id") {
      const selectedPO = poList.find((po) => po.id === parseInt(value));
      if (selectedPO) {
        setFormData((prev) => ({
          ...prev,
          po_id: value,
          vendor_id: selectedPO.vendor_id || "",
          total_amount: selectedPO.total_amount || "",
        }));
      } else {
        setFormData((prev) => ({ ...prev, po_id: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/invoices", formData);
      alert("Invoice created successfully!");

      // ✅ ดึงเลขใบแจ้งหนี้ใหม่
      const numberRes = await axios.get("/api/invoices/next-number");

      // ✅ เคลียร์ฟอร์มกลับเป็นค่าว่าง ยกเว้นเลขใบแจ้งหนี้ใหม่
      setFormData({
        po_id: "",
        vendor_id: "",
        invoice_number: numberRes.data.invoice_number,
        invoice_date: "",
        due_date: "",
        total_amount: "",
        status: "pending",
      });
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6">สร้างใบแจ้งหนี้ (Invoice)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* เลือก PO */}
        <div>
          <label className="block mb-1 font-semibold">
            เลือกใบสั่งซื้อ (PO)
          </label>
          <select
            name="po_id"
            value={formData.po_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- เลือก PO --</option>
            {poList.map((po) => (
              <option key={po.id} value={po.id}>
                PO#{po.id} - {po.reference_no || ""} - ยอด {po.total_amount} บาท
              </option>
            ))}
          </select>
        </div>

        {/* Autofill Vendor */}
        <div>
          <label className="block mb-1 font-semibold">ผู้ขาย (Vendor)</label>
          <select
            name="vendor_id"
            value={formData.vendor_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            disabled // 🔒 ห้ามแก้เอง เพราะ autofill จาก PO
          >
            <option value="">-- เลือกผู้ขาย --</option>
            {vendorList.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </select>
        </div>

        {/* กรอกข้อมูลใบแจ้งหนี้ */}
        <div>
          <label className="block mb-1 font-semibold">เลขที่ใบแจ้งหนี้</label>
          <input
            type="text"
            name="invoice_number"
            value={formData.invoice_number}
            className="w-full p-2 border rounded bg-gray-100"
            readOnly
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">วันที่ใบแจ้งหนี้</label>
          <input
            type="date"
            name="invoice_date"
            value={formData.invoice_date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">วันที่ครบกำหนด</label>
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">ยอดรวม (บาท)</label>
          <input
            type="number"
            name="total_amount"
            value={formData.total_amount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            readOnly // 🔒 ไม่ให้กรอกเอง เพราะ autofill จาก PO
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">สถานะ</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="unpaid">ยังไม่ชำระ</option>
            <option value="paid">ชำระแล้ว</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          บันทึกใบแจ้งหนี้
        </button>
      </form>
    </div>
  );
};

export default CreateInvoice;
