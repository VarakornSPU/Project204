import { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Create Purchase Order (PO)</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

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

        {items.length > 0 && (
          <table className="w-full table-auto border">
            <thead>
              <tr>
                <th className="border p-2">Description</th>
                <th className="border p-2">Unit</th>
                <th className="border p-2">Unit Price</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{item.description}</td>
                  <td className="border p-2">{item.unit}</td>
                  <td className="border p-2">{item.unit_price.toFixed(2)}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(idx, e.target.value)}
                      className="w-20 border"
                    />
                  </td>
                  <td className="border p-2">{item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {referenceNo && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Reference No</label>
            <input
              className="border p-2 w-full bg-gray-100 text-gray-700"
              type="text"
              value={referenceNo}
              disabled
              readOnly
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          📝 Submit PO
        </button>
      </form>
    </div>
  );
}
