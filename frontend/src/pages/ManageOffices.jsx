import { useEffect, useState } from "react";
import api from "../api/api";

export default function ManageOffices() {

  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      const res = await api.get("/api/superadmin/offices");
      setOffices(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load offices");
      setLoading(false);
    }
  };

  const deleteOffice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this office?")) return;
    try {
      await api.delete(`/api/superadmin/office/${id}`);
      fetchOffices();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete office");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/api/superadmin/office/${id}/status`);
      fetchOffices();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const startEdit = (office) => {
    setEditingId(office._id);
    setEditForm({ officeName: office.officeName, city: office.city, officeType: office.officeType });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/api/superadmin/office/${id}`, editForm);
      setEditingId(null);
      fetchOffices();
    } catch (error) {
      alert("Failed to update office");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Manage Offices
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Office Name</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">City</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {offices.map((office) => (
              <tr key={office._id} className="hover:bg-gray-50 transition">
                {editingId === office._id ? (
                  <>
                    <td className="p-4">
                      <input 
                        name="officeName"
                        value={editForm.officeName}
                        onChange={handleEditChange}
                        className="border p-1 rounded w-full outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-4">
                      <select 
                        name="officeType"
                        value={editForm.officeType}
                        onChange={handleEditChange}
                        className="border p-1 rounded w-full outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="RTO">RTO</option>
                        <option value="VAO">VAO</option>
                        <option value="Revenue">Revenue</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <input 
                        name="city"
                        value={editForm.city}
                        onChange={handleEditChange}
                        className="border p-1 rounded w-full outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-4">
                       <span className={`px-2 py-1 rounded text-xs font-bold ${office.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {office.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => saveEdit(office._id)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Save</button>
                      <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded text-xs">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 font-medium text-gray-900">{office.officeName}</td>
                    <td className="p-4 text-gray-600">{office.officeType}</td>
                    <td className="p-4 text-gray-600">{office.city}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${office.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {office.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>

                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => startEdit(office)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => toggleStatus(office._id)}
                        className={`text-sm font-semibold ${office.isActive ? 'text-orange-600' : 'text-green-600'}`}
                      >
                        {office.isActive ? 'Deactivate' : 'Activate'}
                      </button>

                      <button
                        onClick={() => deleteOffice(office._id)}
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