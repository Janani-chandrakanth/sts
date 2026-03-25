import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const AppointmentReceipt = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ FIXED: Match booking response structure
  const state = location.state;
  
  if (!state || !state.appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <p className="text-lg text-gray-600 mb-4">No receipt data found</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ✅ FIXED: Backend must return this structure in /book endpoint
  const {
    office, // office name string
    service, // service name string  
    date,
    timeSlot,
    tokenNumber,
    counter, // optional
    counterNumber, // optional fallback
    priorityCategory,
    documents = []
  } = state.appointment;

  // ✅ FIXED QR data structure
  const qrValue = JSON.stringify({
    appointmentId: state.appointment._id,
    token: tokenNumber,
    office: office,
    service: service,
    date: date,
    timeSlot: timeSlot,
    counter: counter,
    priority: priorityCategory
  });

  const downloadPDF = async () => {
    const element = document.getElementById("receipt");
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = 190;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, width, height);
    pdf.save(`Appointment_Token_${tokenNumber}_${date.replace(/-/g, '')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl border-4 border-gray-200 overflow-hidden">
          
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-6 text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎫</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">APPOINTMENT RECEIPT</h1>
            <p className="text-sm opacity-90">Government Service Portal</p>
          </div>

          {/* RECEIPT CONTENT */}
          <div id="receipt" className="p-6">
            <div className="space-y-4 mb-6">
              <Row label="🗺️ Office" value={office} />
              <Row label="📋 Service" value={service} />
              <Row label="📅 Date" value={date} />
              <Row label="🕒 Time Slot" value={timeSlot} />
              <Row 
                label="🎫 Token Number" 
                value={<span className="text-2xl font-black text-blue-600">{tokenNumber}</span>}
              />
              <Row label="🪑 Counter" value={`#${counter ?? counterNumber ?? "-"}`} />

              {priorityCategory && priorityCategory !== "general" && (
                <Row 
                  label="⚡ Priority" 
                  value={typeof priorityCategory === 'string' ? priorityCategory.toUpperCase() : String(priorityCategory)}
                  className="bg-yellow-50 border-yellow-200"
                />
              )}
            </div>

            {/* QR Code */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-4 rounded-xl mb-6 text-center">
              <p className="text-xs text-gray-600 mb-3 uppercase font-semibold tracking-wide">Scan at Entrance</p>
              <div className="flex justify-center">
                <QRCodeCanvas
                  value={qrValue}
                  size={140}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>

            {/* Documents List */}
            {documents.length > 0 && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-6">
                <h4 className="font-bold text-sm text-red-800 mb-3 flex items-center gap-2">
                  📄 Required Documents
                </h4>
                <ul className="text-xs space-y-1">
                  {documents.map((doc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructions */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-bold text-sm mb-3 text-gray-800 flex items-center gap-2">
                📋 Instructions
              </h4>
              <ul className="text-xs space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">1.</span>
                  Arrive <strong>15 minutes early</strong>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">2.</span>
                  Report directly at <strong>Counter #{counter}</strong>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">3.</span>
                  Show this QR at entrance
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">4.</span>
                  Carry all <strong>original documents</strong>
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Print or save as PDF • Valid for 24 hours
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Token #{tokenNumber} • {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={downloadPDF}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold text-sm shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                📄 Download PDF
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold text-sm shadow-lg transition-all duration-200"
              >
                ✅ Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, className = "" }) => (
  <div className={`p-3 bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
    <div className="flex justify-between items-center">
      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{label}</span>
      <span className="font-bold text-sm">{value}</span>
    </div>
  </div>
);

export default AppointmentReceipt;
