import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/authStorage";
import { useNavigate, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const serviceId = query.get("serviceId");
  const officeIdFromUrl = query.get("officeId");

  const token = getToken();

  // States
  const [service, setService] = useState(null);
  const [offices, setOffices] = useState([]);
  const [officeId, setOfficeId] = useState(officeIdFromUrl || "");
  const [officeName, setOfficeName] = useState(""); // ✅ Office display
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [priorityCategory, setPriorityCategory] = useState("general"); // ✅ Default general
  const [assignedCounter, setAssignedCounter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  // Load service + offices
  // ✅ FIXED: Proper sequencing + fallback
useEffect(() => {
  if (!serviceId) return;
  
  const loadData = async () => {
    try {
      setLoading(true);
      
      // 1. Load service + offices
      const res = await axios.get(
        `http://localhost:5000/api/services/${serviceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("✅ Service loaded:", res.data.service.serviceName);
      console.log("✅ Offices loaded:", res.data.offices.length);
      
      setService(res.data.service);
      setOffices(res.data.offices);
      
      // 2. IMMEDIATELY set officeId from URL
      if (officeIdFromUrl) {
        console.log("🎯 Auto-selecting office:", officeIdFromUrl);
        setOfficeId(officeIdFromUrl);
        
        // 3. Find + set officeName
        const selectedOffice = res.data.offices.find(o => o._id === officeIdFromUrl);
        if (selectedOffice) {
          console.log("✅ Office found:", selectedOffice.officeName);
          setOfficeName(selectedOffice.officeName);
        } else {
          console.log("⚠️ Office not in list - using fallback");
          setOfficeName("Office Confirmed");
        }
      }
      
    } catch (err) {
      console.error("❌ Load error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };
  
  loadData();
}, [serviceId, officeIdFromUrl, token]);

  // When officeId is set, fetch available dates
  useEffect(() => {
    if (!officeId) return;
    const fetchDates = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/appointments/available-dates/${officeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAvailableDates(res.data || []);
      } catch (err) {
        console.error("Available dates fetch error:", err.response?.data || err.message);
        setAvailableDates([]);
      }
    };
    fetchDates();
  }, [officeId, token]);

  // When priority or office changes, preview assigned counter
  useEffect(() => {
    if (!officeId || !priorityCategory) return;
    const previewCounter = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/appointments/counter-preview`,
          { params: { priority: priorityCategory, officeId }, headers: { Authorization: `Bearer ${token}` } }
        );
        const counter = Number(res.data?.counter) || 1;
        setAssignedCounter(Math.max(1, Math.floor(counter)));
      } catch (err) {
        console.error("Counter preview error:", err.response?.data || err.message);
        setAssignedCounter(1);
      }
    };
    previewCounter();
  }, [priorityCategory, officeId, token]);

  // Keep officeName in sync if officeId/offices change
  useEffect(() => {
    if (!officeId || !offices || offices.length === 0) return;
    const found = offices.find(o => o._id === officeId);
    if (found) setOfficeName(found.officeName);
  }, [officeId, offices]);

  // If office isn't in the list, fetch it directly
  useEffect(() => {
    if (!officeId) return;
    const found = offices.find ? offices.find(o => o._id === officeId) : null;
    if (found) return; // already handled

    const fetchOffice = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/offices/${officeId}`, { headers: { Authorization: `Bearer ${token}` } });
        const off = res.data;
        setOfficeName(off.officeName || "Office Confirmed");
        // merge into offices list so downstream lookups work
        setOffices(prev => (prev || []).concat(off));
      } catch (err) {
        console.error("Fetch office by id error:", err.response?.data || err.message);
        setOfficeName("Office Confirmed");
      }
    };
    fetchOffice();
  }, [officeId, offices, token]);

  // When a date is selected, fetch available time slots
  useEffect(() => {
    if (!officeId || !selectedDate) return;
    const fetchSlots = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/appointments/time-slots`,
          { params: { officeId, date: selectedDate }, headers: { Authorization: `Bearer ${token}` } }
        );
        setTimeSlots(res.data || []);
      } catch (err) {
        console.error("Time slots fetch error:", err.response?.data || err.message);
        setTimeSlots([]);
      }
    };
    fetchSlots();
  }, [officeId, selectedDate, token]);

  const handleBooking = async () => {
  if (!officeId || !selectedTimeSlot) {
    alert("Please complete all steps");
    return;
  }
  
  try {
    const res = await axios.post(
      "http://localhost:5000/api/appointments/book",
      {
        officeId,
        service: serviceId,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        priorityCategory,
        counter: assignedCounter // ✅ Send counter to backend
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // Normalize response and map backend fields to frontend expectations
    const appt = (res.data && res.data.appointment) ? res.data.appointment : res.data;
    const normalized = {
      ...appt,
      counter: appt.counterNumber ?? appt.counter ?? assignedCounter,
      priorityCategory: appt.priorityCategory ?? priorityCategory ?? "general"
    };
    navigate("/appointment-receipt", { state: { appointment: normalized } });
  } catch (err) {
    console.error("Booking error:", err.response?.data);
    alert(err.response?.data?.message || "Booking failed");
  }
};


  if (loading || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading Service Details...</p>
        </div>
      </div>
    );
  }

  // ✅ Fixed calendar logic
  const getDateInfo = (date) => {
    const isoDate = date.toISOString().slice(0, 10);
    return availableDates.find(d => d.date === isoDate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto"> {/* ✅ Full width */}
        
        {/* 🎫 Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-4xl">🎫</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Appointment Booking
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete your booking step by step - like RTO/Passport portal
          </p>
        </div>

        {/* Progress Bar */}
        {/* Progress Bar - ✅ FIXED KEY */}
<div className="flex items-center justify-center mb-16">
  <div className="flex items-center gap-1">
    {['Service', 'Priority', 'Office', 'Date', 'Time'].map((label, index) => {
      const isComplete = step > index + 1;
      const isActive = step === index + 1;
      return (
        <div key={`${label}-${index}`} className="flex items-center"> {/* ✅ Key fixed */}
          <div className={`w-12 h-12 flex items-center justify-center text-sm font-bold rounded-full shadow-lg transition-all ${
            isComplete ? 'bg-emerald-500 text-white shadow-emerald-500/50' :
            isActive ? 'bg-blue-500 text-white shadow-blue-500/50 ring-4 ring-blue-200' :
            'bg-gray-200 text-gray-500'
          }`}>
            {index + 1}
          </div>
          {index < 4 && <div className={`w-16 h-1 ${
            isComplete ? 'bg-emerald-400' : 'bg-gray-200'
          }`}></div>}
        </div>
      );
    })}
  </div>
</div>

        {/* STEP 1: Service Details */}
        {step === 1 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/50 mb-8 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">📋 Selected Service</h2>
            
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Service Info */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-8 rounded-2xl border-2 border-emerald-100">
                  <h3 className="text-2xl font-bold text-emerald-800 mb-4">{service.serviceName}</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">{service.description}</p>
                  
                  {service.requiredDocuments && service.requiredDocuments.length > 0 && (
                    <div>
                      <p className="font-semibold text-emerald-800 mb-3">📄 Required Documents:</p>
                      <ul className="space-y-2 text-sm">
                        {service.requiredDocuments.map((doc, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-700">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Priority Selection - ✅ General works now */}
              <div>
                <h4 className="text-2xl font-bold text-gray-800 mb-6">⚡ Priority Selection</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: "general", label: "👤 Normal Queue", desc: "Free • Everyone", color: "gray" },
                    { value: "senior", label: "👴 Senior Citizen", desc: "Priority • Age 60+", color: "orange" },
                    { value: "disabled", label: "♿ Differently Abled", desc: "Priority • Special", color: "purple" },
                    { value: "emergency", label: "🚨 Emergency", desc: "Highest • Govt/Special", color: "red" }
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`p-6 rounded-2xl border-4 cursor-pointer hover:shadow-xl transition-all group ${
                        priorityCategory === option.value
                          ? `border-${option.color}-500 bg-${option.color}-50 shadow-${option.color}-200 ring-4 ring-${option.color}-100`
                          : "border-gray-200 bg-white hover:border-gray-300 shadow-lg"
                      }`}
                      onClick={() => {
                        setPriorityCategory(option.value);
                        setStep(2);
                      }}
                    >
                      <div className="font-bold text-xl mb-2 group-hover:scale-105 transition-transform">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">{option.desc}</div>
                      {priorityCategory === option.value && (
                        <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Counter Assignment */}
        {step === 2 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center mb-8 max-w-2xl mx-auto border border-white/50">
            <div className="text-6xl mb-8">✅</div>
            <h3 className="text-3xl font-black text-gray-800 mb-4">
              Priority Confirmed
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              {priorityCategory === 'general' ? 'Normal' : priorityCategory.charAt(0).toUpperCase() + priorityCategory.slice(1)} Priority Selected
            </p>
            
            <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white p-12 rounded-3xl shadow-2xl mb-8">
              <div className="text-7xl mb-4">🪑</div>
              <div className="text-5xl font-black mb-2">Counter #{assignedCounter}</div>
              <p className="text-xl opacity-90">Auto-assigned for your priority</p>
            </div>
            
            <button
              onClick={() => setStep(3)}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
            >
              Continue to Date Selection →
            </button>
          </div>
        )}

        {/* STEP 3: Office Selection */}
       {step === 3 && (
  <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-8 max-w-2xl mx-auto border border-white/50">
    <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">🏢 Selected Office</h3>
    
    {/* ✅ DIRECT DISPLAY - No dropdown confusion */}
    <div className="bg-emerald-50 border-4 border-emerald-200 p-12 rounded-3xl text-center shadow-2xl">
      <div className="text-6xl mb-6">✅</div>
      <h4 className="text-2xl font-bold text-emerald-800 mb-4">
        {officeName || 'Office Confirmed'}
      </h4>
      <div className="bg-white p-4 rounded-xl mb-8">
        <p className="text-lg text-gray-700">
          {offices.find(o => o._id === officeId)?.city || '---'}
        </p>
        <p className="text-lg font-semibold text-emerald-700">
          PIN: {offices.find(o => o._id === officeId)?.pincode || '----'}
        </p>
      </div>
      <button
        onClick={() => setStep(4)}
        className="bg-emerald-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 shadow-xl hover:shadow-2xl transition-all w-full"
      >
        Continue to Date →
      </button>
    </div>
  </div>
)}




        {/* STEP 4: Date Selection */}
        {step === 4 && officeId && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-8 max-w-3xl mx-auto border border-white/50">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">📅 Select Date</h3>
            
            <div className="bg-blue-50 border-4 border-blue-200 p-8 rounded-2xl mb-8 text-center shadow-xl">
              <p className="text-2xl font-bold text-blue-800 mb-2">
                Available: {availableDates.filter(d => d.availableTokens > 0).length} dates
              </p>
              <p className="text-lg text-blue-700">Next 14 days (Holidays & Sundays excluded)</p>
            </div>

            <div className="flex justify-center">
              <Calendar
                minDate={new Date()}
                tileClassName={({ date, view }) => {
                  if (view === 'month') {
                    const dateInfo = getDateInfo(date);
                    if (dateInfo?.availableTokens === 0) return 'full-date';
                    if (dateInfo?.availableTokens > 0) return 'available-date';
                  }
                  return null;
                }}
                tileDisabled={({ date, view }) => {
                  if (view === 'month') {
                    const dateInfo = getDateInfo(date);
                    return !dateInfo || dateInfo.availableTokens <= 0;
                  }
                  return false;
                }}
                tileContent={({ date, view }) => {
  if (view === 'month') {
    const dateInfo = getDateInfo(date);
    if (!dateInfo) return null;
    return (
      <div className="text-xs font-bold mt-1">
        {dateInfo.availableTokens === 0 ? 'FULL' : 'Ok'} {/* ✅ Hide exact count */}
      </div>
    );
  }
  return null;
}}

                onClickDay={(date) => {
  // ✅ FIXED: Local timezone
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  const isoDate = localDate.toISOString().slice(0, 10);
  setSelectedDate(isoDate);
  setStep(5);
}}
              />
            </div>

            {/* ✅ FIXED: Regular style tag */}
<style>{`
  .available-date {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
    color: white !important;
    font-weight: bold !important;
  }
  .full-date {
    background: #ef4444 !important;
    color: white !important;
  }
`}</style>

          </div>
        )}

        {/* STEP 5: Time Slots - ✅ Card style */}
        {step === 5 && selectedDate && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-8 max-w-3xl mx-auto border border-white/50">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">🕐 Select Time Slot</h3>
            
            <div className="bg-indigo-50 border-4 border-indigo-200 p-8 rounded-2xl mb-8 text-center shadow-xl">
              <p className="text-2xl font-bold text-indigo-800 mb-2">{selectedDate}</p>
              <p className="text-xl text-indigo-700 mb-4">Counter #{assignedCounter}</p>
              <p className="text-lg">{timeSlots.length} slots available (10 AM - 5 PM)</p>
            </div>

            {timeSlots.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">😔</div>
                <p className="text-2xl font-bold text-gray-600 mb-2">No slots available</p>
                <p className="text-lg text-gray-500">Try another date</p>
                <button
                  onClick={() => setStep(4)}
                  className="mt-6 bg-gray-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-700"
                >
                  ← Change Date
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {timeSlots.map((slot, index) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`p-6 rounded-2xl border-4 font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-200 hover:scale-105 ${
                      selectedTimeSlot === slot
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-emerald-300 ring-4 ring-emerald-200"
                        : "border-gray-200 bg-white hover:border-indigo-300 text-gray-800"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}

            {selectedTimeSlot && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setStep(6)}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-16 py-6 rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                >
                  Confirm Booking →
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: Final Confirmation */}
        {step === 6 && selectedTimeSlot && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center max-w-2xl mx-auto border border-white/50">
            <div className="text-7xl mb-8">🎉</div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-8">
              Ready to Book!
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-lg">
              <div className="space-y-4 text-left">
                <div><span className="font-bold">Service:</span> {service.serviceName}</div>
                <div><span className="font-bold">Priority:</span> {priorityCategory.toUpperCase()}</div>
                <div><span className="font-bold">Office:</span> {officeName}</div>
              </div>
              <div className="space-y-4 text-left">
                <div><span className="font-bold">Date:</span> {selectedDate}</div>
                <div><span className="font-bold">Time:</span> {selectedTimeSlot}</div>
                <div><span className="font-bold">Counter:</span> <span className="text-2xl font-black text-blue-600">#{assignedCounter}</span></div>
              </div>
            </div>

            <button
              onClick={handleBooking}
              className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white py-8 px-12 rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 ring-4 ring-emerald-200"
            >
              🎫 CONFIRM & GENERATE TOKEN
            </button>
            
            <p className="text-sm text-gray-500 mt-6">
              You will receive your token number instantly
            </p>
          </div>
        )}

        {/* Back button */}
        <div className="text-center mt-8">
          <button
            onClick={() => setStep(Math.max(step - 1, 1))}
            className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
          >
            ← Previous Step
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
