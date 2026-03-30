import { Link } from 'react-router-dom'

type Participant = {
  id: string
}

export type EventCardProps = {
  id: string
  title: string
  description: string
  date: string
  location: string
  capacity?: number
  participants?: Participant[]
  userId: string | null
  onJoin: (id: string) => void
  onLeave: (id: string) => void
}

export default function EventCard({
  id,
  title,
  description,
  date,
  location,
  capacity,
  participants = [],
  userId,
  onJoin,
  onLeave,
}: EventCardProps) {
  const isJoined = !!userId && participants.some((p) => p.id === userId)
  const isFull = !!capacity && participants.length >= capacity

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <Link to={`/events/${id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600">
          {title}
        </Link>
        {isFull && (
          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
            Full
          </span>
        )}
      </div>

      {description && (
        <p className="mb-3 line-clamp-2 text-sm text-gray-600">{description}</p>
      )}

      <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(date).toLocaleString()}
        </span>
        {capacity && (
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {participants.length}/{capacity}
          </span>
        )}
      </div>

      {userId && (
        <div>
          {!isJoined && !isFull && (
            <button
              onClick={() => onJoin(id)}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Join
            </button>
          )}
          {isJoined && (
            <button
              onClick={() => onLeave(id)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Leave
            </button>
          )}
        </div>
      )}
    </div>
  )
}