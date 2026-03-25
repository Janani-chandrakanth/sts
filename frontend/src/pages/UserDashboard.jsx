import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Car,
  Landmark,
  CheckCircle,
  AlertTriangle,
  LogOut
} from "lucide-react";
import { logout } from "../utils/logout";

const UserDashboard = () => {
  const navigate = useNavigate();

  const goToOffices = (type) => {
    navigate(`/offices?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-10">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Citizen Dashboard
        </h1>
        <button
          onClick={() => logout("user")}
          className="flex items-center gap-2 text-red-600 font-semibold"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Main Card */}
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 p-8">

        {/* Intro */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Smart Token Appointment System
          </h2>
          <p className="text-gray-600">
            Choose your office type to view services and book appointments
          </p>
        </div>

        {/* Office Type Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <OfficeCard
            icon={Car}
            title="RTO Office"
            desc="Driving license, vehicle services"
            onClick={() => goToOffices("RTO")}
          />

          <OfficeCard
            icon={Landmark}
            title="VAO Office"
            desc="Certificates, land records"
            onClick={() => goToOffices("VAO")}
          />

          <OfficeCard
            icon={Building2}
            title="Revenue Office"
            desc="Revenue & civil services"
            onClick={() => goToOffices("Revenue")}
          />

        </div>

        {/* Priority Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 flex gap-4 mb-8">
          <AlertTriangle className="text-yellow-600 w-6 h-6 mt-1" />
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">
              Priority Queue Notice
            </h4>
            <p className="text-sm text-gray-700">
              Priority requests will be verified physically at the office.
              If found ineligible, the appointment will be shifted to the general queue.
            </p>
          </div>
        </div>

        {/* My Appointments */}
        <div className="text-center">
          <button
            onClick={() => navigate("/my-appointments")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
          >
            <CheckCircle className="w-5 h-5" />
            View My Appointments
          </button>
        </div>

      </div>

      <p className="text-center mt-8 text-sm text-gray-500">
        Built for fairness. Designed for clarity.
      </p>
    </div>
  );
};

const OfficeCard = ({ icon: Icon, title, desc, onClick }) => (
  <button
    onClick={onClick}
    className="group bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-left hover:shadow-2xl hover:scale-[1.02] transition"
  >
    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-blue-100 text-sm">{desc}</p>
  </button>
);

export default UserDashboard;
