import { useEffect, useState, useMemo } from "react";
import api from "../api/api";
import { 
  Users, 
  Building2, 
  ClipboardList, 
  CalendarCheck, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  Activity,
  Filter,
  RefreshCw,
  Search
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalOffices: 0,
    totalOfficers: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    pendingTokens: 0,
    completedTokens: 0
  });

  const [analytics, setAnalytics] = useState({
    trends: [],
    officeDist: [],
    serviceDemand: []
  });

  const [tokenStatus, setTokenStatus] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [officeStats, setOfficeStats] = useState([]);
  const [officerPerformance, setOfficerPerformance] = useState([]);
  
  const [filters, setFilters] = useState({
    status: "ALL",
    service: "ALL",
    office: "ALL",
    date: new Date().toISOString().split("T")[0]
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const adminName = localStorage.getItem("adminName") || "Administrator";

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [statsRes, analyticsRes, tokenRes, apptRes, officeRes, perfRes] = await Promise.all([
        api.get("/api/superadmin/dashboard"),
        api.get("/api/superadmin/analytics"),
        api.get("/api/superadmin/live-tokens"),
        api.get(`/api/superadmin/appointments?date=${filters.date}`),
        api.get(`/api/superadmin/office-stats?date=${filters.date}`),
        api.get(`/api/superadmin/officer-performance?date=${filters.date}`)
      ]);

      setStats(statsRes.data);
      setAnalytics(analyticsRes.data);
      setTokenStatus(tokenRes.data);
      setAppointments(apptRes.data);
      setOfficeStats(officeRes.data);
      setOfficerPerformance(perfRes.data);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      api.get("/api/superadmin/live-tokens").then(res => setTokenStatus(res.data));
    }, 10000);
    return () => clearInterval(interval);
  }, [filters.date]);

  // Chart Data Configurations
  const lineChartData = {
    labels: analytics.trends.map(t => t._id),
    datasets: [{
      label: 'Appointments',
      data: analytics.trends.map(t => t.count),
      fill: true,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgb(59, 130, 246)',
      tension: 0.4,
    }]
  };

  const doughnutData = {
    labels: analytics.officeDist.map(o => o._id),
    datasets: [{
      data: analytics.officeDist.map(o => o.count),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 0,
    }]
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const sMatch = filters.status === "ALL" || a.status === filters.status;
      const servMatch = filters.service === "ALL" || (a.service?.serviceName === filters.service);
      const offMatch = filters.office === "ALL" || (a.office?.officeName === filters.office);
      return sMatch && servMatch && offMatch;
    });
  }, [appointments, filters]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#0f172a]">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full border-t-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      
      {/* --- BG EFFECTS --- */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            System Intelligence
          </h1>
          <p className="text-slate-400 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400 animate-pulse" />
            Live network metrics for {adminName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="date" 
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-md transition-all"
            value={filters.date}
            onChange={(e) => setFilters({...filters, date: e.target.value})}
          />
          <button 
            onClick={fetchData} 
            className={`p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-900/20 active:scale-95 ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- KPI GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-10">
        <KPICard icon={<Building2 className="text-blue-400" />} label="Offices" value={stats.totalOffices} sub="Active Entities" />
        <KPICard icon={<Users className="text-purple-400" />} label="Officers" value={stats.totalOfficers} sub="On-duty Staff" />
        <KPICard icon={<ClipboardList className="text-emerald-400" />} label="Total Tokens" value={stats.totalAppointments} sub="System Lifetime" />
        <KPICard icon={<CalendarCheck className="text-yellow-400" />} label="Tokens Today" value={stats.todayAppointments} sub="Daily Volume" />
        <KPICard icon={<Clock className="text-orange-400" />} label="Pending" value={stats.pendingTokens} sub="Current Load" />
        <KPICard icon={<TrendingUp className="text-blue-500" />} label="Success" value={stats.completedTokens} sub="Served Tickets" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* APPOINTMENT TRENDS */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" /> Appointment Velocity
            </h3>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Last 7 Days</span>
          </div>
          <div className="h-[300px]">
             <Line data={lineChartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)' } }, x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.5)' } } } }} />
          </div>
        </div>

        {/* OFFICE DISTRIBUTION */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-400" /> Infrastructure
          </h3>
          <div className="h-[300px] flex items-center justify-center relative">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: 'white', padding: 20 } } } }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
        {/* OFFICE METRICS */}
        <div className="glass-panel overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold">Office Performance Analytics</h3>
            <div className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold uppercase tracking-tighter">Live Date Filtered</div>
          </div>
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/[0.02] sticky top-0 backdrop-blur-md">
                <tr className="text-slate-500 uppercase text-[10px] tracking-widest font-bold">
                  <th className="px-6 py-4">Office Name</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Pending</th>
                  <th className="px-6 py-4">Completed</th>
                  <th className="px-6 py-4">Wait Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {officeStats.map((os) => (
                  <tr key={os._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-semibold text-white group-hover:text-blue-400">{os.officeName}</td>
                    <td className="px-6 py-4">{os.totalTokens}</td>
                    <td className="px-6 py-4"><span className="text-yellow-400/80">{os.pendingTokens}</span></td>
                    <td className="px-6 py-4"><span className="text-emerald-400/80">{os.completedTokens}</span></td>
                    <td className="px-6 py-4">{os.averageWaitingTime ? os.averageWaitingTime.toFixed(1) + 'm' : '0m'}</td>
                  </tr>
                ))}
                {officeStats.length === 0 && <tr><td colSpan="5" className="p-10 text-center text-slate-500 italic">No operational data recorded for this date</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* LIVE TICKETS */}
        <div className="glass-panel overflow-hidden border border-blue-500/10">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-blue-500/5">
            <h3 className="font-bold flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-400 animate-spin-slow" /> Network Counters
            </h3>
            <div className="flex gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
               <span className="text-[10px] text-slate-400 font-bold uppercase">Streaming live</span>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
            {tokenStatus.map((t, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex justify-between items-center group hover:border-blue-500/30 transition-all">
                <div>
                  <div className="text-xs text-slate-500 mb-1">{t.office}</div>
                  <div className="font-bold group-hover:text-blue-400 transition-colors">Counter #{t.counter}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-white group-hover:scale-110 transition-transform">{t.currentToken}</div>
                  <div className={`text-[10px] font-bold uppercase ${t.status === 'called' ? 'text-blue-400' : 'text-yellow-500'}`}>{t.status}</div>
                </div>
              </div>
            ))}
            {tokenStatus.length === 0 && <div className="col-span-full p-10 text-center text-slate-600 italic">No active sessions detected</div>}
          </div>
        </div>
      </div>

      {/* APPOINTMENT MONITORING */}
      <div className="glass-panel overflow-hidden mb-10">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h3 className="font-bold text-lg flex items-center gap-2"><Filter className="w-5 h-5" /> Detailed Monitoring</h3>
          <div className="flex flex-wrap gap-2">
             <select className="filter-select" onChange={e => setFilters({...filters, status: e.target.value})}>
                <option value="ALL">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
             </select>
             <select className="filter-select" onChange={e => setFilters({...filters, office: e.target.value})}>
                <option value="ALL">All Offices</option>
                {[...new Set(appointments.map(a => a.office?.officeName))].filter(Boolean).map(o => <option key={o} value={o}>{o}</option>)}
             </select>
          </div>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.02]">
                <tr className="text-slate-500 uppercase text-[10px] font-bold">
                   <th className="px-6 py-4">Citizen</th>
                   <th className="px-6 py-4">Service</th>
                   <th className="px-6 py-4">Office</th>
                   <th className="px-6 py-4">Token</th>
                   <th className="px-6 py-4">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAppointments.map((a, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01]">
                    <td className="px-6 py-4 font-medium text-white">{a.user?.name || 'Guest'}</td>
                    <td className="px-6 py-4 text-slate-400">{a.service?.serviceName || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-400">{a.office?.officeName || 'N/A'}</td>
                    <td className="px-6 py-4 font-black text-blue-300">#{a.tokenNumber}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${a.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
           {filteredAppointments.length === 0 && <div className="p-20 text-center text-slate-600 italic">No appointments matched the active filters</div>}
        </div>
      </div>

      <style jsx>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .filter-select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          outline: none;
        }
        .filter-select:focus { border-color: rgba(59, 130, 246, 0.5); }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function KPICard({ icon, label, value, sub }) {
  return (
    <div className="glass-panel p-5 group hover:border-blue-500/30 transition-all hover:translate-y-[-2px]">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-white/[0.03] rounded-xl group-hover:bg-blue-600/10 transition-colors">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-2xl font-black text-white mb-1">{value}</div>
        <div className="text-[10px] text-slate-500 font-medium">{sub}</div>
      </div>
    </div>
  );
}