import React, { useState, useEffect } from 'react';
import { 
  Users, Car, MapPin, CreditCard, LayoutDashboard, 
  LogOut, AlertCircle, CheckCircle2, Clock, Shield, 
  KeyRound, Activity, Zap, FileText, List, ZapIcon,
  Menu, X, ChevronRight
} from 'lucide-react';

/* Make sure your Node server is running on port 8000 */
const API_BASE = 'http://localhost:8000/api'; 

export default function App() {
  const [user, setUser] = useState(null);
  
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return <MainLayout user={user} onLogout={() => setUser(null)} />;
}

/* ==========================================
   LOGIN COMPONENT
   ========================================== */
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/core/users`);
      const json = await res.json();
      
      if (json.success) {
        const foundUser = json.data.find(u => u.email === email);
        if (foundUser) {
          /* 
             Accepts any password entry matching an existing email 
             since backend GET /users omits password hashes.
          */
          onLogin(foundUser);
        } else {
          setError('Account not found. Please verify your email.');
        }
      } else {
        setError('Database connection failed.');
      }
    } catch (err) {
      setError('Cannot reach server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-indigo-500/30">
      {/* Left Banner */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center border-r border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/10 z-0"></div>
        <div className="absolute w-72 h-72 bg-indigo-600/10 blur-3xl rounded-full top-20 left-20"></div>
        <div className="relative z-10 text-center px-8">
          <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl inline-block mb-6 border border-slate-700/50 shadow-xl">
            <Car className="text-indigo-400 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-3">SmartPark</h1>
          <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
            Automated, real-time parking management and dynamic pricing system.
          </p>
        </div>
      </div>

      {/* Right Login Box */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-sm">
          
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-700 mb-4">
              <Car className="text-indigo-400 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">SmartPark</h2>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-xl font-bold text-white tracking-tight mb-1.5">Welcome back</h2>
            <p className="text-slate-400 text-xs font-medium">Please enter your credentials.</p>
          </div>
          
          {error && (
            <div className="bg-red-950/30 text-red-400 px-3 py-2.5 rounded-lg mb-5 text-xs flex items-center gap-2 border border-red-900/50">
              <AlertCircle size={14} className="shrink-0" /> 
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm text-slate-200"
                placeholder="e.g. admin@smartpark.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  className="w-full p-2.5 pl-9 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm text-slate-200"
                  placeholder="Enter database hash"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <KeyRound className="absolute left-3 top-3 text-slate-500" size={14} />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm shadow-md mt-2 flex justify-center items-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ChevronRight size={14} />}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <ZapIcon size={12} className="text-amber-500"/> Quick Access (Seed Data)
            </p>
            <div className="flex flex-col gap-2">
              <QuickLoginBtn label="Administrator" email="admin@smartpark.com" pass="hash_admin_123" setE={setEmail} setP={setPassword} />
              <QuickLoginBtn label="Customer (Dave)" email="dave@email.com" pass="hash_dave_456" setE={setEmail} setP={setPassword} />
              <QuickLoginBtn label="Customer (Rudylyn)" email="rudylyn.t@email.com" pass="hash_rudy_789" setE={setEmail} setP={setPassword} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLoginBtn({ label, email, pass, setE, setP }) {
  return (
    <button 
      type="button"
      onClick={() => { setE(email); setP(pass); }} 
      className="flex justify-between items-center px-3 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors text-left group"
    >
      <span className="font-semibold text-xs text-slate-300 group-hover:text-indigo-400">{label}</span>
      <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{email}</span>
    </button>
  );
}

/* ==========================================
   MAIN LAYOUT & ROUTER
   ========================================== */
function MainLayout({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    if (user.role === 'Admin') {
      switch (activeTab) {
        case 'dashboard': return <AdminDashboard />;
        case 'zones': return <AdminZones />;
        case 'users-join': return <AdminUsersJoin />;
        case 'spots-join': return <AdminSpotsJoin />;
        case 'sessions-join': return <AdminSessionsJoin />;
        case 'hardware-join': return <AdminHardwareJoin />;
        case 'finance-join': return <AdminFinanceJoin />;
        case 'audit-join': return <AdminAuditJoin />;
        default: return <AdminDashboard />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard': return <CustomerDashboard user={user} />;
        case 'vehicles': return <CustomerVehicles user={user} />;
        case 'payments': return <CustomerPayments user={user} />;
        default: return <CustomerDashboard user={user} />;
      }
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans text-slate-200 selection:bg-indigo-500/30">
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Compact Dark Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-slate-950 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800/60
        lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="h-14 px-5 flex items-center justify-between lg:justify-start gap-3 border-b border-slate-800/60 shrink-0 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <Car className="w-5 h-5 text-indigo-400" />
            <span className="text-base font-black text-white tracking-tight">SmartPark</span>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>
        
        <nav className="flex-1 px-3 py-4 custom-scrollbar overflow-y-auto space-y-0.5">
          <NavItem id="dashboard" icon={<LayoutDashboard />} label="Dashboard" active={activeTab} set={setActiveTab} close={() => setSidebarOpen(false)} />
          
          {user.role === 'Admin' && (
            <>
              <SidebarGroup label="Essential Navigations" />
              <NavItem id="zones" icon={<MapPin />} label="Parking Zones" active={activeTab} set={setActiveTab} close={() => setSidebarOpen(false)} />

              <SidebarGroup label="6 Required Joins" />
              <NavItem id="users-join" icon={<Users />} label="1. Users & Vehicles" isJoin active={activeTab} set={setActiveTab} close={() => setSidebarOpen(false)} />
              <NavItem id="spots-join" icon={<CheckCircle2 />} label="2. Spots & Zones" isJoin active={activeTab} set={setActiveTab} close={() => setSidebarOpen(false)} />
              <NavItem id="sessions-join" icon={<List />} label="3. Live Sessions" isJoin active={activeTab} set={setActiveTab} close={() => setSidebarOpen(false)} />
              <NavItem id="hardware-join" icon={<Zap />} label="4. EV Chargers" isJoin active={activeTab} set={setActiveTab} close={() => setSidebarOpen(false)} />
              <NavItem id="finance-join" icon={<FileText />} label="5. Master Finance" isJoin active={activeTab} set={setActiveTab} close={() => setSidebarOpen(false)} />
              <NavItem id="audit-join" icon={<Activity />} label="6. Audit & Users" isJoin active={activeTab} set={setActiveTab} close={() => setSidebarOpen(false)} />
            </>
          )}

          {user.role === 'Customer' && (
            <>
              <SidebarGroup label="My Portal" />
              <NavItem id="vehicles" icon={<Car />} label="My Garage" active={activeTab} set={setActiveTab} close={() => setSidebarOpen(false)} />
              <NavItem id="payments" icon={<CreditCard />} label="Payment History" active={activeTab} set={setActiveTab} close={() => setSidebarOpen(false)} />
            </>
          )}
        </nav>

        <div className="p-4 shrink-0 border-t border-slate-800/60 bg-slate-900/30">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 rounded-md bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.first_name[0]}{user.last_name[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-200 truncate">{user.first_name} {user.last_name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-400 bg-slate-800/50 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors border border-slate-800 hover:border-red-900/50"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Header */}
        <header className="h-14 shrink-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-20 flex items-center px-4 sm:px-6 justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-400 hover:text-indigo-400 bg-slate-900 p-1.5 rounded-md border border-slate-800" onClick={() => setSidebarOpen(true)}>
              <Menu size={16} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-100 capitalize tracking-tight">
                {activeTab.replace(/-/g, ' ')}
              </h1>
            </div>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded text-[10px] font-black tracking-widest uppercase text-indigo-400 flex items-center gap-1.5 shrink-0">
            <Shield size={12} /> {user.role}
          </div>
        </header>
        
        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto animate-in fade-in duration-300">
            {renderContent()}
          </div>
        </main>

      </div>
    </div>
  );
}

/* Sidebar Helpers */
function SidebarGroup({ label }) {
  return (
    <div className="pt-4 pb-1.5 px-3 text-[9px] font-black text-slate-500 tracking-[0.15em] uppercase">
      {label}
    </div>
  );
}

function NavItem({ id, icon, label, active, set, close, isJoin }) {
  const isActive = active === id;
  return (
    <button 
      onClick={() => { set(id); close(); }}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
        isActive 
          ? 'bg-indigo-500/15 text-indigo-300 shadow-[inset_2px_0_0_0_rgba(99,102,241,0.8)]' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {React.cloneElement(icon, { size: 14, className: isActive ? 'text-indigo-400' : 'text-slate-500' })}
        {label}
      </div>
      {isJoin && (
        <span className={`text-[8px] px-1 py-0.5 rounded font-bold tracking-widest border ${
          isActive ? 'border-indigo-500/30 text-indigo-300 bg-indigo-500/20' : 'border-slate-700 bg-slate-800/50 text-slate-500'
        }`}>
          JOIN
        </span>
      )}
    </button>
  );
}

/* ==========================================
   ADMIN VIEWS
   ========================================== */
function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, zones: 0, activeSessions: 0 });
  
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/core/users`).then(r => r.json()),
      fetch(`${API_BASE}/core/zones`).then(r => r.json()),
      fetch(`${API_BASE}/transactions/sessions`).then(r => r.json())
    ]).then(([u, z, s]) => {
      setStats({
        users: (u.data || []).length,
        zones: (z.data || []).length,
        activeSessions: (s.data || []).filter(session => session.status === 'Active').length
      });
    }).catch(err => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard icon={<Users />} title="Total Users" value={stats.users} color="indigo" />
      <StatCard icon={<MapPin />} title="Parking Zones" value={stats.zones} color="blue" />
      <StatCard icon={<Activity />} title="Live Sessions" value={stats.activeSessions} color="emerald" />
      <StatCard icon={<Zap />} title="System Status" value="Online" color="slate" />
    </div>
  );
}

