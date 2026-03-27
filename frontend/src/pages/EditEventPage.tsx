import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function EditEventPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
  })

  // ✅ fetch existing event
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`)

        setForm({
          title: res.data.title || '',
          description: res.data.description || '',
          date: res.data.date
            ? new Date(res.data.date).toISOString().slice(0, 16)
            : '',
          location: res.data.location || '',
          capacity: res.data.capacity || '',
        })
      } catch (err) {
        console.error('Failed to load event', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await api.patch(`/events/${id}`, {
        ...form,
        capacity: form.capacity ? Number(form.capacity) : null,
      })

      alert('Event updated successfully')
      navigate(`/events/${id}`)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Update failed')
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Edit Event</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="number"
            name="capacity"
            placeholder="Capacity (optional)"
            value={form.capacity}
            onChange={handleChange}
          />
        </div>

        <button type="submit" style={{ marginTop: '10px' }}>
          Save Changes
        </button>
      </form>
    </div>
  )
}
