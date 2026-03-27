import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

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
  organizer?: { id: string; email: string }
  participants?: Participant[]
}

type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
}

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [view, setView] = useState<(typeof Views)[keyof typeof Views]>(
    Views.MONTH,
  )
  const [date, setDate] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false) // ✅ toggle

  const navigate = useNavigate()
  const localizer = momentLocalizer(moment)

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await api.get('events/users/me/events')
        setEvents(response.data)

        const formatted: CalendarEvent[] = response.data.map((event: Event) => {
          const start = new Date(event.date)
          const end = new Date(start)
          end.setHours(end.getHours() + 1) // 1 hour default
          return {
            id: event.id,
            title: event.title,
            start,
            end,
          }
        })

        setCalendarEvents(formatted)
      } catch (error) {
        console.error('Failed to load my events', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMyEvents()
  }, [])

  const handleSelectEvent = (event: CalendarEvent) => {
    navigate(`/events/${event.id}`)
  }

  if (loading) return <p>Loading your events...</p>
  if (events.length === 0)
    return (
      <p>You are not part of any events yet. Explore public events and join.</p>
    )

  return (
    <div>
      <h1>My Events</h1>

      {/* Toggle buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowCalendar(false)}
          style={{ marginRight: '10px' }}
        >
          List View
        </button>
        <button onClick={() => setShowCalendar(true)}>Calendar View</button>
      </div>

      {/* List view */}
      {!showCalendar &&
        events.map((event) => (
          <div
            key={event.id}
            style={{
              border: '1px solid gray',
              padding: '10px',
              margin: '10px 0',
            }}
          >
            <strong>{event.title}</strong>
            <p>{event.description}</p>
            <p>📍 {event.location}</p>
            <p>📅 {new Date(event.date).toLocaleString()}</p>
            {event.organizer && <p>Organizer: {event.organizer.email}</p>}
            <p>Participants: {event.participants?.length ?? 0}</p>
          </div>
        ))}

      {/* Calendar view */}
      {showCalendar && (
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectEvent={handleSelectEvent}
        />
      )}
    </div>
  )
}
