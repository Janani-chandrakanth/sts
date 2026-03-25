import { useEffect, useState } from "react";
import api from "../api/api";
import { Plus, Trash2, ShieldCheck } from "lucide-react";

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    serviceName: "",
    serviceCode: "",
    description: "",
    officeType: "RTO",
    requiredDocuments: ""
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/api/superadmin/services");
      setServices(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load services");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        requiredDocuments: form.requiredDocuments.split(",").map(d => d.trim()).filter(d => d)
      };
      await api.post("/api/superadmin/service", payload);
      setShowModal(false);
      setForm({ serviceName: "", serviceCode: "", description: "", officeType: "RTO", requiredDocuments: "" });
      fetchServices();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create service");
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/api/superadmin/service/${id}`);
      fetchServices();
    } catch (error) {
      alert("Failed to delete service");
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading services...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">System Services</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow"
        >
          <Plus size={20} className="mr-1" /> Add New Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="bg-white p-6 rounded-xl shadow-md border hover:border-blue-300 transition group">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                service.officeType === 'RTO' ? 'bg-orange-100 text-orange-700' :
                service.officeType === 'VAO' ? 'bg-green-100 text-green-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {service.officeType}
              </span>
              <button 
                onClick={() => deleteService(service._id)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{service.serviceName}</h3>
            <p className="text-xs text-blue-600 font-mono mb-3">{service.serviceCode}</p>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
            
            <div className="border-t pt-4">
              <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase">Requirements</h4>
              <div className="flex flex-wrap gap-1">
                {service.requiredDocuments.map((doc, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded">
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-600 p-6 text-white">
              <h2 className="text-xl font-bold flex items-center">
                <ShieldCheck className="mr-2" /> Define New Service
              </h2>
              <p className="text-blue-100 text-sm mt-1">Configure a standard government service</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Service Name</label>
                <input name="serviceName" required onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Driving License" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Service Code</label>
                  <input name="serviceCode" required onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="RTO-DL-01" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Office Type</label>
                  <select name="officeType" onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="RTO">RTO</option>
                    <option value="VAO">VAO</option>
                    <option value="Revenue">Revenue</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea name="description" required onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none h-20" placeholder="Briefly describe the service..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Required Docs (Comma separated)</label>
                <input name="requiredDocuments" required onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Aadhar Card, Photo, etc." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg font-bold hover:bg-gray-200 transition">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg">Create Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
