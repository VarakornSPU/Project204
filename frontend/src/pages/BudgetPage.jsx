import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from "../components/ui/card";
import { useNavigate } from 'react-router-dom';

const BudgetPage = () => {
  const [budget, setBudget] = useState(null);
  const [error, setError] = useState(null);
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/budgets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.length > 0) {
          setBudget(response.data[0]);
        }
      } catch (err) {
        console.error('Error fetching budget:', err);
        setError('ไม่สามารถโหลดข้อมูลงบประมาณได้');
      }
    };

    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/budgets/report', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(response.data);
      } catch (err) {
        console.error('Error fetching payments:', err);
      }
    };

    fetchBudget();
    fetchPayments();
  }, []);

  const exportToCSV = () => {
    const csvContent = [
      ['เลขที่ PO', 'วันที่ชำระ', 'ผู้ขาย', 'จำนวนเงิน'],
      ...payments.map(p => [
        p.po?.reference_no || `PO#${p.po_id}`,
        new Date(p.payment_date).toLocaleDateString(),
        p.vendor?.name || '-',
        p.amount
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `รายงานงบประมาณ.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!budget) {
    return <div className="text-center mt-4">กำลังโหลดข้อมูล...</div>;
  }

  const remaining = parseFloat(budget.initial_amount) - parseFloat(budget.used_amount);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">งบประมาณประจำปี {budget.year}</h1>
      <Card className="max-w-md mx-auto shadow-xl mb-8">
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>งบประมาณทั้งหมด:</span>
            <span>{parseFloat(budget.initial_amount).toLocaleString()} บาท</span>
          </div>
          <div className="flex justify-between">
            <span>ยอดที่ใช้ไป:</span>
            <span>{parseFloat(budget.used_amount).toLocaleString()} บาท</span>
          </div>
          <div className="flex justify-between font-semibold text-green-600">
            <span>ยอดคงเหลือ:</span>
            <span>{remaining.toLocaleString()} บาท</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">💸 รายการชำระเงินที่ใช้งบประมาณ</h2>
        <button onClick={exportToCSV} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Export CSV</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">เลขที่ PO</th>
              <th className="p-2 border">วันที่ชำระ</th>
              <th className="p-2 border">ผู้ขาย</th>
              <th className="p-2 border">จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((pmt, index) => (
              <tr key={index} className="text-center">
                <td className="p-2 border">{pmt.po?.reference_no || `PO#${pmt.po_id}`}</td>
                <td className="p-2 border">{new Date(pmt.payment_date).toLocaleDateString()}</td>
                <td className="p-2 border">{pmt.vendor?.name || '-'}</td>
                <td className="p-2 border">{parseFloat(pmt.amount).toLocaleString()} บาท</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">ไม่มีข้อมูลการชำระเงิน</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetPage;
