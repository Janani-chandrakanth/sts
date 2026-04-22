import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Services = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const officeType = query.get("officeType");
  const officeId = query.get("officeId");

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!officeType) {
      setError("Office type not provided");
      setLoading(false);
      return;
    }

    const fetchServices = async () => {
      try {
        const res = await axios.get(
          "https://sts-backend-0zqu.onrender.com/api/services",
          {
            params: { officeType }   // ✅ MATCH BACKEND
          }
        );

        setServices(res.data.services || []);
      } catch (err) {
        console.error("Service fetch error", err);
        setError("Unable to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [officeType]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading services...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Available Services
        </h1>

        <div className="grid gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white p-6 border rounded-xl"
            >
              <h2 className="text-xl font-semibold mb-2">
                {service.serviceName}
              </h2>

              <p className="text-gray-600 mb-3">
                {service.description}
              </p>

              <h4 className="font-medium mb-1">
                Required Documents
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {service.requiredDocuments.map((doc, i) => (
                  <li key={i}>{doc}</li>
                ))}
              </ul>

              <button
                onClick={() =>
                  navigate(
                    `/book?serviceId=${service._id}&officeId=${officeId}`
                  )
                }
                className="mt-4 bg-black text-white px-4 py-2 rounded"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Services;
