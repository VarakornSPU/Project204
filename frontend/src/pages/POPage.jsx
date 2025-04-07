import { useState, useEffect } from "react";
import axios from "axios";
import "./POPage.css";
import "../app.css"

export default function POPage() {
  const [vendors, setVendors] = useState([]);
  const [prs, setPRs] = useState([]);
  const [selectedPR, setSelectedPR] = useState(null);
  const [vendorId, setVendorId] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [items, setItems] = useState([]);
  const [referenceNo, setReferenceNo] = useState("");
  const [poDate] = useState(new Date().toISOString().slice(0, 10));
  const [vendorContact, setVendorContact] = useState("");
  const [poSubject, setPoSubject] = useState("");
  const [requiredDate, setRequiredDate] = useState("");
  const [prNumber, setPrNumber] = useState("");
  const [budget, setBudget] = useState({ initial_amount: 0, used_amount: 0 });

  useEffect(() => {
    fetchData();
    fetchBudget();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [vendorRes, prRes] = await Promise.all([
        axios.get("/api/vendors", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/pr/available-for-po", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setVendors(vendorRes.data);
      setPRs(prRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBudget = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/api/budgets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = res.data[0];
      setBudget({
        ...raw,
        initial_amount: parseFloat(raw.initial_amount),
        used_amount: parseFloat(raw.used_amount),
      });
    } catch (err) {
      console.error("Failed to fetch budget", err);
    }
  };

  const handleSelectPR = (e) => {
    const prId = e.target.value;
    setSelectedPR(prId);
    setReferenceNo(`PO${Date.now()}`);
    setPoSubject("");
    setRequiredDate("");
    setPrNumber("");
    setItems([]);

    const pr = prs.find((p) => p.id === parseInt(prId));
    if (pr) {
      setPoSubject(pr.description);
      setRequiredDate(pr.required_date);
      setPrNumber(pr.pr_number);
      const poItems = pr.pr_details.map((detail) => ({
        description: `${detail.item?.name || ""} - ${detail.item?.description || ""}`.trim(),
        unit: detail.item?.unit || "",
        unit_price: parseFloat(detail.unit_price),
        quantity: detail.quantity,
        amount: parseFloat(detail.unit_price) * detail.quantity,
      }));
      setItems(poItems);
    }
  };

  const handleSelectVendor = (e) => {
    const id = e.target.value;
    setVendorId(id);
    const vendor = vendors.find((v) => v.id === parseInt(id));
    setVendorContact(vendor?.contact || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!selectedPR || !vendorId || !paymentTerms || items.length === 0) {
      return alert("❌ กรุณากรอกข้อมูลให้ครบถ้วน");
    }

    const hasInvalidItem = items.some(
      (i) => !i.description || !i.unit || i.unit_price <= 0 || i.quantity <= 0 || i.amount <= 0
    );
    if (hasInvalidItem) {
      return alert("❌ รายการสินค้าไม่ถูกต้อง");
    }

    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const remaining = budget.initial_amount - budget.used_amount;
    if (totalAmount > remaining) {
      return alert("❌ งบประมาณคงเหลือไม่เพียงพอสำหรับการสร้าง PO");
    }

    try {
      const res = await axios.post(
        "/api/po",
        {
          pr_id: parseInt(selectedPR),
          vendor_id: parseInt(vendorId),
          payment_terms: paymentTerms,
          reference_no: referenceNo,
          items,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`✅ PO created: ${res.data.reference_no}`);

      // Reset form
      setSelectedPR(null);
      setVendorId("");
      setVendorContact("");
      setPaymentTerms("");
      setItems([]);
      setReferenceNo("");
      setPoSubject("");
      setRequiredDate("");
      setPrNumber("");
      fetchBudget();

      const updatedPRs = await axios.get("/api/pr/available-for-po", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPRs(updatedPRs.data);
    } catch (err) {
      console.error(err);
      alert(`❌ Failed to create PO: ${err.response?.data?.message || "Unknown error"}`);
    }
  };

  return (
    <>
      <h1 className="title">Create Purchase Order (PO)</h1>
      <div className="po-container">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="receipt-container">
            <div className="receipt-header">🛒 Purchase Order</div>
            <p><strong>PO Date:</strong> {poDate}</p>
            <p><strong>Vendor:</strong> {vendors.find((v) => v.id === parseInt(vendorId))?.name || "-"}</p>
            <p><strong>Vendor Contact:</strong> {vendorContact}</p>
            <p><strong>Subject:</strong> {poSubject}</p>
            <p><strong>Required Date:</strong> {requiredDate}</p>
            <p><strong>Referenced PR No:</strong> {prNumber}</p>
            <p><strong>Payment Terms:</strong> {paymentTerms}</p>
            <p><strong>Reference No:</strong> {referenceNo}</p>
        <div className="po-input mb-4 p-3 bg-gray-100 rounded">
        <p>
          💰 <strong>งบประมาณ:</strong> {new Date().getFullYear()} | รวม: ฿
          {budget.initial_amount.toFixed(2)} | ใช้ไป: ฿
          {budget.used_amount.toFixed(2)} | คงเหลือ: ฿
          {(budget.initial_amount - budget.used_amount).toFixed(2)}
        </p>
        </div>

            <table className="receipt-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Unit</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.description}</td>
                    <td>{item.unit}</td>
                    <td>{item.unit_price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>{item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="receipt-total">
              Total: ฿{items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
            </div>
          </div>

          <select className="po-select border p-2 w-full" value={selectedPR || ""} onChange={handleSelectPR}>
            <option value="">📋 Select Approved PR<span className="po-required text-red-500">*</span></option>
            {prs.map((pr) => (
              <option key={pr.id} value={pr.id}>
                {pr.pr_number} - {pr.description}
              </option>
            ))}
          </select>

          <select className="po-select border p-2 w-full" value={vendorId} onChange={handleSelectVendor}>
            <option value="">🏢 Select Vendor<span className="po-required text-red-500">*</span></option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>

          <select className="po-select border p-2 w-full" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}>
            <option value="">💳 Payment Terms<span className="po-required text-red-500">*</span></option>
            <option value="เครดิต 30 วัน">เครดิต 30 วัน</option>
            <option value="จ่ายทันที">จ่ายทันที</option>
            <option value="เช็ควาง 60 วัน">เช็ควาง 60 วัน</option>
          </select>

          <button type="submit" className="po-submit  text-white px-4 py-2 rounded">
            📝 ยืนยัน
          </button>
        </form>
      </div>
    </>
  );
}