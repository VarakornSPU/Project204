import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../pages/ReportPage.css";
import "../App.css";

export default function ReportPage() {
  const [type, setType] = useState("pr");
  const [docId, setDocId] = useState("");
  const [documents, setDocuments] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!type) return;
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(`/api/report/list/${type}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDocuments(res.data || []);
        setDocId("");
      } catch (err) {
        setDocuments([]);
        console.error("Error loading documents:", err);
      }
    };
    fetchDocuments();
  }, [type]);

  const handlePrint = async () => {
    if (!docId) return alert("กรุณาเลือกเอกสาร");
    try {
      const res = await axios.get(
        `/api/report/print/${type}/${docId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data.document);
      setError(null);
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      setResult(null);
      setError("ไม่สามารถดึงข้อมูลเอกสารได้");
    }
  };

  const handleExportPDF = () => {
    if (!result) return alert("ไม่มีข้อมูลสำหรับ export");
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Document Report", 14, 20);
    const rows = Object.entries(result).map(([key, value]) => [key, String(value)]);
    autoTable(doc, {
      startY: 30,
      head: [["Field", "Value"]],
      body: rows,
    });
    doc.save(`document_${type}_${docId}.pdf`);
  };

  return (
    <div className="rp-container p-6">
      <h2 className="text-2xl font-bold mb-4">รายงานเอกสาร</h2>

      {/* เลือกประเภทเอกสาร */}
      <div className="mb-4 space-x-4">
        <label className="font-semibold">ประเภทเอกสาร :</label>
        <select
          className="border p-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="pr">PR</option>
          <option value="po">PO</option>
          <option value="asset">Asset</option>
          <option value="stock">Stock</option>
        </select>
      </div>

      {/* เลือกเอกสารจาก dropdown */}
      <div className="mb-4 space-x-4">
        <label className="font-semibold">เอกสาร :</label>
        <select
          className="border p-2 rounded"
          value={docId}
          onChange={(e) => setDocId(e.target.value)}
        >
          <option value="">เลือกเอกสาร</option>
          {documents.map((doc) => (
            <option
              key={doc.id || doc.pr_number || doc.reference_no}
              value={doc.pr_number || doc.reference_no || doc.po_id}
            >
              {doc.pr_number || doc.reference_no || `Doc#${doc.id}`}
            </option>
          ))}
        </select>
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          แสดงข้อมูล
        </button>
      </div>

      {/* แสดงผลลัพธ์ */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {result && (
        <div className="bg-white p-6 rounded shadow max-w-3xl mt-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4">รายละเอียดเอกสาร ({type.toUpperCase()})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(result).map(([key, value]) => (
              <div key={key}>
                <label className="font-medium text-gray-700 capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                <p className="border p-2 rounded bg-gray-50">
                  {typeof value === "string" && value.includes("T") && value.includes(":")
                    ? new Date(value).toLocaleString()
                    : value?.toString()}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={handleExportPDF}
            className="bg-purple-600 text-white px-4 py-2 rounded mt-4"
          >
            Export PDF
          </button>
        </div>
      )}
    </div>
  );
}