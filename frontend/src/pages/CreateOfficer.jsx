import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CreateOfficer() {

  const navigate = useNavigate();

  const [offices, setOffices] = useState([]);

  const [form, setForm] = useState({
    username: "", // acts as email
    password: "",
    officeId: "",
    counterNumber: ""
  });

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      const res = await api.get("/api/superadmin/offices");
      setOffices(res.data);
    } catch (error) {
      console.error("Failed to load offices");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/superadmin/officer", {
        username: form.username,
        password: form.password,
        officeId: form.officeId,
        counterNumber: Number(form.counterNumber)
      });

      alert("Officer created successfully");
      navigate("/superadmin/officers");

    } catch (error) {
      alert(error.response?.data?.message || "Failed to create officer");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <ArrowLeft size={20} className="mr-1" /> Back
      </button>

      <div className="flex justify-center items-center">
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-lg">

          <h1 className="text-2xl font-bold mb-6">
            Create Officer
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Officer Email (Login)</label>
              <input
                name="username"
                type="email"
                placeholder="officer@service.gov.in"
                onChange={handleChange}
                required
                className="w-full border p-3 rounded focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                required
                className="w-full border p-3 rounded focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Office</label>
              <select
                name="officeId"
                onChange={handleChange}
                required
                className="w-full border p-3 rounded focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">Select Office</option>
                {offices.map((office) => (
                  <option key={office._id} value={office._id}>
                    {office.officeName} - {office.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Counter Number</label>
              <input
                type="number"
                name="counterNumber"
                placeholder="1"
                min="1"
                onChange={handleChange}
                required
                className="w-full border p-3 rounded focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md"
            >
              Confirm & Create Officer
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}