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
    <div
      style={{
        border: '1px solid gray',
        padding: '10px',
        margin: '10px 0',
      }}
    >
      <Link to={`/events/${id}`}>
        <h3>{title}</h3>
      </Link>

      <p>{description}</p>
      <p>📍 {location}</p>
      <p>📅 {new Date(date).toLocaleString()}</p>
      {isFull && <span style={{ color: 'red', fontWeight: 'bold' }}>Full</span>}

      {userId && (
        <div style={{ marginTop: '10px' }}>
          {!isJoined && !isFull && (
            <button onClick={() => onJoin(id)}>Join</button>
          )}
          {isJoined && (
            <button onClick={() => onLeave(id)}>Leave</button>
          )}
        </div>
      )}
    </div>
  )
}