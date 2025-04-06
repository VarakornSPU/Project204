import { useEffect, useState } from "react";
import axios from "axios";

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ department: "", year: "", initial_amount: "" });

  const token = localStorage.getItem("token");

  const fetchBudgets = async () => {
    const res = await axios.get("http://localhost:5000/api/budgets", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBudgets(res.data);
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/budgets", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBudgets();
    setForm({ department: "", year: "", initial_amount: "" });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">💰 Budget Management</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Department" className="border p-2 w-full" />
        <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="Year" type="number" className="border p-2 w-full" />
        <input value={form.initial_amount} onChange={(e) => setForm({ ...form, initial_amount: e.target.value })} placeholder="Initial Amount" type="number" className="border p-2 w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Budget</button>
      </form>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th>Department</th>
            <th>Year</th>
            <th>Initial</th>
            <th>Used</th>
            <th>Remaining</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((b, i) => (
            <tr key={i}>
              <td>{b.department}</td>
              <td>{b.year}</td>
              <td>{parseFloat(b.initial_amount).toFixed(2)}</td>
              <td>{parseFloat(b.used_amount).toFixed(2)}</td>
              <td>{(b.initial_amount - b.used_amount).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
