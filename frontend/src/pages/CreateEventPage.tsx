import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function CreateEventPage() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [capacity, setCapacity] = useState<number | ''>('')
  const [visibility, setVisibility] = useState('public')

  const handleSubmit = async () => {
    if (!title || !date || !location) {
      alert('Title, date, and location are required')
      return
    }

    const selectedDate = new Date(date)
    if (selectedDate < new Date()) {
      alert('Cannot create event in the past')
      return
    }

    try {
      const response = await api.post('/events', {
        title,
        description,
        date,
        location,
        capacity: capacity === '' ? null : Number(capacity),
        visibility,
      })

      // redirect to event details
      navigate(`/events/${response.data.id}`)
    } catch (error: any) {
      console.error('Create failed', error)
      alert(error.response?.data?.message || 'Failed to create event')
    }
  }

  return (
    <div>
      <h1>Create Event</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        type="number"
        placeholder="Capacity (optional)"
        value={capacity}
        onChange={(e) =>
          setCapacity(e.target.value === '' ? '' : Number(e.target.value))
        }
      />

      <div>
        <label>
          <input
            type="radio"
            value="public"
            checked={visibility === 'public'}
            onChange={() => setVisibility('public')}
          />
          Public
        </label>

        <label>
          <input
            type="radio"
            value="private"
            checked={visibility === 'private'}
            onChange={() => setVisibility('private')}
          />
          Private
        </label>
      </div>

      <button onClick={handleSubmit}>Create Event</button>
    </div>
  )
}
