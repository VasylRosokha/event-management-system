import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, logout: authLogout } = useAuth()

  const logout = () => {
    authLogout()
    navigate('/login')
  }

  return (
    <nav className="border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-6">
        <Link to="/" className="text-lg font-semibold text-gray-900">
          EventHub
        </Link>

        <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
          Events
        </Link>

        {isAuthenticated && (
          <>
            <Link to="/create-event" className="text-sm text-gray-600 hover:text-gray-900">
              Create Event
            </Link>
            <Link to="/my-events" className="text-sm text-gray-600 hover:text-gray-900">
              My Events
            </Link>
          </>
        )}

        <div className="ml-auto flex items-center gap-4">
          {!isAuthenticated && (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}

          {isAuthenticated && (
            <button
              onClick={logout}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
