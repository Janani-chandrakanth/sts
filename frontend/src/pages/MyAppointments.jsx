import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, Hash, XCircle, Briefcase } from "lucide-react";
import { getToken } from "../utils/authStorage";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = getToken();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "https://sts-backend-0zqu.onrender.com/api/appointments/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setAppointments(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;

    try {
      await axios.put(
        `https://sts-backend-0zqu.onrender.com/api/appointments/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading appointments…</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        My Appointments
      </h1>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">
          No appointments found.
        </p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {appointments.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-xl shadow p-5 flex justify-between items-start"
            >
              {/* LEFT */}
              <div className="space-y-1">
                <h2 className="font-semibold text-lg">
                  {a.office?.officeName}
                </h2>

                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Briefcase size={14} />
                  {a.service?.serviceName}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>{a.date}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>{a.timeSlot}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Hash size={16} />
                  <span>Token: {a.tokenNumber}</span>
                </div>

                {a.counterNumber && (
                  <p className="text-sm text-gray-600">
                    Counter: {a.counterNumber}
                  </p>
                )}

                {a.priorityCategory !== "general" && (
                  <span className="inline-block text-xs text-orange-700 font-semibold mt-1">
                    PRIORITY – {a.priorityCategory.toUpperCase()}
                  </span>
                )}

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    a.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : a.status === "called"
                      ? "bg-blue-100 text-blue-800"
                      : a.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {a.status.toUpperCase()}
                </span>
              </div>

              {/* RIGHT */}
              {a.status === "pending" && (
                <button
                  onClick={() => cancelAppointment(a._id)}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <XCircle size={18} />
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
