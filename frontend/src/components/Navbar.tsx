import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '10px',
        borderBottom: '1px solid gray',
        marginBottom: '20px',
      }}
    >
      {/* LEFT SIDE */}
      <Link to="/">Events</Link>

      {token && (
        <>
          <Link to="/create-event">Create Event</Link> {/* ✅ ADDED */}
          <Link to="/my-events">My Events</Link>
        </>
      )}

      {/* RIGHT SIDE */}
      <div style={{ marginLeft: 'auto' }}>
        {!token && (
          <>
            <Link to="/login" style={{ marginRight: '10px' }}>
              Login
            </Link>

            <Link to="/register">Register</Link>
          </>
        )}

        {token && <button onClick={logout}>Logout</button>}
      </div>
    </nav>
  )
}
