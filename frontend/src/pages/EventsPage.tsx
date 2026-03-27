import { useEffect, useState } from 'react'
import api from '../api/axios'
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

type Participant = {
  id: string
  email: string
}

type Event = {
  id: string
  title: string
  description: string
  date: string
  location: string
  participants?: Participant[]
}

type JwtPayload = {
  sub: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  // ✅ decode user
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token)
      setUserId(decoded.sub)
    }
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events')
      setEvents(response.data)
    } catch (error) {
      console.error('Failed to load events', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const joinEvent = async (id: string) => {
    try {
      await api.post(`/events/${id}/join`)
      fetchEvents()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Join failed')
    }
  }

  const leaveEvent = async (id: string) => {
    try {
      await api.post(`/events/${id}/leave`)
      fetchEvents()
    } catch (error) {
      console.error('Leave failed', error)
    }
  }

  if (loading) return <p>Loading events...</p>

  return (
    <div>
      <p className="text-3xl font-bold text-blue-500">Hello Tailwind!</p>
      <h1>Public Events</h1>

      {events.length === 0 && <p>No events available</p>}

      {events.map((event) => {
        const isJoined =
          userId && event.participants?.some((p) => p.id === userId)

        return (
          <div
            key={event.id}
            style={{
              border: '1px solid gray',
              padding: '10px',
              margin: '10px 0',
            }}
          >
            <Link to={`/events/${event.id}`}>
              <h3>{event.title}</h3>
            </Link>

            <p>{event.description}</p>
            <p>📍 {event.location}</p>
            <p>📅 {new Date(event.date).toLocaleString()}</p>

            <div style={{ marginTop: '10px' }}>
              {!isJoined && (
                <button onClick={() => joinEvent(event.id)}>Join</button>
              )}

              {isJoined && (
                <button onClick={() => leaveEvent(event.id)}>Leave</button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
