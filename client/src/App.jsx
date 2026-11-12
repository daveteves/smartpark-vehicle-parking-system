import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users, Car, MapPin, CreditCard, LayoutDashboard,
  LogOut, AlertCircle, CheckCircle2, Clock, Shield,
  KeyRound, Activity, Zap, FileText, List, ZapIcon,
  Menu, X, ChevronRight, Plus, Pencil, Trash2, RefreshCw,
  Radio, BatteryCharging, Ticket, CalendarCheck, Save, Database
} from 'lucide-react';

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
        const foundUser = json.data.find((u) => u.email === email);
        if (foundUser) onLogin(foundUser);
        else setError('Account not found. Please verify your email.');
      } else {
        setError('Database connection failed.');
      }
    } catch {
      setError('Cannot reach server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-indigo-500/30">
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
                type="email" required
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm text-slate-200"
                placeholder="e.g. admin@smartpark.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type="password" required
                  className="w-full p-2.5 pl-9 bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm text-slate-200"
                  placeholder="Enter database hash"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <KeyRound className="absolute left-3 top-3 text-slate-500" size={14} />
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm shadow-md mt-2 flex justify-center items-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ChevronRight size={14} />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <ZapIcon size={12} className="text-amber-500" /> Quick Access (Seed Data)
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
    if (activeTab === 'dashboard') {
      return user.role === 'Admin'
        ? <AdminDashboard />
        : <CustomerDashboard user={user} />;
    }
    
    if (TABLES[activeTab]) {
      return <CrudTable key={activeTab} tableKey={activeTab} config={TABLES[activeTab]} currentUser={user} />;
    }
    
    if (JOINS[activeTab]) {
      return <JoinReport key={activeTab} config={JOINS[activeTab]} />;
    }
    
    return user.role === 'Admin'
      ? <AdminDashboard />
      : <CustomerDashboard user={user} />;
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans text-slate-200 selection:bg-indigo-500/30">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-slate-950 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800/60 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="h-14 px-5 flex items-center justify-between lg:justify-start gap-3 border-b border-slate-800/60 shrink-0 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <Car className="w-5 h-5 text-indigo-400" />
            <span className="text-base font-black text-white tracking-tight">SmartPark</span>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          <NavItem id="dashboard" icon={<LayoutDashboard />} label="Dashboard" active={activeTab} set={setActiveTab} close={() => setSidebarOpen(false)} />

          {user.role === 'Admin' && (
            <>
              <SidebarGroup label="16 Core Tables" />
              {Object.entries(TABLES).map(([key, cfg]) => (
                <NavItem key={key} id={key} icon={<cfg.icon />} label={cfg.label}
                  active={activeTab} set={setActiveTab} close={() => setSidebarOpen(false)} />
              ))}

              <SidebarGroup label="6 Required Joins" />
              {Object.entries(JOINS).map(([key, cfg]) => (
                <NavItem key={key} id={key} icon={<cfg.icon />} label={cfg.label}
                  active={activeTab} set={setActiveTab} close={() => setSidebarOpen(false)} isJoin />
              ))}
            </>
          )}

          {user.role !== 'Admin' && (
            <>
              <SidebarGroup label="My Portal" />
              <NavItem id="vehicles" icon={<Car />} label="My Garage" active={activeTab} set={setActiveTab} close={() => setSidebarOpen(false)} />
              <NavItem id="reservations" icon={<CalendarCheck />} label="My Bookings" active={activeTab} set={setActiveTab} close={() => setSidebarOpen(false)} />
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
          <button onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-400 bg-slate-800/50 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors border border-slate-800 hover:border-red-900/50">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-14 shrink-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-20 flex items-center px-4 sm:px-6 justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-400 hover:text-indigo-400 bg-slate-900 p-1.5 rounded-md border border-slate-800" onClick={() => setSidebarOpen(true)}>
              <Menu size={16} />
            </button>
            <h1 className="text-lg font-bold text-slate-100 capitalize tracking-tight">
              {TABLES[activeTab]?.label || JOINS[activeTab]?.label || activeTab.replace(/-/g, ' ')}
            </h1>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded text-[10px] font-black tracking-widest uppercase text-indigo-400 flex items-center gap-1.5 shrink-0">
            <Shield size={12} /> {user.role}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-[1400px] mx-auto animate-in fade-in duration-300">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarGroup({ label }) {
  return (
    <div className="pt-4 pb-1.5 px-3 text-[9px] font-black text-slate-500 tracking-[0.15em] uppercase">{label}</div>
  );
}

function NavItem({ id, icon, label, active, set, close, isJoin }) {
  const isActive = active === id;
  return (
    <button onClick={() => { set(id); close(); }}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${isActive ? 'bg-indigo-500/15 text-indigo-300 shadow-[inset_2px_0_0_0_rgba(99,102,241,0.8)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
      <div className="flex items-center gap-2.5">
        {React.cloneElement(icon, { size: 14, className: isActive ? 'text-indigo-400' : 'text-slate-500' })}
        {label}
      </div>
      {isJoin && (
        <span className={`text-[8px] px-1 py-0.5 rounded font-bold tracking-widest border ${isActive ? 'border-indigo-500/30 text-indigo-300 bg-indigo-500/20' : 'border-slate-700 bg-slate-800/50 text-slate-500'}`}>
          JOIN
        </span>
      )}
    </button>
  );
}

/* ==========================================
   TABLE SCHEMA & RELATIONSHIPS
   ========================================== */
const TABLES = {
  users: {
    label: 'Users', icon: Users, base: '/core/users', pk: 'user_id',
    fields: [
      { key: 'first_name', label: 'First Name', type: 'text', required: true },
      { key: 'last_name', label: 'Last Name', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'password_hash', label: 'Password Hash', type: 'text', required: true, hideInTable: true },
      { key: 'role', label: 'Role', type: 'select', options: ['Admin', 'Operator', 'Customer'], required: true },
    ],
  },
  zones: {
    label: 'Parking Zones', icon: MapPin, base: '/core/zones', pk: 'zone_id',
    fields: [
      { key: 'zone_name', label: 'Zone Name', type: 'text', required: true },
      { key: 'floor_level', label: 'Floor Level', type: 'number', required: true },
      { key: 'capacity', label: 'Capacity', type: 'number', required: true },
      { key: 'zone_type', label: 'Zone Type', type: 'select', options: ['Standard', 'VIP', 'EV', 'Disabled'], required: true },
    ],
  },
  tariffs: {
    label: 'Tariff Rules', icon: FileText, base: '/masterdata/tariffs', pk: 'tariff_id',
    fields: [
      { key: 'vehicle_type', label: 'Vehicle Type', type: 'select', options: ['Car', 'Motorcycle', 'EV'], required: true },
      { key: 'base_rate', label: 'Base Rate', type: 'number', required: true },
      { key: 'hourly_rate', label: 'Hourly Rate', type: 'number', required: true },
      { key: 'daily_max', label: 'Daily Max', type: 'number', required: true },
      { key: 'grace_period', label: 'Grace Period (min)', type: 'number', required: true },
    ],
    payloadMapper: (p) => {
      const mapped = { ...p, daily_cap: p.daily_max };
      delete mapped.daily_max;
      return mapped;
    },
  },
  promos: {
    label: 'Promo Codes', icon: Ticket, base: '/masterdata/promos', pk: 'promo_id',
    fields: [
      { key: 'code', label: 'Code', type: 'text', required: true },
      { key: 'discount_percentage', label: 'Discount %', type: 'number' },
      { key: 'discount_amount', label: 'Discount Amt', type: 'number' },
      { key: 'valid_from', label: 'Valid From', type: 'date', required: true },
      { key: 'valid_until', label: 'Valid Until', type: 'date', required: true },
      { key: 'usage_limit', label: 'Usage Limit', type: 'number' },
    ],
    payloadMapper: (p) => {
      const isPercent = p.discount_percentage != null && p.discount_percentage !== '';
      return {
        code: p.code,
        discount_type: isPercent ? 'Percentage' : 'Fixed',
        discount_value: isPercent ? p.discount_percentage : p.discount_amount,
        is_active: true,
        expiry_date: p.valid_until
      };
    },
  },
  vehicles: {
    label: 'Vehicles', icon: Car, base: '/masterdata/vehicles', pk: 'vehicle_id',
    fields: [
      { key: 'user_id', label: 'Owner User ID', type: 'number', required: true, relation: 'users' },
      { key: 'license_plate', label: 'License Plate', type: 'text', required: true },
      { key: 'vehicle_type', label: 'Vehicle Type', type: 'select', options: ['Car', 'Motorcycle', 'EV'], required: true },
      { key: 'color', label: 'Color', type: 'text' },
    ],
  },
  memberships: {
    label: 'Memberships', icon: Shield, base: '/audit-and-spots/memberships', pk: 'membership_id',
    fields: [
      { key: 'user_id', label: 'User ID', type: 'number', required: true, relation: 'users' },
      { key: 'plan_type', label: 'Plan', type: 'select', options: ['Monthly', 'Quarterly', 'Annual'], required: true },
      { key: 'start_date', label: 'Start Date', type: 'date', required: true },
      { key: 'end_date', label: 'End Date', type: 'date', required: true },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Expired', 'Cancelled'] },
    ],
  },
  logs: {
    label: 'Audit Logs', icon: Activity, base: '/audit-and-spots/audit-logs', pk: 'log_id',
    fields: [
      { key: 'user_id', label: 'User ID', type: 'number', relation: 'users' },
      { key: 'action_type', label: 'Action Type', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'text', required: true },
      { key: 'ip_address', label: 'IP Address', type: 'text' },
    ],
  },
  spots: {
    label: 'Parking Spots', icon: CheckCircle2, base: '/audit-and-spots/parking-spots', pk: 'spot_id',
    fields: [
      { key: 'zone_id', label: 'Zone ID', type: 'number', required: true, relation: 'zones' },
      { key: 'spot_number', label: 'Spot Number', type: 'text', required: true },
      { key: 'status', label: 'Status', type: 'select', options: ['Available', 'Occupied', 'Maintenance'] },
    ],
  },
  devices: {
    label: 'IoT Devices', icon: Radio, base: '/hardware/devices', pk: 'device_id',
    fields: [
      { key: 'zone_id', label: 'Zone ID', type: 'number', relation: 'zones' },
      { key: 'device_type', label: 'Device Type', type: 'select', options: ['Camera', 'Boom Barrier', 'Spot Sensor', 'Kiosk'] },
      { key: 'ip_address', label: 'IP Address', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: ['Online', 'Offline', 'Maintenance'] },
      { key: 'last_ping', label: 'Last Ping', type: 'text' },
    ],
  },
  rfid: {
    label: 'RFID Tags', icon: Radio, base: '/hardware/rfid', pk: 'tag_id',
    fields: [
      { key: 'vehicle_id', label: 'Vehicle ID', type: 'number', required: true, relation: 'vehicles' },
      { key: 'rfid_code', label: 'RFID Code', type: 'text', required: true },
      { key: 'issue_date', label: 'Issue Date', type: 'date', required: true },
      { key: 'is_active', label: 'Active (1/0)', type: 'number' },
    ],
  },
  chargers: {
    label: 'EV Chargers', icon: BatteryCharging, base: '/hardware/chargers-with-spots', pk: 'charger_id',
    fields: [
      { key: 'charger_type', label: 'Charger Type', type: 'select', options: ['Level 1', 'Level 2', 'DC Fast'] },
      { key: 'power_output_kw', label: 'Power (kW)', type: 'number' },
      { key: 'spot_number', label: 'Assigned Spot', type: 'text' },
      { key: 'charger_status', label: 'Status', type: 'select', options: ['Available', 'In Use', 'Out of Order'] },
    ],
  },
  reservations: {
    label: 'Reservations', icon: CalendarCheck, base: '/transactions/reservations', pk: 'reservation_id',
    fields: [
      { key: 'user_id', label: 'User ID', type: 'number', required: true, relation: 'users' },
      { key: 'spot_id', label: 'Spot ID', type: 'number', required: true, relation: 'spots' },
      { key: 'start_time', label: 'Start Time', type: 'datetime', required: true },
      { key: 'end_time', label: 'End Time', type: 'datetime', required: true },
      { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Active', 'Completed', 'Cancelled'] },
    ],
  },
  sessions: {
    label: 'Parking Sessions', icon: List, base: '/transactions/sessions', pk: 'session_id',
    fields: [
      { key: 'vehicle_id', label: 'Vehicle ID', type: 'number', required: true, relation: 'vehicles' },
      { key: 'spot_id', label: 'Spot ID', type: 'number', required: true, relation: 'spots' },
      { key: 'entry_timestamp', label: 'Entry Time', type: 'datetime', required: true },
      { key: 'exit_timestamp', label: 'Exit Time', type: 'datetime' },
      { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Completed'] },
    ],
  },
  payments: {
    label: 'Payments', icon: CreditCard, base: '/finance/payments', pk: 'payment_id',
    fields: [
      { key: 'session_id', label: 'Session ID', type: 'number', required: true, relation: 'sessions' },
      { key: 'amount_due', label: 'Amount Due', type: 'number', required: true },
      { key: 'amount_paid', label: 'Amount Paid', type: 'number' },
      { key: 'method', label: 'Method', type: 'select', options: ['Cash', 'Card', 'Digital Wallet'], required: true },
      { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Paid', 'Failed'] },
    ],
    payloadMapper: (p) => {
      const mapped = { 
        ...p, 
        amount: p.amount_due, 
        payment_method: p.method,
        payment_status: p.status
      };
      delete mapped.amount_due;
      delete mapped.method;
      delete mapped.status;
      return mapped;
    },
  },
  violations: {
    label: 'Violations', icon: AlertCircle, base: '/finance/violations', pk: 'violation_id',
    fields: [
      { key: 'vehicle_id', label: 'Vehicle ID', type: 'number', required: true, relation: 'vehicles' },
      { key: 'session_id', label: 'Session ID', type: 'number', relation: 'sessions' },
      { key: 'violation_type', label: 'Violation Type', type: 'text', required: true },
      { key: 'fine_amount', label: 'Fine Amount', type: 'number', required: true },
      { key: 'status', label: 'Status', type: 'select', options: ['Unpaid', 'Paid', 'Appealed'] },
    ],
    payloadMapper: (p) => {
      const mapped = { ...p, violation_status: p.status };
      delete mapped.status;
      return mapped;
    },
  },
  charging: {
    label: 'Charging Sessions',
    icon: Zap,
    base: null,
    derivedFrom: 'finance-report',
    pk: 'charging_id',
    fields: [
      { key: 'charging_id', label: 'ID', type: 'number' },
      { key: 'session_id', label: 'Session ID', type: 'number', relation: 'sessions' },
      { key: 'charging_start', label: 'Start', type: 'datetime' },
      { key: 'charging_cost', label: 'Cost', type: 'number' },
    ],
  },
};

const JOINS = {
  'join-users-vehicles': { label: '1. Users & Vehicles', icon: Users, path: '/core/users/vehicles', columns: ['first_name', 'last_name', 'email', 'vehicle_type', 'color', 'license_plate'] },
  'join-spots-zones': { label: '2. Spots & Zones', icon: CheckCircle2, path: '/audit-and-spots/spots-with-zones', columns: ['zone_name', 'floor_level', 'zone_type', 'spot_id', 'spot_number', 'spot_status'] },
  'join-sessions-spots': { label: '3. Live Sessions', icon: List, path: '/transactions/sessions-with-spots', columns: ['session_id', 'vehicle_id', 'spot_number', 'zone_id', 'entry_timestamp', 'session_status'] },
  'join-chargers-spots': { label: '4. EV Chargers', icon: Zap, path: '/hardware/chargers-with-spots', columns: ['charger_id', 'charger_type', 'power_output_kw', 'spot_number', 'charger_status'] },
  'join-finance': { label: '5. Master Finance', icon: FileText, path: '/finance/report', columns: ['session_id', 'payment_id', 'payment_amount', 'payment_status', 'violation_type', 'fine_amount', 'charging_cost'] },
  'join-audit': { label: '6. Audit & Users', icon: Activity, path: '/audit-and-spots/audit-logs', columns: ['log_id', 'user_id', 'action_type', 'description', 'ip_address', 'timestamp'] },
};

/* ==========================================
   GENERIC CRUD TABLE (With Relations & Fallback)
   ========================================== */
function CrudTable({ tableKey, config, currentUser }) {
  const { base, pk, fields, derivedFrom, payloadMapper } = config;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const tableFields = fields.filter((f) => !f.hideInTable);
  const overrideKey = `smartpark_overrides_${tableKey}`;

  const isCustomer = currentUser?.role === 'Customer';
  const restrictToUser = isCustomer && fields.some(f => f.key === 'user_id');

  const getOverrides = () => JSON.parse(localStorage.getItem(overrideKey) || '{"created":[], "updated":{}, "deleted":[]}');

  // Load relation data for dropdowns (memoized)
  const relationData = useMemo(() => {
    const data = {};
    fields.forEach(f => {
      if (f.relation && TABLES[f.relation]) {
        const relConfig = TABLES[f.relation];
        fetch(`${API_BASE}${relConfig.base}`)
          .then(r => r.json())
          .then(json => {
            if (json.success) data[f.relation] = json.data;
          }).catch(console.error);
      }
    });
    return data;
  }, [fields]);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      let serverData = [];

      if (derivedFrom === 'finance-report') {
        const res = await fetch(`${API_BASE}/finance/report`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Failed to load');
        const seen = new Set();
        (json.data || []).forEach((row) => {
          if (row.charging_id == null || seen.has(row.charging_id)) return;
          seen.add(row.charging_id);
          serverData.push({
            charging_id: row.charging_id,
            session_id: row.session_id,
            charging_start: row.charging_start,
            charging_cost: row.charging_cost,
          });
        });
      } else {
        const res = await fetch(`${API_BASE}${base}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Failed to load');
        serverData = json.data || [];
      }

      let finalData = serverData;
      if (usingFallback || localStorage.getItem(overrideKey)) {
        const overrides = getOverrides();
        finalData = finalData.map(row => {
          const rowId = row[pk];
          return overrides.updated[rowId] ? { ...row, ...overrides.updated[rowId] } : row;
        });
        finalData = finalData.filter(row => !overrides.deleted.includes(row[pk]));
        finalData = [...finalData, ...overrides.created];
      }

      if (restrictToUser) {
        finalData = finalData.filter(row => String(row.user_id) === String(currentUser.user_id));
      }

      setRows(finalData);
    } catch (err) {
      setError(err.message || 'Cannot reach server.');
    } finally {
      setLoading(false);
    }
  }, [base, derivedFrom, overrideKey, pk, restrictToUser, currentUser, usingFallback]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    const blank = {};
    fields.forEach((f) => { 
      blank[f.key] = (restrictToUser && f.key === 'user_id') ? currentUser.user_id : ''; 
    });
    setModal({ mode: 'create', data: blank });
  };

  const openEdit = (row) => {
    const data = {};
    fields.forEach((f) => {
      const v = row[f.key];
      data[f.key] = v === null || v === undefined ? '' : v;
    });
    setModal({ mode: 'edit', data });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const isEdit = modal.mode === 'edit';
      let payload = {};
      
      fields.forEach((f) => {
        let v = modal.data[f.key];
        if (v === '') v = null;
        if (v !== null && f.type === 'number') v = Number(v);
        payload[f.key] = v;
      });

      if (restrictToUser) payload['user_id'] = currentUser.user_id;

      const applyLocalChange = () => {
        const overrides = getOverrides();
        if (isEdit) {
          const targetId = payload[pk];
          const createdIdx = overrides.created.findIndex((r) => r[pk] == targetId);
          if (createdIdx > -1) {
            overrides.created[createdIdx] = { ...overrides.created[createdIdx], ...payload };
          } else {
            overrides.updated[targetId] = { ...(overrides.updated[targetId] || {}), ...payload };
          }
        } else {
          payload[pk] = Date.now();
          overrides.created.push(payload);
        }
        localStorage.setItem(overrideKey, JSON.stringify(overrides));
        setUsingFallback(true);
        setModal(null);
        load();
      };

      if (derivedFrom === 'finance-report') {
        applyLocalChange();
        return;
      }

      const url = isEdit ? `${API_BASE}${base}/${payload[pk]}` : `${API_BASE}${base}`;
      const method = isEdit ? 'PUT' : 'POST';

      if (payloadMapper) {
        payload = payloadMapper(payload);
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const json = await res.json();
      
      if (!json.success) {
        if (res.status === 404 || res.status === 500 || json.message === 'Server error') {
           applyLocalChange();
        } else {
           throw new Error(json.message || 'Save failed');
        }
      } else {
        setModal(null);
        load();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete ${config.label} #${row[pk]}?`)) return;
    setError('');
    try {
      const applyLocalDelete = () => {
        const overrides = getOverrides();
        const targetId = row[pk];
        const createdIdx = overrides.created.findIndex((r) => r[pk] == targetId);
        if (createdIdx > -1) {
          overrides.created.splice(createdIdx, 1);
        } else {
          overrides.deleted.push(targetId);
          delete overrides.updated[targetId];
        }
        localStorage.setItem(overrideKey, JSON.stringify(overrides));
        setUsingFallback(true);
        load();
      };

      if (derivedFrom === 'finance-report') {
        applyLocalDelete();
        return;
      }

      const res = await fetch(`${API_BASE}${base}/${row[pk]}`, { method: 'DELETE' });
      const json = await res.json();
      
      if (!json.success) {
        if (res.status === 404 || res.status === 500 || json.message === 'Server error') {
           applyLocalDelete();
        } else {
           throw new Error(json.message || 'Delete failed');
        }
      } else {
        load();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const resetOverrides = () => {
    if(window.confirm("Reset all local changes for this table back to server defaults?")) {
      localStorage.removeItem(overrideKey);
      setUsingFallback(false);
      load();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100">{config.label}</h2>
            {(usingFallback || localStorage.getItem(overrideKey)) && (
              <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                <Database size={10} /> Local Fallback Active
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
            {restrictToUser ? 'Viewing my records only' : `CRUD • ${base || 'Local Fallback'}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(usingFallback || localStorage.getItem(overrideKey)) && (
             <button onClick={resetOverrides} className="text-xs font-bold text-slate-400 hover:text-white mr-2 border border-slate-700 bg-slate-800 px-3 py-2 rounded-lg transition-colors">
               Reset to Server
             </button>
          )}
          <button onClick={load} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-300 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={openCreate}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-md">
            <Plus size={14} /> Add Record
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/30 text-red-400 px-3 py-2.5 rounded-lg text-xs flex items-center gap-2 border border-red-900/50">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="px-4 py-3 font-bold text-[10px] tracking-widest text-slate-500 uppercase">#</th>
                {tableFields.map((f) => (
                  <th key={f.key} className="px-4 py-3 font-bold text-[10px] tracking-widest text-slate-500 uppercase">{f.label}</th>
                ))}
                <th className="px-4 py-3 font-bold text-[10px] tracking-widest text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={tableFields.length + 2} className="px-4 py-10 text-center text-xs text-slate-500">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={tableFields.length + 2} className="px-4 py-10 text-center text-xs text-slate-500">No records found.</td></tr>
              ) : (
                rows.map((row, i) => (
                  <tr key={row[pk] ?? i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-slate-500">{row[pk] ?? i + 1}</td>
                    {tableFields.map((f) => (
                      <td key={f.key} className="px-4 py-3 text-xs text-slate-300">
                        {formatCell(row[f.key], f)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button onClick={() => openEdit(row)} title="Edit"
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded border border-transparent hover:border-indigo-500/30 transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => remove(row)} title="Delete"
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded border border-transparent hover:border-red-500/30 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={`${modal.mode === 'create' ? 'Create' : 'Edit'} ${config.label}`}
          onClose={() => setModal(null)}>
          <form onSubmit={submit} className="space-y-3">
            {fields.map((f) => {
              if (f.key === 'password_hash' && modal.mode === 'create') {
                return (
                  <div key={f.key}>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Password Hash</label>
                    <input
                      type="text"
                      required
                      value={modal.data[f.key] || `hash_${Date.now()}`}
                      onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, [f.key]: e.target.value } }))}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                );
              }

              return (
                <div key={f.key}>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {f.label} {f.required && <span className="text-red-400">*</span>}
                  </label>
                  
                  {f.relation ? (
                    <select
                      required={f.required}
                      value={modal.data[f.key] ?? ''}
                      onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, [f.key]: e.target.value } }))}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">— select {f.label.toLowerCase()} —</option>
                      {(relationData[f.relation] || []).map((relRow) => {
                        const relConfig = TABLES[f.relation];
                        const label = relRow.first_name ? `${relRow.first_name} ${relRow.last_name}` : relRow.zone_name || relRow.spot_number || relRow.license_plate || `ID ${relRow[relConfig.pk]}`;
                        return <option key={relRow[relConfig.pk]} value={relRow[relConfig.pk]}>{label}</option>
                      })}
                    </select>
                  ) : f.type === 'select' ? (
                    <select
                      required={f.required}
                      value={modal.data[f.key] ?? ''}
                      onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, [f.key]: e.target.value } }))}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
                      <option value="">— select —</option>
                      {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={f.type === 'datetime' ? 'datetime-local' : f.type}
                      required={f.required}
                      readOnly={restrictToUser && f.key === 'user_id'}
                      value={modal.data[f.key] ?? ''}
                      onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, [f.key]: e.target.value } }))}
                      className={`w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500 ${restrictToUser && f.key === 'user_id' ? 'text-slate-500 cursor-not-allowed' : 'text-slate-200'}`}
                    />
                  )}
                </div>
              );
            })}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModal(null)}
                className="px-3 py-2 text-xs font-bold text-slate-400 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg disabled:opacity-60">
                <Save size={13} /> {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function formatCell(value, field) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-slate-600 italic">—</span>;
  }
  if (field.type === 'datetime' || field.type === 'date') {
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return field.type === 'date' ? d.toLocaleDateString() : d.toLocaleString();
    }
  }
  return String(value);
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={16} /></button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/* ==========================================
   JOIN REPORT
   ========================================== */
function JoinReport({ config }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}${config.path}`);
        const json = await res.json();
        if (json.success) setRows(json.data || []);
        else setError(json.message || 'Failed to load');
      } catch {
        setError('Cannot reach server.');
      } finally {
        setLoading(false);
      }
    })();
  }, [config.path]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-100">{config.label}</h2>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">JOIN report • {config.path}</p>
        </div>
      </div>
      {error && (
        <div className="bg-red-950/30 text-red-400 px-3 py-2.5 rounded-lg text-xs flex items-center gap-2 border border-red-900/50">
          <AlertCircle size={14} /> {error}
        </div>
      )}
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                {config.columns.map((c) => (
                  <th key={c} className="px-4 py-3 font-bold text-[10px] tracking-widest text-slate-500 uppercase">{c.replace(/_/g, ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={config.columns.length} className="px-4 py-10 text-center text-xs text-slate-500">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={config.columns.length} className="px-4 py-10 text-center text-xs text-slate-500">No records.</td></tr>
              ) : rows.map((row, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  {config.columns.map((c) => (
                    <td key={c} className="px-4 py-3 text-xs text-slate-300">
                      {row[c] === null || row[c] === undefined || row[c] === ''
                        ? <span className="text-slate-600 italic">—</span>
                        : String(row[c])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   ADMIN DASHBOARD
   ========================================== */
function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, zones: 0, activeSessions: 0 });
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/core/users`).then((r) => r.json()),
      fetch(`${API_BASE}/core/zones`).then((r) => r.json()),
      fetch(`${API_BASE}/transactions/sessions`).then((r) => r.json()),
    ]).then(([u, z, s]) => {
      setStats({
        users: (u.data || []).length,
        zones: (z.data || []).length,
        activeSessions: (s.data || []).filter((x) => x.status === 'Active').length,
      });
    }).catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={<Users />} title="Total Users" value={stats.users} color="indigo" />
        <StatCard icon={<MapPin />} title="Parking Zones" value={stats.zones} color="blue" />
        <StatCard icon={<Activity />} title="Live Sessions" value={stats.activeSessions} color="emerald" />
        <StatCard icon={<Zap />} title="System Status" value="Online" color="slate" />
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  const colorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
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

/* ==========================================
   CUSTOMER DASHBOARD
   ========================================== */
function CustomerDashboard({ user }) {
  const [reservations, setReservations] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}/transactions/reservations`).then((r) => r.json()).then((d) => {
      setReservations((d.data || []).filter((r) => r.user_id === user.user_id));
    }).catch((e) => console.error(e));
  }, [user.user_id]);

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5 sm:p-6">
      <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
        <Clock className="text-indigo-400" size={18} /> My Active Reservations
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reservations.length === 0 ? (
          <p className="text-xs font-medium text-slate-500 col-span-full bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center">
            No active reservations.
          </p>
        ) : reservations.map((r) => (
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
                {new Date(r.start_time).toLocaleString()} <br />
                <span className="text-slate-600">until</span> <br />
                {new Date(r.end_time).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status, successVals = [] }) {
  if (!status) return null;
  const isSuccess = successVals.includes(status);
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase border ${
      isSuccess ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        : status.includes('Active') || status.includes('Use') ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        : 'bg-slate-800 text-slate-400 border-slate-700'
    }`}>
      {status}
    </span>
  );
}