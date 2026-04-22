// src/pages/Offices.jsx - FIXED VERSION
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Building2, ArrowRight } from "lucide-react";

const Offices = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const officeType = query.get("type");

  const [pincodeInput, setPincodeInput] = useState("");
  const [nearby, setNearby] = useState([]);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOffices = async (searchPincode = "") => {
    console.log("🚀 fetchOffices called with pincode:", searchPincode); // DEBUG
    try {
      if (!officeType) {
        setError("Office type not provided");
        return;
      }

      setLoading(true);
      setError("");

      const params = {
        type: officeType,
      };

      if (searchPincode) {
        params.pincode = searchPincode;
        console.log("📤 Sending params:", params); // DEBUG
      }

      const res = await axios.get("https://sts-backend-0zqu.onrender.com/api/offices/search", {
        params
      });

      console.log("📥 Response:", { nearby: res.data.nearby?.length, others: res.data.others?.length }); // DEBUG

      setNearby(res.data.nearby || []);
      setOthers(res.data.others || []);
    } catch (err) {
      console.error("❌ Frontend fetch error:", err);
      setError("Unable to load offices");
    } finally {
      setLoading(false);
    }
  };

  // Initial load (no pincode)
  useEffect(() => {
    if (!officeType) {
      setError("Office type not provided");
      setLoading(false);
      return;
    }
    fetchOffices(); // No pincode
  }, [officeType]);

  const handlePincodeChange = (e) => {
    setPincodeInput(e.target.value);
  };

  const handleSearchClick = () => {
    console.log("🔍 Search clicked for pincode:", pincodeInput.trim()); // DEBUG
    fetchOffices(pincodeInput.trim()); // ✅ Pass pincode directly
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading offices...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Select {officeType} Office
        </h1>
        <p className="text-gray-600 mb-4">
          Enter pincode to find nearby offices (optional)
        </p>

        {/* PINCODE INPUT + BUTTON */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={pincodeInput}
            onChange={handlePincodeChange}
            placeholder="Enter pincode (optional)"
            className="border p-2 rounded w-full"
          />
          <button
            type="button"
            onClick={handleSearchClick}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Search
          </button>
        </div>

        {/* NEARBY OFFICES */}
        {nearby.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              Nearby Offices {pincodeInput && `(around ${pincodeInput})`}
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {nearby.map((office) => (
                <OfficeCard
                  key={office._id}
                  office={office}
                  highlight
                  onClick={() =>
                    navigate(`/services?officeType=${office.officeType}&officeId=${office._id}`)
                  }
                />
              ))}
            </div>
          </>
        )}

        {/* OTHER OFFICES */}
        {others.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Other Offices
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {others.map((office) => (
                <OfficeCard
                  key={office._id}
                  office={office}
                  onClick={() =>
                    navigate(`/services?officeType=${office.officeType}&officeId=${office._id}`)
                  }
                />
              ))}
            </div>
          </>
        )}

        {nearby.length === 0 && others.length === 0 && (
          <p className="text-gray-600 mt-6">
            No offices found for {officeType}.
          </p>
        )}
      </div>
    </div>
  );
};

const OfficeCard = ({ office, onClick, highlight }) => (
  <div
    className={`p-6 rounded-2xl border bg-white cursor-pointer hover:shadow-lg transition-all ${
      highlight ? "border-green-400 bg-green-50 ring-2 ring-green-100" : ""
    }`}
    onClick={onClick}
  >
    <div className="mb-4">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <Building2 className="w-5 h-5" />
        {office.officeName}
      </h3>
      <p className="text-sm text-gray-600 flex items-center gap-1">
        <MapPin className="w-4 h-4" />
        {office.city} – {office.pincode}
        {office.distance != null && (
          <span className="ml-2 text-xs text-green-700 font-medium">
            (~{(office.distance / 1000).toFixed(1)} km)
          </span>
        )}
      </p>
    </div>

    <div className="text-blue-600 font-semibold flex items-center gap-2 hover:text-blue-700">
      View Services <ArrowRight className="w-4 h-4" />
    </div>
  </div>
);

export default Offices;
