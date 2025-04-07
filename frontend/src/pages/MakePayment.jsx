import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';

const MakePayment = () => {
  const [invoices, setInvoices] = useState([]);
  const [formData, setFormData] = useState({
    invoice_id: '',
    payment_date: '',
    payment_method: 'transfer',
    payment_proof: null
  });

  useEffect(() => {
    axios.get('/api/payments/pending')
      .then(res => setInvoices(res.data))
      .catch(err => console.error('Error fetching invoices:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'payment_proof') {
      setFormData({ ...formData, payment_proof: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      await axios.post('/api/payments/pay', data);
      alert('ชำระเงินเรียบร้อยแล้ว');
      setFormData({
        invoice_id: '',
        payment_date: '',
        payment_method: 'transfer',
        payment_proof: null
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('ไม่สามารถทำการชำระเงินได้');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <h2 className="text-xl font-bold mb-4">💸 บันทึกการชำระเงิน</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">เลือกใบแจ้งหนี้</label>
          <select name="invoice_id" value={formData.invoice_id} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="">-- เลือก --</option>
            {invoices.map(inv => (
              <option key={inv.id} value={inv.id}>
                {inv.invoice_number} - {inv.total_amount} บาท (ครบกำหนด: {inv.due_date})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">วันที่ชำระ</label>
          <input type="date" name="payment_date" value={formData.payment_date} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>

        <div>
          <label className="block font-medium mb-1">วิธีชำระเงิน</label>
          <select name="payment_method" value={formData.payment_method} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="transfer">โอนเงิน</option>
            <option value="cash">เงินสด</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">แนบหลักฐานการโอน (ถ้ามี)</label>
          <input type="file" name="payment_proof" onChange={handleChange} className="w-full" accept="image/*,application/pdf" />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          ✅ บันทึกการชำระเงิน
        </button>
      </form>
    </div>
  );
};

export default MakePayment;