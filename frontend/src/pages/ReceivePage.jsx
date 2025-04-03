import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ReceivePage() {
  const [poId, setPoId] = useState('');
  const [poList, setPoList] = useState([]);
  const [items, setItems] = useState([]);

  // โหลดรายการ PO
  useEffect(() => {
    const fetchPOs = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/po', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPoList(res.data);
      } catch (err) {
        console.error('โหลด PO ไม่ได้', err);
      }
    };
    fetchPOs();
  }, []);

  // เมื่อเลือก PO แล้วโหลดรายการสินค้า
  const handleSelectPO = async (e) => {
    const selectedId = e.target.value;
    setPoId(selectedId);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`http://localhost:5000/api/po/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // ตั้ง quantity เป็นค่าเริ่มต้น
      const poItems = (res.data.items || []).map(item => ({
        ...item,
        quantity: item.quantity || 1, // default 1
      }));
      setItems(poItems);
    } catch (err) {
      console.error('โหลดรายการ PO ไม่ได้', err);
    }
  };

  // อัปเดตจำนวน
  const updateItemQty = (index, value) => {
    const updated = [...items];
    updated[index].quantity = parseInt(value);
    setItems(updated);
  };

  // ✅ Submit รับของ
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // ตรวจสอบข้อมูลก่อน
    if (!poId || isNaN(parseInt(poId))) {
      alert('❌ กรุณาเลือก PO ก่อน');
      return;
    }

    if (items.some(i => !i.quantity || isNaN(i.quantity))) {
      alert('❌ กรุณากรอกจำนวนให้ครบถ้วน');
      return;
    }

    const payload = {
      po_id: parseInt(poId),
      items: items.map(i => ({
        description: i.description,
        quantity: i.quantity,
        unit: i.unit
      })),
    };

    console.log('📦 กำลังส่งข้อมูลรับของ:', payload);

    try {
      await axios.post(
        'http://localhost:5000/api/inventory/receive',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ รับพัสดุสำเร็จ');
      setPoId('');
      setItems([]);
    } catch (err) {
      console.error('❌ รับพัสดุล้มเหลว:', err);
      alert('❌ เกิดข้อผิดพลาดในการรับพัสดุ');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">รับพัสดุเข้าคลัง</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <select
          className="border p-2 w-full"
          value={poId}
          onChange={handleSelectPO}
        >
          <option value="">📦 เลือก PO</option>
          {poList.map(po => (
            <option key={po.id} value={po.id}>
              {po.reference_no} - {po.vendor_name}
            </option>
          ))}
        </select>

        {items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-2">
            <input
              className="border p-2"
              type="text"
              value={item.description}
              readOnly
            />
            <input
              className="border p-2"
              type="text"
              value={item.unit}
              readOnly
            />
            <input
              className="border p-2"
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateItemQty(idx, e.target.value)}
              required
            />
            <span className="self-center">หน่วย</span>
          </div>
        ))}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ✅ บันทึกรับของ
        </button>
      </form>
    </div>
  );
}
