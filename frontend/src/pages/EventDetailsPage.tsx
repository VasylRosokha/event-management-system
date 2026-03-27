import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { jwtDecode } from 'jwt-decode'

type Participant = {
  id: string
  email: string
}

type Organizer = {
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
  organizer?: Organizer // ✅ ADD THIS
}

type JwtPayload = {
  sub: string // ✅ KEEP THIS (your backend uses sub)
  email: string
}

export default function EventDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  // ✅ Decode token (UNCHANGED)
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token)
        setUserId(decoded.sub)
      } catch {
        console.error('Invalid token')
      }
    }
  }, [])

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`)
      setEvent(response.data)
    } catch (error) {
      console.error('Failed to load event', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvent()
  }, [id])

  const joinEvent = async () => {
    try {
      await api.post(`/events/${id}/join`)
      fetchEvent()
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert(error.response.data.message)
      } else {
        console.error('Join failed', error)
      }
    }
  }

  const leaveEvent = async () => {
    try {
      await api.post(`/events/${id}/leave`)
      fetchEvent()
    } catch (error) {
      console.error('Leave failed', error)
    }
  }

  const deleteEvent = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return

    try {
      await api.delete(`/events/${id}`)
      navigate('/')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Delete failed')
    }
  }

  if (loading) return <p>Loading event...</p>
  if (!event) return <p>Event not found</p>

  // ✅ KEEP YOUR WORKING LOGIC
  const isJoined = userId && event.participants?.some((p) => p.id === userId)

  // ✅ ADD ORGANIZER CHECK (NEW)
  const isOrganizer = userId === event.organizer?.id

  return (
    <div>
      <h1>{event.title}</h1>

      <p>{event.description}</p>
      <p>📍 {event.location}</p>
      <p>📅 {new Date(event.date).toLocaleString()}</p>

      <p>Participants: {event.participants?.length ?? 0}</p>

      {/* ✅ JOIN / LEAVE */}
      <div style={{ marginTop: '20px' }}>
        {!isJoined && <button onClick={joinEvent}>Join Event</button>}
        {isJoined && <button onClick={leaveEvent}>Leave Event</button>}
      </div>

      {/* ✅ NEW: ORGANIZER CONTROLS */}
      {isOrganizer && (
        <div style={{ marginTop: '20px' }}>
          <Link to={`/events/${id}/edit`}>
            <button>Edit Event</button>
          </Link>

          <button
            onClick={deleteEvent}
            style={{ marginLeft: '10px', color: 'red' }}
          >
            Delete Event
          </button>
        </div>
      )}
    </div>
  )
}