function AdminZones() {
  const [zones, setZones] = useState([]);
  useEffect(() => { fetch(`${API_BASE}/core/zones`).then(r => r.json()).then(d => setZones(d.data || [])).catch(e => console.error(e)); }, []);

  return (
    <TableCard headers={['Zone ID', 'Zone Details', 'Category', 'Capacity']}>
      {zones.map(z => (
        <tr key={z.zone_id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
          <td className="px-5 py-3.5 text-xs font-mono font-medium text-slate-500">#{z.zone_id}</td>
          <td className="px-5 py-3.5">
            <p className="text-sm font-bold text-slate-200">{z.zone_name}</p>
            <p className="text-[10px] font-medium text-slate-500 mt-0.5">Floor Level {z.floor_level}</p>
          </td>
          <td className="px-5 py-3.5">
            <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold text-slate-300">{z.zone_type}</span>
          </td>
          <td className="px-5 py-3.5 text-sm font-bold text-slate-300">{z.capacity} <span className="text-slate-500 text-xs font-medium">spots</span></td>
        </tr>
      ))}
    </TableCard>
  );
}

/* ==========================================
   ADMIN VIEWS (6 JOINS)
   ========================================== */

/* JOIN 1: Users with Vehicles */
function AdminUsersJoin() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch(`${API_BASE}/core/users/vehicles`).then(r => r.json()).then(d => setData(d.data || [])).catch(e => console.error(e)); }, []);

  return (
    <TableCard headers={['Vehicle Owner', 'Contact Email', 'Vehicle Profile', 'License Plate']}>
      {data.map((row, i) => (
        <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
          <td className="px-5 py-3.5 text-sm font-bold text-slate-200 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] shrink-0 border border-indigo-500/20">
              {row.first_name[0]}{row.last_name[0]}
            </div>
            {row.first_name} {row.last_name}
          </td>
          <td className="px-5 py-3.5 text-xs font-medium text-slate-400">{row.email}</td>
          <td className="px-5 py-3.5 text-xs capitalize text-slate-400">
            <span className="font-semibold text-slate-200">{row.color}</span> {row.vehicle_type}
          </td>
          <td className="px-5 py-3.5">
            <span className="bg-slate-900 font-mono text-xs font-bold px-2 py-1 rounded border border-slate-700 text-slate-300">{row.license_plate}</span>
          </td>
        </tr>
      ))}
    </TableCard>
  );
}

