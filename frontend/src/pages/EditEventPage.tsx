import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import api from '../api/axios'

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  date: yup.string().required('Date is required'),
  location: yup.string().required('Location is required'),
  capacity: yup
    .number()
    .transform((v, orig) => (orig === '' ? null : v))
    .nullable()
    .min(1, 'Capacity must be at least 1'),
})

type EventFormData = {
  title: string
  description?: string
  date: string
  location: string
  capacity?: number | null
}

export default function EditEventPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setError,
  } = useForm<EventFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
  })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`)
        reset({
          title: res.data.title || '',
          description: res.data.description || '',
          date: res.data.date ? new Date(res.data.date).toISOString().slice(0, 16) : '',
          location: res.data.location || '',
          capacity: res.data.capacity || null,
        })
      } catch (err) {
        console.error('Failed to load event', err)
      }
    }

    fetchEvent()
  }, [id, reset])

  const onSubmit = async (data: EventFormData) => {
    try {
      await api.patch(`/events/${id}`, {
        ...data,
        capacity: data.capacity ?? null,
      })
      navigate(`/events/${id}`)
    } catch (err: any) {
      setError('root', {
        message: err.response?.data?.message || 'Update failed',
      })
    }
  }

  return (
    <div>
      <h1>Edit Event</h1>

      {errors.root && <p style={{ color: 'red' }}>{errors.root.message}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input placeholder="Title" {...register('title')} />
          {errors.title && <p style={{ color: 'red' }}>{errors.title.message}</p>}
        </div>

        <div>
          <textarea placeholder="Description" {...register('description')} />
        </div>

        <div>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value ? new Date(field.value) : null}
                onChange={(date: Date | null) => field.onChange(date ? date.toISOString() : '')}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select date and time"
              />
            )}
          />
          {errors.date && <p style={{ color: 'red' }}>{errors.date.message}</p>}
        </div>

        <div>
          <input placeholder="Location" {...register('location')} />
          {errors.location && <p style={{ color: 'red' }}>{errors.location.message}</p>}
        </div>

        <div>
          <input
            type="number"
            placeholder="Capacity (optional)"
            {...register('capacity')}
          />
          {errors.capacity && <p style={{ color: 'red' }}>{errors.capacity.message}</p>}
        </div>

        <button type="submit" style={{ marginTop: '10px' }}>
          Save Changes
        </button>
      </form>
    </div>
  )
}