import { useState, useEffect } from 'react';
import axios from 'axios';
import './POPage.css';

export default function POPage() {
  const [vendors, setVendors] = useState([]);
  const [prs, setPRs] = useState([]);
  const [selectedPR, setSelectedPR] = useState(null);
  const [vendorId, setVendorId] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [items, setItems] = useState([]);
  const [referenceNo, setReferenceNo] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const [vendorRes, prRes] = await Promise.all([
          axios.get('http://localhost:5000/api/vendors', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/pr', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setVendors(vendorRes.data);
        setPRs(prRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleSelectPR = async (e) => {
    const prId = e.target.value;
    setSelectedPR(prId);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`http://localhost:5000/api/pr/${prId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const poItems = res.data.PRDetails.map((detail) => ({
        description: detail.Item.name,
        unit: detail.Item.unit,
        unit_price: parseFloat(detail.unit_price),
        quantity: detail.quantity,
        amount: parseFloat(detail.unit_price) * detail.quantity,
      }));
      setItems(poItems);
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = (index, quantity) => {
    const updated = [...items];
    updated[index].quantity = parseInt(quantity);
    updated[index].amount = updated[index].unit_price * quantity;
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!selectedPR || !vendorId || !paymentTerms || items.length === 0) {
      alert('❌ กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const hasInvalidItem = items.some(
      (i) =>
        !i.description ||
        !i.unit ||
        i.unit_price <= 0 ||
        i.quantity <= 0 ||
        i.amount <= 0
    );
    if (hasInvalidItem) {
      alert('❌ รายการสินค้าไม่ถูกต้อง');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/po',
        {
          pr_id: parseInt(selectedPR),
          vendor_id: parseInt(vendorId),
          payment_terms: paymentTerms,
          items,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReferenceNo(res.data.reference_no);
      alert(`✅ PO created: ${res.data.reference_no}`);
    } catch (err) {
      console.error(err);
      alert(`❌ Failed to create PO: ${err.response?.data?.message || 'Unknown error'}`);
    }
  };

  return (
    <>
    <h1 className="po-title">Create Purchase Order (PO)</h1>
    <div className="po-container">
      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="receipt-container">
  <div className="receipt-header">🛒 Purchase Order</div>

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

  {referenceNo && <div className="receipt-footer">Ref No: {referenceNo}</div>}
</div>

        <select
          className="border p-2 w-full"
          value={selectedPR || ''}
          onChange={handleSelectPR}
        >
          <option value="">📋 Select PR</option>
          {prs.map((pr) => (
            <option key={pr.id} value={pr.id}>
              {pr.pr_number} - {pr.description}
            </option>
          ))}
        </select>

        <select
          className="border p-2 w-full"
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
        >
          <option value="">🏢 Select Vendor</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 w-full"
          value={paymentTerms}
          onChange={(e) => setPaymentTerms(e.target.value)}
        >
          <option value="">💳 Payment Terms</option>
          <option value="เครดิต 30 วัน">เครดิต 30 วัน</option>
          <option value="จ่ายทันที">จ่ายทันที</option>
          <option value="เช็ควาง 60 วัน">เช็ควาง 60 วัน</option>
        </select>

        <button
          type="submit"
          className="po-submit bg-blue-600 text-white px-4 py-2 rounded"
        >
          📝 Submit PO
        </button>
      </form>
    </div>
    </>
  );
}
