import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import EventCard from '../components/EventCard'

type Participant = {
  id: string
}

type Event = {
  id: string
  title: string
  description: string
  date: string
  location: string
  capacity?: number
  participants?: Participant[]
}

type JwtPayload = {
  sub: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [joinError, setJoinError] = useState('')
  const { token } = useAuth()

  const userId = token ? jwtDecode<JwtPayload>(token).sub : null

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
      setJoinError('')
      await api.post(`/events/${id}/join`)
      fetchEvents()
    } catch (error: any) {
      setJoinError(error.response?.data?.message || 'Join failed')
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
      <h1>Public Events</h1>

      {joinError && <p style={{ color: 'red' }}>{joinError}</p>}

      {events.length === 0 && <p>No events available</p>}

      {events.map((event) => (
        <EventCard
          key={event.id}
          {...event}
          userId={userId}
          onJoin={joinEvent}
          onLeave={leaveEvent}
        />
      ))}
    </div>
  )
}