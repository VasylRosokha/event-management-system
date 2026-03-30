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
  organizer?: Organizer
}

type JwtPayload = {
  sub: string
  email: string
}

export default function EventDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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
      setError('')
      await api.post(`/events/${id}/join`)
      fetchEvent()
    } catch (error: any) {
      setError(error.response?.data?.message || 'Join failed')
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
    try {
      setError('')
      await api.delete(`/events/${id}`)
      navigate('/')
    } catch (error: any) {
      setShowDeleteModal(false)
      setError(error.response?.data?.message || 'Delete failed')
    }
  }

  if (loading) return <p>Loading event...</p>
  if (!event) return <p>Event not found</p>

  const isJoined = userId && event.participants?.some((p) => p.id === userId)
  const isOrganizer = userId === event.organizer?.id

  return (
    <div>
      <h1>{event.title}</h1>

      <p>{event.description}</p>
      <p>📍 {event.location}</p>
      <p>📅 {new Date(event.date).toLocaleString()}</p>

      <p>Participants: {event.participants?.length ?? 0}</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* JOIN / LEAVE */}
      <div style={{ marginTop: '20px' }}>
        {!isJoined && <button onClick={joinEvent}>Join Event</button>}
        {isJoined && <button onClick={leaveEvent}>Leave Event</button>}
      </div>

      {/* ORGANIZER CONTROLS */}
      {isOrganizer && (
        <div style={{ marginTop: '20px' }}>
          <Link to={`/events/${id}/edit`}>
            <button>Edit Event</button>
          </Link>

          <button
            onClick={() => setShowDeleteModal(true)}
            style={{ marginLeft: '10px', color: 'red' }}
          >
            Delete Event
          </button>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '8px',
              maxWidth: '400px',
              width: '100%',
            }}
          >
            <h2 style={{ marginTop: 0 }}>Delete Event</h2>
            <p>Are you sure you want to delete this event?</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button onClick={deleteEvent} style={{ color: 'red' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