/* JOIN 2: Spots with Zones */
function AdminSpotsJoin() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch(`${API_BASE}/audit-and-spots/spots-with-zones`).then(r => r.json()).then(d => setData(d.data || [])).catch(e => console.error(e)); }, []);

  return (
    <TableCard headers={['Zone Detail', 'Spot ID', 'Spot Code', 'Current Status']}>
      {data.map((row, i) => (
        <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
          <td className="px-5 py-3.5">
            <p className="text-sm font-bold text-slate-200">{row.zone_name}</p>
            <p className="text-[10px] font-medium text-slate-500 mt-0.5">Lvl {row.floor_level} &bull; {row.zone_type}</p>
          </td>
          <td className="px-5 py-3.5 text-xs font-mono text-slate-500">#{row.spot_id}</td>
          <td className="px-5 py-3.5 text-sm font-black text-slate-200">{row.spot_number}</td>
          <td className="px-5 py-3.5"><StatusBadge status={row.spot_status} successVals={['Available']} /></td>
        </tr>
      ))}
    </TableCard>
  );
}

/* JOIN 3: Live Sessions with Spots */
function AdminSessionsJoin() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch(`${API_BASE}/transactions/sessions-with-spots`).then(r => r.json()).then(d => setData(d.data || [])).catch(e => console.error(e)); }, []);

  return (
    <TableCard headers={['Session ID', 'Vehicle', 'Location', 'Entry Time', 'Status']}>
      {data.map((row, i) => (
        <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
          <td className="px-5 py-3.5 text-xs font-mono text-slate-500">#{row.session_id}</td>
          <td className="px-5 py-3.5 text-sm font-bold text-slate-200">Veh #{row.vehicle_id}</td>
          <td className="px-5 py-3.5 text-xs text-slate-400">
            Spot <span className="font-bold text-indigo-400">{row.spot_number}</span> <span className="text-[10px] ml-1">(Z{row.zone_id})</span>
          </td>
          <td className="px-5 py-3.5 text-xs font-medium text-slate-400">{new Date(row.entry_timestamp).toLocaleString()}</td>
          <td className="px-5 py-3.5"><StatusBadge status={row.session_status} successVals={['Active']} /></td>
        </tr>
      ))}
    </TableCard>
  );
}

/* JOIN 4: EV Chargers with Spots */
function AdminHardwareJoin() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch(`${API_BASE}/hardware/chargers-with-spots`).then(r => r.json()).then(d => setData(d.data || [])).catch(e => console.error(e)); }, []);

  return (
    <TableCard headers={['Hardware Type', 'Output', 'Assigned Spot', 'Status']}>
      {data.map((row, i) => (
        <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
          <td className="px-5 py-3.5 text-sm font-bold text-slate-200">{row.charger_type}</td>
          <td className="px-5 py-3.5">
            <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{row.power_output_kw} kW</span>
          </td>
          <td className="px-5 py-3.5 text-xs">
            {row.spot_number ? 
              <span className="font-medium text-slate-400">Spot <strong className="text-sm font-black text-slate-200">{row.spot_number}</strong></span> 
              : <span className="text-slate-600 italic font-medium">Unassigned</span>}
          </td>
          <td className="px-5 py-3.5"><StatusBadge status={row.charger_status} successVals={['Available', 'Online']} /></td>
        </tr>
      ))}
    </TableCard>
  );
}

/* JOIN 5: Master Finance Report */
function AdminFinanceJoin() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch(`${API_BASE}/finance/report`).then(r => r.json()).then(d => setData(d.data || [])).catch(e => console.error(e)); }, []);

  return (
    <TableCard headers={['Session Ref', 'Payment History', 'Violations', 'EV Cost']}>
      {data.map((row, i) => (
        <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
          <td className="px-5 py-3.5">
            <p className="text-sm font-bold text-slate-200 mb-0.5">Sess #{row.session_id}</p>
            <p className="text-[10px] font-mono font-medium text-slate-500">Pay ID: {row.payment_id || 'N/A'}</p>
          </td>
          <td className="px-5 py-3.5 text-xs">
            {row.payment_amount ? 
              <div>
                <span className="font-bold text-sm text-slate-200">₱{Number(row.payment_amount).toFixed(2)}</span>
                <span className="text-slate-500 block text-[10px] mt-0.5">{row.payment_method} &bull; {row.payment_status}</span>
              </div>
              : <span className="text-slate-600 italic font-medium">No Payment</span>}
          </td>
          <td className="px-5 py-3.5 text-xs">
            {row.violation_type ? 
              <div className="bg-red-950/30 border border-red-900/50 p-1.5 rounded inline-block">
                <span className="text-red-400 font-bold block mb-0.5">{row.violation_type}</span>
                <span className="text-red-500 font-medium text-[10px]">₱{row.fine_amount} &bull; {row.violation_status}</span>
              </div>
              : <span className="text-slate-600 font-medium">None</span>}
          </td>
          <td className="px-5 py-3.5 text-sm font-bold text-slate-200">
            {row.charging_cost ? `₱${Number(row.charging_cost).toFixed(2)}` : '₱0.00'}
          </td>
        </tr>
      ))}
    </TableCard>
  );
}

/* JOIN 6: Audit Logs with Users */
function AdminAuditJoin() {
  const [logs, setLogs] = useState([]);
  useEffect(() => { fetch(`${API_BASE}/audit-and-spots/audit-logs`).then(r => r.json()).then(d => setLogs(d.data || [])).catch(e => console.error(e)); }, []);

  return (
    <div className="space-y-3">
      {logs.length === 0 ? <p className="text-slate-500 text-sm">No audit logs found.</p> : logs.map(log => (
        <div key={log.log_id} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between gap-3 hover:bg-slate-900 transition-colors">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold font-mono border border-slate-700">{log.action_type}</span>
              <span className="text-[10px] font-medium text-slate-500">Initiator UID: {log.user_id} &bull; IP: {log.ip_address}</span>
            </div>
            <p className="text-xs font-medium text-slate-300">{log.description}</p>
          </div>
          <div className="text-[10px] font-bold text-slate-500 whitespace-nowrap md:self-center bg-slate-950 px-2 py-1 rounded border border-slate-800/80">
            {new Date(log.timestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ==========================================
   CUSTOMER VIEWS
   ========================================== */
function CustomerDashboard({ user }) {
  const [reservations, setReservations] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}/transactions/reservations`).then(r => r.json()).then(d => {
      setReservations((d.data || []).filter(r => r.user_id === user.user_id));
    }).catch(e => console.error(e));
  }, [user.user_id]);

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5 sm:p-6">
      <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
        <Clock className="text-indigo-400" size={18} /> My Active Reservations
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reservations.length === 0 ? (
          <p className="text-xs font-medium text-slate-500 col-span-full bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center">No active reservations.</p>
        ) : reservations.map(r => (
          <div key={r.reservation_id} className="p-4 border border-slate-800 rounded-xl bg-slate-900 flex flex-col justify-between gap-4 hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Spot</span>
                <span className="text-2xl font-black text-slate-200 block">#{r.spot_id}</span>
              </div>
              <StatusBadge status={r.status} successVals={['Active', 'Completed']} />
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
              <p className="text-[10px] font-semibold text-slate-400 leading-tight">
                {new Date(r.start_time).toLocaleString()} <br/> <span className="text-slate-600">until</span> <br/> {new Date(r.end_time).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomerVehicles({ user }) {
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}/masterdata/vehicles`).then(r => r.json()).then(d => {
      setVehicles((d.data || []).filter(v => v.user_id === user.user_id));
    }).catch(e => console.error(e));
  }, [user.user_id]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {vehicles.length === 0 ? <p className="text-slate-500 text-xs font-medium col-span-full">No vehicles registered.</p> : vehicles.map(v => (
        <div key={v.vehicle_id} className="p-5 border border-slate-800 hover:border-slate-700 transition-colors rounded-xl bg-slate-900/50 flex justify-between items-start group">
          <div>
            <div className="bg-slate-800 text-slate-300 border border-slate-700 text-[9px] font-black px-2 py-0.5 rounded w-max mb-3 uppercase tracking-widest">{v.vehicle_type}</div>
            <p className="font-bold text-slate-200 text-xl tracking-tight mb-1 group-hover:text-indigo-400 transition-colors">{v.license_plate}</p>
            <p className="text-xs font-medium text-slate-500 capitalize">{v.color} vehicle</p>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 group-hover:border-indigo-500/30 transition-colors shrink-0">
            <Car className="text-slate-500 group-hover:text-indigo-400 transition-colors" size={24} />
          </div>
        </div>
      ))}
    </div>
  );
}

function CustomerPayments() {
  const [payments, setPayments] = useState([]);
  useEffect(() => { fetch(`${API_BASE}/finance/payments`).then(r => r.json()).then(d => setPayments(d.data || [])).catch(e => console.error(e)); }, []);

  return (
    <TableCard headers={['Ref', 'Amount', 'Method', 'Status', 'Date']}>
      {payments.map(p => (
        <tr key={p.payment_id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
          <td className="px-5 py-3.5 text-xs font-mono font-medium text-slate-500">PAY-{p.payment_id}</td>
          <td className="px-5 py-3.5 text-sm font-bold text-slate-200">₱{Number(p.amount_due || p.amount || 0).toFixed(2)}</td>
          <td className="px-5 py-3.5 text-xs font-medium text-slate-400">{p.method || p.payment_method}</td>
          <td className="px-5 py-3.5"><StatusBadge status={p.status || p.payment_status} successVals={['Paid']} /></td>
          <td className="px-5 py-3.5 text-xs font-medium text-slate-500">{new Date(p.timestamp || Date.now()).toLocaleDateString()}</td>
        </tr>
      ))}
    </TableCard>
  );
}

/* ==========================================
   REUSABLE DENSE UI COMPONENTS
   ========================================== */
function StatCard({ icon, title, value, color }) {
  const colorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    slate: 'bg-slate-800 text-slate-300 border-slate-700'
  };

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5 flex flex-col gap-3 hover:bg-slate-900 transition-colors">
      <div className={`w-10 h-10 flex items-center justify-center rounded-lg border ${colorMap[color]}`}>
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1">{title}</p>
        <p className="text-2xl font-black text-slate-200 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function TableCard({ headers, children }) {
  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-800">
              {headers.map((h, i) => (
                <th key={i} className="px-5 py-3 font-bold text-[10px] tracking-widest text-slate-500 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status, successVals = [] }) {
  if (!status) return null;
  const isSuccess = successVals.includes(status);
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase border ${
      isSuccess ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
      status.includes('Active') || status.includes('Use') ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
      'bg-slate-800 text-slate-400 border-slate-700'
    }`}>
      {status}
    </span>
  );
}