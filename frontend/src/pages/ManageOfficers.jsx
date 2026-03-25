import { useEffect, useState } from "react";
import api from "../api/api";

export default function ManageOfficers() {

  const [officers, setOfficers] = useState([]);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [offRes, ofrRes] = await Promise.all([
        api.get("/api/superadmin/offices"),
        api.get("/api/superadmin/officers")
      ]);
      setOffices(offRes.data);
      setOfficers(ofrRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data");
      setLoading(false);
    }
  };

  const deleteOfficer = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/api/superadmin/officer/${id}`);
      fetchData();
    } catch (error) {
      alert("Failed to delete officer");
    }
  };

  const startEdit = (officer) => {
    setEditingId(officer._id);
    setEditForm({
      username: officer.username,
      office: officer.office?._id || "",
      counterNumber: officer.counterNumber
    });
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/api/superadmin/officer/${id}`, editForm);
      setEditingId(null);
      fetchData();
    } catch (error) {
      alert("Failed to update officer");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Manage Officers
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Username / Email</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Office (City)</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Counter</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {officers.map((officer) => (
              <tr key={officer._id} className="hover:bg-gray-50 transition">
                {editingId === officer._id ? (
                  <>
                    <td className="p-4">
                      <input 
                        value={editForm.username}
                        onChange={e => setEditForm({...editForm, username: e.target.value})}
                        className="border p-1 rounded w-full outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </td>
                    <td className="p-4">
                      <select 
                        value={editForm.office}
                        onChange={e => setEditForm({...editForm, office: e.target.value})}
                        className="border p-1 rounded w-full outline-none focus:ring-1 focus:ring-green-500"
                      >
                        <option value="">Select Office</option>
                        {offices.map(o => <option key={o._id} value={o._id}>{o.officeName} ({o.city})</option>)}
                      </select>
                    </td>
                    <td className="p-4">
                      <input 
                        type="number"
                        value={editForm.counterNumber}
                        onChange={e => setEditForm({...editForm, counterNumber: Number(e.target.value)})}
                        className="border p-1 rounded w-16 outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </td>
                    <td className="p-4 flex gap-2">
                       <button onClick={() => saveEdit(officer._id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold">Save</button>
                       <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded text-xs font-bold">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 font-medium text-gray-900">{officer.username}</td>
                    <td className="p-4 text-gray-600">
                      {officer.office?.officeName} ({officer.office?.city})
                    </td>
                    <td className="p-4 text-gray-600">
                      Counter {officer.counterNumber}
                    </td>

                    <td className="p-4 flex gap-3">
                      <button onClick={() => startEdit(officer)} className="text-green-600 hover:text-green-800 text-sm font-semibold">Edit</button>
                      <button
                        onClick={() => deleteOfficer(officer._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}