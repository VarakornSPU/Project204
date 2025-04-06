import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { Dialog } from '@headlessui/react';
import { CheckCircle, XCircle } from 'lucide-react';

const ApprovePRPage = () => {
  const [prs, setPrs] = useState([]);
  const [selectedPR, setSelectedPR] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // 'approve' or 'reject'
  const [showDialog, setShowDialog] = useState(false);
  const [showResult, setShowResult] = useState(null); // { type: 'approve' | 'reject', message: string }

  useEffect(() => {
    const fetchWaitingPRs = async () => {
      try {
        const res = await axios.get('/api/pr/waiting-approval');
        setPrs(res.data);
      } catch (err) {
        console.error('Error fetching PRs:', err);
      }
    };
    fetchWaitingPRs();
  }, []);

  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => setShowResult(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [showResult]);

  const handleApprove = async (id) => {
    try {
      await axios.post(`/api/pr/approve/${id}`);
      setPrs(prs.filter((pr) => pr.id !== id));
      setSelectedPR(null);
      setShowResult({ type: 'approve', message: '✅ อนุมัติเรียบร้อยแล้ว' });
    } catch (err) {
      console.error('Error approving PR:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`/api/pr/reject/${id}`);
      setPrs(prs.filter((pr) => pr.id !== id));
      setSelectedPR(null);
      setShowResult({ type: 'reject', message: '🚫 ไม่อนุมัติเรียบร้อยแล้ว' });
    } catch (err) {
      console.error('Error rejecting PR:', err);
    }
  };

  const handleDetail = (pr) => {
    setSelectedPR(pr);
  };

  const openConfirmDialog = (action) => {
    setConfirmAction(action);
    setShowDialog(true);
  };

  const confirmActionHandler = () => {
    setShowDialog(false);
    if (confirmAction === 'approve') {
      handleApprove(selectedPR.id);
    } else if (confirmAction === 'reject') {
      handleReject(selectedPR.id);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">✅ อนุมัติใบขอซื้อ (Purchase Requests)</h1>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <Dialog.Title className="text-xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
              {confirmAction === 'approve' ? <CheckCircle className="text-green-600" /> : <XCircle className="text-red-600" />}
              {confirmAction === 'approve' ? 'ยืนยันการอนุมัติ' : 'ยืนยันการไม่อนุมัติ'}
            </Dialog.Title>
            <p className="mb-6 text-gray-600">คุณแน่ใจหรือไม่ว่าต้องการ{confirmAction === 'approve' ? 'อนุมัติ' : 'ไม่อนุมัติ'}ใบขอซื้อนี้?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDialog(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700">
                ยกเลิก
              </button>
              <button
                onClick={confirmActionHandler}
                className={`px-4 py-2 rounded-lg text-white font-semibold ${confirmAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                ยืนยัน
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {showResult && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-white ${showResult.type === 'approve' ? 'bg-green-500' : 'bg-red-500'}`}> 
          {showResult.message}
        </div>
      )}

      {selectedPR && (
        <div className="border p-6 mb-6 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📄 รายละเอียด PR: {selectedPR.pr_number}</h2>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <p><strong>คำอธิบาย:</strong> {selectedPR.description}</p>
            <p><strong>วันที่ต้องการ:</strong> {new Date(selectedPR.required_date).toLocaleDateString()}</p>
            <p><strong>จำนวนเงินรวม:</strong> {selectedPR.total_amount}</p>
            <p><strong>ผู้จัดทำ:</strong> {selectedPR.created_user?.first_name} {selectedPR.created_user?.last_name}</p>
            <p><strong>วันที่สร้าง:</strong> {new Date(selectedPR.createdAt).toLocaleDateString()}</p>
          </div>

          <table className="w-full mt-6 border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ชื่อสินค้า</th>
                <th className="p-2 border">จำนวน</th>
                <th className="p-2 border">ราคาต่อหน่วย</th>
                <th className="p-2 border">ราคารวม</th>
              </tr>
            </thead>
            <tbody>
              {selectedPR.pr_details.map((detail) => (
                <tr key={detail.id} className="border-t text-center">
                  <td className="p-2 border">{detail.item?.name}</td>
                  <td className="p-2 border">{detail.quantity}</td>
                  <td className="p-2 border">{detail.unit_price}</td>
                  <td className="p-2 border">{detail.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex gap-3 justify-end">
            <button onClick={() => openConfirmDialog('approve')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">✅ อนุมัติ</button>
            <button onClick={() => openConfirmDialog('reject')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">🚫 ไม่อนุมัติ</button>
            <button onClick={() => setSelectedPR(null)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg">🔙 กลับ</button>
          </div>
        </div>
      )}

      {prs.length === 0 ? (
        <p className="text-gray-600">ไม่มีใบขอซื้อที่รออนุมัติ</p>
      ) : (
        <table className="w-full border rounded shadow-sm">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="p-2 border">เลขที่</th>
              <th className="p-2 border">คำอธิบาย</th>
              <th className="p-2 border">จำนวนเงินรวม</th>
              <th className="p-2 border">วันที่ต้องการ</th>
              <th className="p-2 border">สถานะ</th>
              <th className="p-2 border">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {prs.map((pr) => (
              <tr key={pr.id} className="border-t hover:bg-gray-50">
                <td className="p-2 border text-center">{pr.pr_number}</td>
                <td className="p-2 border">{pr.description}</td>
                <td className="p-2 border text-center">{pr.total_amount}</td>
                <td className="p-2 border text-center">{new Date(pr.required_date).toLocaleDateString()}</td>
                <td className="p-2 border text-center">{pr.status}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleDetail(pr)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                  >
                    ดูรายละเอียด
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApprovePRPage;