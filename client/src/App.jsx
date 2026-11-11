import React, { useState, useEffect } from 'react';
import { 
  Users, Car, MapPin, CreditCard, LayoutDashboard, 
  LogOut, AlertCircle, CheckCircle2, Clock, Shield, KeyRound, Activity, Zap, FileText, List
} from 'lucide-react';

// Make sure your Node server is running on port 8000
const API_BASE = 'http://localhost:8000/api'; 

export default function App() {
  const [user, setUser] = useState(null);
  
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return <MainLayout user={user} onLogout={() => setUser(null)} />;
}

// ==========================================
// LOGIN COMPONENT
// ==========================================
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Frontend-only password map for seed data
    const demoPasswords = {
      'admin@smartpark.com': 'hash_admin_123',
      'dave@email.com': 'hash_dave_456',
      'rudylyn.t@email.com': 'hash_rudy_789'
    };

    try {
      const res = await fetch(`${API_BASE}/core/users`);
      const json = await res.json();
      
      if (json.success) {
        const foundUser = json.data.find(u => u.email === email);
        if (foundUser && demoPasswords[email] === password) {
          onLogin(foundUser);
        } else {
          setError('Invalid email or password.');
        }
      } else {
        setError('Failed to fetch users from database.');
      }
    } catch (err) {
      setError('Cannot connect to server. Ensure Node backend is running on 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 p-3 rounded-full">
            <Car className="text-white w-8 h-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">SmartPark</h2>
        <p className="text-center text-slate-500 mb-6 text-sm">Sign in to your account</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center flex items-center justify-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="admin@smartpark.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input 
                type="password" 
                required
                className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter database hash..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <KeyRound className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-2"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 bg-slate-50 p-4 rounded-lg text-xs text-slate-500 border border-slate-200">
          <p className="font-bold text-slate-700 mb-1">Seed Data Credentials:</p>
          <ul className="space-y-1">
            <li><strong>Admin:</strong> admin@smartpark.com / hash_admin_123</li>
            <li><strong>Customer:</strong> dave@email.com / hash_dave_456</li>
            <li><strong>Customer:</strong> rudylyn.t@email.com / hash_rudy_789</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN LAYOUT & ROUTER
// ==========================================
function MainLayout({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    if (user.role === 'Admin') {
      switch (activeTab) {
        case 'dashboard': return <AdminDashboard />;
        case 'zones': return <AdminZones />;
        case 'spots-join': return <AdminSpotsJoin />;
        case 'users-join': return <AdminUsersJoin />;
        case 'sessions-join': return <AdminSessionsJoin />;
        case 'finance-join': return <AdminFinanceJoin />;
        case 'hardware-join': return <AdminHardwareJoin />;
        case 'logs': return <AdminLogs />;
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
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      <div className="flex-1 overflow-y-auto p-8">
        <header className="mb-8 flex justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 capitalize">
              {activeTab.replace(/-/g, ' ')}
            </h1>
            <p className="text-slate-500">Welcome back, {user.first_name}</p>
          </div>
          <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <Shield size={16} /> {user.role} Portal
          </div>
        </header>
        
        {renderContent()}
      </div>
    </div>
  );
}

// ==========================================
// SIDEBAR COMPONENT
// ==========================================
function Sidebar({ user, activeTab, setActiveTab, onLogout }) {
  const NavItem = ({ id, icon, label, isJoin }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        activeTab === id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        {React.cloneElement(icon, { size: 18 })}
        {label}
      </div>
      {isJoin && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${activeTab === id ? 'border-indigo-400 text-indigo-200' : 'border-slate-700 text-slate-500'}`}>
          JOIN
        </span>
      )}
    </button>
  );

  return (
    <div className="w-72 bg-slate-900 text-slate-300 flex flex-col">
      <div className="p-6 flex items-center gap-3 text-white border-b border-slate-800">
        <Car className="w-8 h-8 text-indigo-400" />
        <span className="text-xl font-bold">SmartPark</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <NavItem id="dashboard" icon={<LayoutDashboard />} label="Dashboard" />
        
        {user.role === 'Admin' && (
          <>
            <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-500 tracking-wider">CORE</div>
            <NavItem id="zones" icon={<MapPin />} label="Parking Zones" />
            <NavItem id="logs" icon={<Activity />} label="Audit Logs" />
            
            <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-500 tracking-wider">REPORTS & JOINS</div>
            <NavItem id="users-join" icon={<Users />} label="Users & Vehicles" isJoin />
            <NavItem id="spots-join" icon={<CheckCircle2 />} label="Spots & Zones" isJoin />
            <NavItem id="sessions-join" icon={<List />} label="Live Sessions & Spots" isJoin />
            <NavItem id="hardware-join" icon={<Zap />} label="EV Chargers & Spots" isJoin />
            <NavItem id="finance-join" icon={<FileText />} label="Master Finance Report" isJoin />
          </>
        )}

        {user.role === 'Customer' && (
          <>
            <NavItem id="vehicles" icon={<Car />} label="My Vehicles" />
            <NavItem id="payments" icon={<CreditCard />} label="Payment History" />
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
            {user.first_name[0]}{user.last_name[0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

// ==========================================
// VIEWS: ADMIN (STANDARD)
// ==========================================
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
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard icon={<Users />} title="Total Users" value={stats.users} color="bg-blue-500" />
      <StatCard icon={<MapPin />} title="Parking Zones" value={stats.zones} color="bg-indigo-500" />
      <StatCard icon={<Activity />} title="Active Sessions" value={stats.activeSessions} color="bg-green-500" />
    </div>
  );
}

function AdminZones() {
  const [zones, setZones] = useState([]);
  useEffect(() => { fetch(`${API_BASE}/core/zones`).then(r => r.json()).then(d => setZones(d.data || [])); }, []);

  return (
    <TableCard headers={['ID', 'Zone Name', 'Type', 'Capacity']}>
      {zones.map(z => (
        <tr key={z.zone_id} className="border-b border-slate-100 hover:bg-slate-50">
          <td className="p-4 text-sm text-slate-500">{z.zone_id}</td>
          <td className="p-4 text-sm font-medium text-slate-800">{z.zone_name} (Level {z.floor_level})</td>
          <td className="p-4 text-sm text-slate-600">{z.zone_type}</td>
          <td className="p-4 text-sm text-slate-600">{z.capacity} spots</td>
        </tr>
      ))}
    </TableCard>
  );
}

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  useEffect(() => { fetch(`${API_BASE}/audit-and-spots/audit-logs`).then(r => r.json()).then(d => setLogs(d.data || [])); }, []);

  return (
    <div className="space-y-4">
      {logs.length === 0 ? <p className="text-slate-500">No logs found.</p> : logs.map(log => (
        <div key={log.log_id} className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold font-mono border border-slate-200">{log.action_type}</span>
              <span className="text-xs text-slate-400">User ID: {log.user_id} | IP: {log.ip_address}</span>
            </div>
            <p className="text-sm text-slate-800">{log.description}</p>
          </div>
          <div className="text-xs font-medium text-slate-500 whitespace-nowrap">
            {new Date(log.timestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// VIEWS: ADMIN (JOINS)
// ==========================================
function AdminUsersJoin() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch(`${API_BASE}/core/users/vehicles`).then(r => r.json()).then(d => setData(d.data || [])); }, []);

  return (
    <TableCard headers={['Owner', 'Email', 'Vehicle Info', 'Plate']}>
      {data.map((row, i) => (
        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
          <td className="p-4 text-sm font-medium text-slate-800">{row.first_name} {row.last_name}</td>
          <td className="p-4 text-sm text-slate-600">{row.email}</td>
          <td className="p-4 text-sm text-slate-600 capitalize">{row.color} {row.vehicle_type}</td>
          <td className="p-4"><span className="bg-slate-100 font-mono text-xs px-2 py-1 rounded">{row.license_plate}</span></td>
        </tr>
      ))}
      {data.length === 0 && <tr><td colSpan="4" className="p-4 text-slate-500 text-center">No vehicles found.</td></tr>}
    </TableCard>
  );
}

function AdminSpotsJoin() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch(`${API_BASE}/audit-and-spots/spots-with-zones`).then(r => r.json()).then(d => setData(d.data || [])); }, []);

  return (
    <TableCard headers={['Zone Details', 'Spot ID', 'Spot Number', 'Status']}>
      {data.map((row, i) => (
        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
          <td className="p-4 text-sm text-slate-800">
            <span className="font-bold">{row.zone_name}</span> <span className="text-xs text-slate-500">(Lvl {row.floor_level} - {row.zone_type})</span>
          </td>
          <td className="p-4 text-sm text-slate-500">#{row.spot_id}</td>
          <td className="p-4 text-sm font-bold text-slate-800">{row.spot_number}</td>
          <td className="p-4">
            <StatusBadge status={row.spot_status} successVals={['Available']} />
          </td>
        </tr>
      ))}
    </TableCard>
  );
}

function AdminSessionsJoin() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch(`${API_BASE}/transactions/sessions-with-spots`).then(r => r.json()).then(d => setData(d.data || [])); }, []);

  return (
    <TableCard headers={['Session ID', 'Vehicle ID', 'Spot Info', 'Entry Time', 'Status']}>
      {data.map((row, i) => (
        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
          <td className="p-4 text-sm text-slate-500">#{row.session_id}</td>
          <td className="p-4 text-sm font-medium text-slate-800">Veh #{row.vehicle_id}</td>
          <td className="p-4 text-sm text-slate-800">Spot <span className="font-bold">{row.spot_number}</span> (Zone {row.zone_id})</td>
          <td className="p-4 text-sm text-slate-600">{new Date(row.entry_timestamp).toLocaleString()}</td>
          <td className="p-4"><StatusBadge status={row.session_status} successVals={['Active']} /></td>
        </tr>
      ))}
    </TableCard>
  );
}

function AdminHardwareJoin() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch(`${API_BASE}/hardware/chargers-with-spots`).then(r => r.json()).then(d => setData(d.data || [])); }, []);

  return (
    <TableCard headers={['Charger Type', 'Output', 'Assigned Spot', 'Charger Status']}>
      {data.map((row, i) => (
        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
          <td className="p-4 text-sm font-medium text-slate-800">{row.charger_type}</td>
          <td className="p-4 text-sm text-slate-600">{row.power_output_kw} kW</td>
          <td className="p-4 text-sm text-slate-800">
            {row.spot_number ? <span>Spot {row.spot_number} <span className="text-xs text-slate-500">({row.spot_status})</span></span> : 'Unassigned'}
          </td>
          <td className="p-4"><StatusBadge status={row.charger_status} successVals={['Available', 'Online']} /></td>
        </tr>
      ))}
    </TableCard>
  );
}

function AdminFinanceJoin() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch(`${API_BASE}/finance/report`).then(r => r.json()).then(d => setData(d.data || [])); }, []);

  return (
    <TableCard headers={['Session / IDs', 'Payment Info', 'Violations', 'Charging Cost']}>
      {data.map((row, i) => (
        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
          <td className="p-4 text-sm">
            <div className="font-bold text-slate-800">Session #{row.session_id}</div>
            <div className="text-xs text-slate-500">Pay ID: {row.payment_id || 'N/A'}</div>
          </td>
          <td className="p-4 text-sm text-slate-600">
            {row.payment_amount ? `₱${Number(row.payment_amount).toFixed(2)} (${row.payment_method}) - ${row.payment_status}` : 'No Payment'}
          </td>
          <td className="p-4 text-sm">
            {row.violation_type ? <span className="text-red-600 font-medium">{row.violation_type} (₱{row.fine_amount}) - {row.violation_status}</span> : <span className="text-slate-400">None</span>}
          </td>
          <td className="p-4 text-sm font-bold text-slate-800">
            {row.charging_cost ? `₱${Number(row.charging_cost).toFixed(2)}` : '₱0.00'}
          </td>
        </tr>
      ))}
    </TableCard>
  );
}

// ==========================================
// VIEWS: CUSTOMER
// ==========================================
function CustomerDashboard({ user }) {
  const [reservations, setReservations] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}/transactions/reservations`).then(r => r.json()).then(d => {
      setReservations((d.data || []).filter(r => r.user_id === user.user_id));
    });
  }, [user.user_id]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Clock className="text-indigo-500" size={20} /> My Active Reservations
      </h3>
      <div className="space-y-3">
        {reservations.length === 0 ? (
          <p className="text-sm text-slate-500">You have no reservations.</p>
        ) : reservations.map(r => (
          <div key={r.reservation_id} className="p-4 border border-slate-100 rounded-lg bg-slate-50 flex justify-between items-center">
            <div>
              <span className="text-sm font-bold text-slate-800 block mb-1">Spot ID: {r.spot_id}</span>
              <p className="text-xs text-slate-500">{new Date(r.start_time).toLocaleString()} to {new Date(r.end_time).toLocaleString()}</p>
            </div>
            <StatusBadge status={r.status} successVals={['Active', 'Completed']} />
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
    });
  }, [user.user_id]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {vehicles.length === 0 ? <p className="text-slate-500 col-span-2">No vehicles registered.</p> : vehicles.map(v => (
        <div key={v.vehicle_id} className="p-5 border border-slate-200 shadow-sm rounded-xl bg-white flex justify-between items-start">
          <div>
            <div className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded w-max mb-2">{v.vehicle_type}</div>
            <p className="font-bold text-slate-800 text-2xl tracking-tight mb-1">{v.license_plate}</p>
            <p className="text-sm text-slate-500 capitalize">{v.color} colored vehicle</p>
          </div>
          <Car className="text-slate-300" size={40} />
        </div>
      ))}
    </div>
  );
}

function CustomerPayments() {
  const [payments, setPayments] = useState([]);
  useEffect(() => { fetch(`${API_BASE}/finance/payments`).then(r => r.json()).then(d => setPayments(d.data || [])); }, []);

  return (
    <TableCard headers={['ID', 'Amount', 'Method', 'Status', 'Date']}>
      {payments.map(p => (
        <tr key={p.payment_id} className="border-b border-slate-100 hover:bg-slate-50">
          <td className="p-4 text-sm text-slate-500">#{p.payment_id}</td>
          <td className="p-4 text-sm font-bold text-slate-800">₱{Number(p.amount_due || p.amount || 0).toFixed(2)}</td>
          <td className="p-4 text-sm text-slate-600">{p.method || p.payment_method}</td>
          <td className="p-4"><StatusBadge status={p.status || p.payment_status} successVals={['Paid']} /></td>
          <td className="p-4 text-sm text-slate-500">{new Date(p.timestamp || Date.now()).toLocaleDateString()}</td>
        </tr>
      ))}
    </TableCard>
  );
}

// ==========================================
// REUSABLE UI COMPONENTS
// ==========================================
function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
      <div className={`${color} p-4 rounded-xl text-white`}>{React.cloneElement(icon, { size: 24 })}</div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function TableCard({ headers, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {headers.map((h, i) => <th key={i} className="p-4 font-semibold text-sm text-slate-600">{h}</th>)}
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
    <span className={`px-2 py-1 rounded text-xs font-bold ${
      isSuccess ? 'bg-green-100 text-green-700' : 
      status.includes('Active') || status.includes('Use') ? 'bg-blue-100 text-blue-700' :
      'bg-slate-100 text-slate-700'
    }`}>
      {status}
    </span>
  );
}