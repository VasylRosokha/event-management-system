import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
  const [showCalendar, setShowCalendar] = useState(false)

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
          end.setHours(end.getHours() + 1)
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

  if (loading) return <p className="text-gray-500">Loading your events...</p>
  if (events.length === 0)
    return (
      <p className="text-gray-500">
        You are not part of any events yet.{' '}
        <Link to="/" className="text-blue-600 hover:underline">Explore public events</Link> and join.
      </p>
    )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Events</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCalendar(false)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              !showCalendar
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setShowCalendar(true)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              showCalendar
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      {!showCalendar && (
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <h3 className="mb-2 font-semibold text-gray-900">{event.title}</h3>
              {event.description && (
                <p className="mb-3 line-clamp-2 text-sm text-gray-600">{event.description}</p>
              )}
              <div className="space-y-1 text-sm text-gray-500">
                <p>📍 {event.location}</p>
                <p>📅 {new Date(event.date).toLocaleString()}</p>
                {event.organizer && <p>Organizer: {event.organizer.email}</p>}
                <p>Participants: {event.participants?.length ?? 0}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showCalendar && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
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
        </div>
      )}
    </div>
  )
}