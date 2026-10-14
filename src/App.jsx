import { useApp } from './context/AppContext.jsx'
import RoleGate from './components/gate/RoleGate.jsx'
import StudentHome from './components/student/StudentHome.jsx'
import AdminDashboard from './components/admin/AdminDashboard.jsx'

// No router needed: the saved "session" decides which screen we show.
export default function App() {
  const { session } = useApp()

  if (!session) return <RoleGate />
  if (session.role === 'admin') return <AdminDashboard />
  return <StudentHome />
}
