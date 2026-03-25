import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Users, Shield } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Bar */}
      <div className="bg-slate-800 text-white py-2 px-6 text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-medium">Smart Token Appointment System</span>
          <span className="text-slate-300">Digital Public Services</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-slate-700 flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                  Public Services Portal
                </h1>
                <p className="text-xs text-slate-600">Citizen Appointment Management</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 border-2 border-slate-700 text-slate-700 font-medium hover:bg-slate-700 hover:text-white transition-colors"
              >
                Citizen Login
              </button>
              <button
                onClick={() => navigate("/admin/login")}
                className="px-6 py-2 bg-slate-700 text-white font-medium hover:bg-slate-800 transition-colors"
              >
                Officer Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-100 to-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Digital Appointment System
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              A modern solution bridging citizens and government offices through 
              efficient token-based appointment management
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white p-6 border border-slate-200">
              <div className="w-12 h-12 bg-slate-100 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Book Appointments</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Schedule your visit in advance and avoid long queues
              </p>
            </div>

            <div className="bg-white p-6 border border-slate-200">
              <div className="w-12 h-12 bg-slate-100 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Save Time</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Know your queue position and estimated waiting time
              </p>
            </div>

            <div className="bg-white p-6 border border-slate-200">
              <div className="w-12 h-12 bg-slate-100 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Priority Access</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Special provisions for senior citizens and differently-abled
              </p>
            </div>

            <div className="bg-white p-6 border border-slate-200">
              <div className="w-12 h-12 bg-slate-100 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Secure System</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                QR code verification for authenticated service delivery
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            How The System Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-700 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Select Office & Service</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose your nearest office and the service you need
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-slate-700 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Book Your Slot</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pick a convenient date and time for your appointment
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-slate-700 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Visit with Token</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Show your QR code and proceed directly to your counter
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-3">About System</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Modernizing citizen services through digital appointment management
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>Citizen Registration</li>
                <li>Office Locations</li>
                <li>Service List</li>
                <li>Help & Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                For technical assistance<br />
                Email: support@portal.gov<br />
                Helpline: 1800-XXX-XXXX
              </p>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-slate-400">
            © 2026 Public Services Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}