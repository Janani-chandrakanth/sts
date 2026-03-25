import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CreateOffice() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    officeName: "",
    officeType: "RTO",
    city: "",
    pincode: "",
    latitude: "",
    longitude: "",
    totalCounters: 1
  });

  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, [form.officeType]);

  const fetchServices = async () => {
    try {
      // Fetch services filtered by officeType
      const res = await api.get(`/api/services?officeType=${form.officeType}`);
      // The API returns { count, services } based on serviceRoutes.js
      setAvailableServices(res.data.services || []);
      setSelectedServices([]); // Reset selection when type changes
    } catch (error) {
      console.error("Failed to fetch services");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        officeName: form.officeName,
        officeType: form.officeType,
        city: form.city,
        pincode: form.pincode,
        totalCounters: Number(form.totalCounters),
        services: selectedServices, 
        location: {
          type: "Point",
          coordinates: [
            Number(form.longitude),
            Number(form.latitude)
          ]
        }
      };

      await api.post("/api/superadmin/office", payload);
      alert("Office created successfully");
      navigate("/superadmin/offices");

    } catch (error) {
      alert(error.response?.data?.message || "Failed to create office");
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

      <div className="flex justify-center items-start">
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-2xl">

          <h1 className="text-2xl font-bold mb-6">
            Create Office
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Office Name</label>
                <input
                  name="officeName"
                  placeholder="District RTO Office"
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Office Type</label>
                <select
                  name="officeType"
                  value={form.officeType}
                  onChange={handleChange}
                  className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="RTO">RTO</option>
                  <option value="VAO">VAO</option>
                  <option value="Revenue">Revenue</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  name="city"
                  placeholder="Coimbatore"
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input
                  name="pincode"
                  placeholder="641001"
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  name="latitude"
                  placeholder="11.0168"
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  name="longitude"
                  placeholder="76.9558"
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Counters</label>
              <input
                type="number"
                name="totalCounters"
                placeholder="1"
                min="1"
                onChange={handleChange}
                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* SERVICE SELECTION SECTION */}
            <div className="border-t pt-4">
              <label className="block text-sm font-bold text-gray-800 mb-3">Available Services for {form.officeType}</label>
              <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded">
                {availableServices.length > 0 ? (
                  availableServices.map(service => (
                    <label key={service._id} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded border">
                      <input 
                        type="checkbox"
                        checked={selectedServices.includes(service._id)}
                        onChange={() => handleServiceToggle(service._id)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{service.serviceName}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm col-span-2 italic">No services found for this type. Please create services first.</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition shadow-md text-lg"
            >
              Create Office
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}