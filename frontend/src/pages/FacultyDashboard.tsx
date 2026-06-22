import { useState } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Users, Calendar, BookOpen, FileText, BarChart3, LogOut, Search, Bell, Clock, GraduationCap, AlertTriangle, CheckCircle, XCircle, Plus, Edit3 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function FacultyHome() {
  const stats = [
    { label: 'Next class', value: 'Algorithms • 10:30', icon: Clock },
    { label: 'Attendance %', value: '94%', icon: Users },
    { label: 'Pending assignments', value: '12', icon: FileText },
    { label: 'Students at risk', value: '3', icon: AlertTriangle },
    { label: 'Office hours', value: '4-6pm', icon: Calendar },
  ]
  const recentActivity = [
    { action: 'Graded Assignment 3', course: 'Data Structures', time: '2h ago' },
    { action: 'Marked attendance', course: 'Algorithms', time: '4h ago' },
    { action: 'Posted lecture notes', course: 'DBMS', time: '6h ago' },
    { action: 'Scheduled quiz', course: 'Operating Systems', time: '1d ago' },
  ]
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-white mb-1">Faculty Dashboard</h1><p className="text-zinc-400">Manage your classes, track attendance, and monitor student progress.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5 hover:bg-white/10 transition-all">
            <p className="text-xs text-zinc-500 mb-2">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">Class Performance</h3>
          <div className="flex items-end justify-between gap-1 h-48">
            {[...Array(30)].map((_, i) => (
              <motion.div key={i} className="flex-1 bg-gradient-to-t from-cyan-500/80 to-purple-400/80 rounded-t-lg"
                initial={{ height: 0 }} animate={{ height: `${20+Math.random()*80}%` }} transition={{ delay: i * 0.02, duration: 0.5 }} />
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center"><CheckCircle size={14} className="text-purple-400" /></div>
                <div className="flex-1">
                  <p className="text-sm text-white">{a.action}</p>
                  <p className="text-xs text-zinc-500">{a.course}</p>
                </div>
                <span className="text-xs text-zinc-500">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ClassesPage() {
  const classes = [
    { name: 'Data Structures', code: 'CS201', students: 45, time: 'Mon/Wed 9:00 AM', room: 'Lab 3', attendance: '92%' },
    { name: 'Algorithms', code: 'CS301', students: 38, time: 'Tue/Thu 10:30 AM', room: 'Hall B', attendance: '94%' },
    { name: 'Database Systems', code: 'CS401', students: 42, time: 'Mon/Wed 2:00 PM', room: 'Lab 5', attendance: '89%' },
    { name: 'Operating Systems', code: 'CS501', students: 35, time: 'Fri 11:00 AM', room: 'Hall A', attendance: '96%' },
  ]
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-white mb-1">My Classes</h1><p className="text-zinc-400">Manage your class schedules and materials.</p></div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-sm transition-all"><Plus size={16} />New Class</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classes.map((c, i) => (
          <motion.div key={c.code} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">{c.name}</h3>
              <span className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded-full">{c.code}</span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-zinc-400 flex items-center gap-2"><Users size={14} />{c.students} students</p>
              <p className="text-zinc-400 flex items-center gap-2"><Clock size={14} />{c.time}</p>
              <p className="text-zinc-400 flex items-center gap-2"><GraduationCap size={14} />{c.room}</p>
              <p className="text-zinc-400 flex items-center gap-2">Attendance: <span className="text-emerald-400">{c.attendance}</span></p>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm text-white transition-all">View</button>
              <button className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm text-white transition-all"><Edit3 size={14} className="inline mr-1" />Edit</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function AttendancePage() {
  const students = [
    { name: 'Rahul Sharma', roll: 'CS2023001', present: 42, total: 45, status: 'good' },
    { name: 'Priya Patel', roll: 'CS2023002', present: 44, total: 45, status: 'good' },
    { name: 'Amit Kumar', roll: 'CS2023003', present: 38, total: 45, status: 'at-risk' },
    { name: 'Sneha Gupta', roll: 'CS2023004', present: 45, total: 45, status: 'excellent' },
    { name: 'Vikram Mehta', roll: 'CS2023005', present: 35, total: 45, status: 'at-risk' },
  ]
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-1">Attendance</h1>
      <p className="text-zinc-400">Track and manage student attendance.</p>
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="text-xs text-zinc-500 border-b border-white/10">
            <th className="text-left px-6 py-3 font-medium">STUDENT</th>
            <th className="text-left px-6 py-3 font-medium">ROLL NO</th>
            <th className="text-left px-6 py-3 font-medium">PRESENT</th>
            <th className="text-left px-6 py-3 font-medium">TOTAL</th>
            <th className="text-left px-6 py-3 font-medium">%</th>
            <th className="text-left px-6 py-3 font-medium">STATUS</th>
          </tr></thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-sm text-white">{s.name}</td>
                <td className="px-6 py-4 text-sm text-zinc-400\">{s.roll}</td>
                <td className="px-6 py-4 text-sm text-white\">{s.present}</td>
                <td className="px-6 py-4 text-sm text-white\">{s.total}</td>
                <td className="px-6 py-4 text-sm text-white\">{Math.round((s.present/s.total)*100)}%</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${s.status==='good'?'bg-emerald-500/20 text-emerald-400':s.status==='excellent'?'bg-purple-500/20 text-purple-400':'bg-red-500/20 text-red-400'}`}>
                    {s.status === 'at-risk' ? 'At Risk' : s.status === 'excellent' ? 'Excellent' : 'Good'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MeetingsPage() {
  const meetings = [
    { title: 'Faculty Meeting', date: 'Mar 15, 2026', time: '2:00 PM', type: 'Department', status: 'upcoming' },
    { title: 'Parent-Teacher Meeting', date: 'Mar 20, 2026', time: '10:00 AM', type: 'Academic', status: 'upcoming' },
    { title: 'Research Committee', date: 'Mar 10, 2026', time: '3:00 PM', type: 'Research', status: 'completed' },
    { title: 'Student Council', date: 'Mar 5, 2026', time: '11:00 AM', type: 'Student Affairs', status: 'completed' },
  ]
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-1">Meetings</h1>
      <p className="text-zinc-400">Schedule and manage meetings.</p>
      <div className="space-y-4">
        {meetings.map((m, i) => (
          <motion.div key={m.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.status === 'upcoming' ? 'bg-purple-500/20' : 'bg-white/5'}`}>
              <Calendar size={20} className={m.status === 'upcoming' ? 'text-purple-400' : 'text-zinc-500'} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">{m.title}</h3>
              <p className="text-sm text-zinc-400">{m.date} • {m.time} • {m.type}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full ${m.status==='upcoming'?'bg-purple-500/20 text-purple-400':'bg-emerald-500/20 text-emerald-400'}`}>
              {m.status === 'upcoming' ? 'Upcoming' : 'Completed'}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function AssignmentsPage() {
  const assignments = [
    { title: 'Assignment 4: Graph Algorithms', course: 'Data Structures', due: 'Mar 18, 2026', submitted: 38, total: 45, status: 'active' },
    { title: 'Lab 5: SQL Queries', course: 'Database Systems', due: 'Mar 20, 2026', submitted: 30, total: 42, status: 'active' },
    { title: 'Project: OS Scheduler', course: 'Operating Systems', due: 'Mar 25, 2026', submitted: 0, total: 35, status: 'upcoming' },
    { title: 'Quiz 2: Sorting', course: 'Algorithms', due: 'Mar 10, 2026', submitted: 38, total: 38, status: 'completed' },
  ]
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-white mb-1">Assignments</h1><p className="text-zinc-400">Create and grade assignments.</p></div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-sm transition-all"><Plus size={16} />New Assignment</button>
      </div>
      <div className="space-y-4">
        {assignments.map((a, i) => (
          <motion.div key={a.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">{a.title}</h3>
              <span className={`text-xs px-3 py-1 rounded-full ${a.status==='active'?'bg-purple-500/20 text-purple-400':a.status==='upcoming'?'bg-yellow-500/20 text-yellow-400':'bg-emerald-500/20 text-emerald-400'}`}>{a.status}</span>
            </div>
            <p className="text-sm text-zinc-400 mb-2">{a.course} • Due: {a.due}</p>
            <div className="w-full bg-white/5 rounded-full h-2 mb-2">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2 rounded-full" style={{ width: `${(a.submitted/a.total)*100}%` }} />
            </div>
            <p className="text-xs text-zinc-500">{a.submitted}/{a.total} submitted</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsPage() {
  const metrics = [
    { label: 'Average Class Score', value: '78.5%', change: '+3.2%', icon: BarChart3 },
    { label: 'Assignment Completion', value: '89%', change: '+5%', icon: CheckCircle },
    { label: 'Student Engagement', value: '92%', change: '+2%', icon: Users },
    { label: 'Course Satisfaction', value: '4.6/5', change: '+0.3', icon: GraduationCap },
  ]
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-1">Analytics</h1>
      <p className="text-zinc-400">View class performance analytics.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4"><m.icon size={20} className="text-purple-400" /></div>
            <p className="text-xs text-zinc-500 mb-1">{m.label}</p>
            <p className="text-2xl font-bold text-white mb-1">{m.value}</p>
            <p className="text-xs text-emerald-400">{m.change}</p>
          </motion.div>
        ))}
      </div>
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">Student Performance Distribution</h3>
        <div className="flex items-end justify-between gap-2 h-64">
          {['A+', 'A', 'B+', 'B', 'C', 'D', 'F'].map((grade, i) => {
            const heights = [15, 25, 35, 20, 10, 8, 5]
            return (
              <div key={grade} className="flex flex-col items-center flex-1">
                <motion.div className="w-full bg-gradient-to-t from-purple-500/80 to-cyan-400/80 rounded-t-lg"
                  initial={{ height: 0 }} animate={{ height: `${heights[i]}%` }} transition={{ delay: i * 0.1, duration: 0.5 }} />
                <p className="text-xs text-zinc-500 mt-2">{grade}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function FacultyDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const handleLogout = () => { logout(); toast.success('Signed out successfully'); navigate('/') }
  const navItems = [
    { path: '/faculty', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/faculty/classes', label: 'Classes', icon: BookOpen },
    { path: '/faculty/attendance', label: 'Attendance', icon: Users },
    { path: '/faculty/meetings', label: 'Meetings', icon: Calendar },
    { path: '/faculty/assignments', label: 'Assignments', icon: FileText },
    { path: '/faculty/analytics', label: 'Analytics', icon: BarChart3 },
  ]
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <aside className="w-64 border-r border-white/10 flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center"><span className="text-white font-bold text-sm">A</span></div>
            <span className="font-bold text-white">ADhoc<span className="text-purple-400">.ai</span></span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${location.pathname===item.path?'bg-white/10 text-white':'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={18} />{item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="glass rounded-xl p-4 mb-4">
            <p className="text-xs text-zinc-500 mb-1">SIGNED IN</p>
            <p className="text-sm text-white truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-400 hover:text-white transition-colors w-full">
            <LogOut size={18} />Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="text" placeholder="Search classes, students..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all relative">
              <Bell size={18} /><span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-500" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-400 flex items-center justify-center text-white font-bold text-sm">{user?.avatar || 'F'}</div>
          </div>
        </header>
        <div className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<FacultyHome />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/meetings" element={<MeetingsPage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}