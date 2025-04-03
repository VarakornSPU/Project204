import { useState } from 'react';
import axios from 'axios';

export default function MakePayment() {
  const [poId, setPoId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentProof, setPaymentProof] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/api/payment/pay',
        {
          po_id: poId,
          amount,
          payment_proof: paymentProof
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Payment submitted successfully');
    } catch (err) {
      alert('Failed to submit payment');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Make Payment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border p-2 w-full"
          type="text"
          placeholder="PO ID"
          value={poId}
          onChange={(e) => setPoId(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          type="text"
          placeholder="Payment Proof (URL or Ref)"
          value={paymentProof}
          onChange={(e) => setPaymentProof(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
}
