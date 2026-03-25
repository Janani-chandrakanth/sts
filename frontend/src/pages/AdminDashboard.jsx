import { useEffect, useState } from "react";
import axios from "axios";
import { logout } from "../utils/logout";
import { getAdminInfo } from "../utils/getAdminInfo";

const AdminDashboard = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calling, setCalling] = useState(false);

  const admin = getAdminInfo(); // 🔹 officer info from token
  const token = localStorage.getItem("adminToken");
  const today = new Date().toISOString().split("T")[0];

  const headers = {
    Authorization: `Bearer ${token}`
  };

  /* FETCH TODAY QUEUE */
  const loadQueue = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/queue?date=${today}`,
        { headers }
      );
      setQueue(res.data);
    } catch {
      alert("Failed to load queue");
    } finally {
      setLoading(false);
    }
  };

  /* CALL NEXT TOKEN */
  const callNext = async () => {
    try {
      setCalling(true);
      await axios.put(
        "http://localhost:5000/api/admin/next",
        {},
        { headers }
      );
      loadQueue();
    } finally {
      setCalling(false);
    }
  };

  /* COMPLETE TOKEN */
  const completeToken = async (id) => {
    await axios.put(
      `http://localhost:5000/api/admin/complete/${id}`,
      {},
      { headers }
    );
    loadQueue();
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const priorityBadge = (p) => {
    if (p === "senior") return "🧓 Senior";
    if (p === "disabled") return "♿ Priority";
    return "👤 General";
  };

  if (loading) {
    return <p className="text-center mt-10">Loading queue...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* 🔹 HEADER */}
      <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">
            {admin?.officeName || "Office Dashboard"}
          </h2>
          <p className="text-sm text-gray-600">
            Officer: {admin?.username || "-"} | Counter #{admin?.counterNumber || "-"}
          </p>
        </div>

        <button
          onClick={() => logout("admin")}
          className="text-red-600 font-semibold"
        >
          Logout
        </button>
      </div>

      {/* 🔹 DASHBOARD BODY */}
      <div className="max-w-4xl mx-auto bg-white p-6 shadow border">

        <h3 className="text-xl font-bold mb-2 text-center">
          Today’s Queue
        </h3>

        <p className="text-center text-sm text-gray-500 mb-4">
          Date: {today}
        </p>

        <button
          onClick={callNext}
          disabled={calling}
          className="mb-6 w-full bg-black text-white py-2 disabled:opacity-50"
        >
          🔔 Call Next Token
        </button>

        {queue.length === 0 ? (
          <p className="text-center text-gray-500">
            No pending appointments
          </p>
        ) : (
          <table className="w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Token</th>
                <th className="border p-2">Priority</th>
                <th className="border p-2">Time Slot</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {queue.map(q => (
                <tr
                  key={q._id}
                  className={
                    q.priorityCategory !== "general"
                      ? "bg-yellow-50"
                      : ""
                  }
                >
                  <td className="border p-2 text-center font-bold">
                    {q.tokenNumber}
                  </td>
                  <td className="border p-2 text-center">
                    {priorityBadge(q.priorityCategory)}
                  </td>
                  <td className="border p-2 text-center">
                    {q.timeSlot || "-"}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => completeToken(q._id)}
                      className="px-3 py-1 bg-green-600 text-white"
                    >
                      Complete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
