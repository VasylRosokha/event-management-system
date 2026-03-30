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

  if (loading) return <p className="text-gray-500">Loading event...</p>
  if (!event) return <p className="text-gray-500">Event not found</p>

  const isJoined = userId && event.participants?.some((p) => p.id === userId)
  const isOrganizer = userId === event.organizer?.id

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">{event.title}</h1>

        {event.description && (
          <p className="mb-6 text-gray-600">{event.description}</p>
        )}

        <div className="mb-6 space-y-2 text-sm text-gray-500">
          <p className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location}
          </p>
          <p className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(event.date).toLocaleString()}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">
            Participants ({event.participants?.length ?? 0})
          </h2>
          {event.participants && event.participants.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {event.participants.map((p) => (
                <span
                  key={p.id}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                >
                  {p.email}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No participants yet</p>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {!isJoined && (
            <button
              onClick={joinEvent}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Join Event
            </button>
          )}
          {isJoined && (
            <button
              onClick={leaveEvent}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Leave Event
            </button>
          )}

          {isOrganizer && (
            <>
              <Link
                to={`/events/${id}/edit`}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit Event
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete Event
              </button>
            </>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Delete Event</h2>
            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteEvent}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}