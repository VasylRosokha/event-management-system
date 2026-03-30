import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import api from '../api/axios'

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  date: yup
    .string()
    .required('Date is required')
    .test('future', 'Event date must be in the future', (value) => {
      if (!value) return false
      return new Date(value) > new Date()
    }),
  location: yup.string().required('Location is required'),
  capacity: yup
    .number()
    .transform((v, orig) => (orig === '' ? null : v))
    .nullable()
    .min(1, 'Capacity must be at least 1'),
  visibility: yup
    .mixed<'public' | 'private'>()
    .oneOf(['public', 'private'])
    .required(),
})

type EventFormData = {
  title: string
  description?: string
  date: string
  location: string
  capacity?: number | null
  visibility: 'public' | 'private'
}

export default function CreateEventPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<EventFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: { visibility: 'public' },
  })

  const onSubmit = async (data: EventFormData) => {
    try {
      const response = await api.post('/events', {
        ...data,
        capacity: data.capacity ?? null,
      })
      navigate(`/events/${response.data.id}`)
    } catch (error: any) {
      console.error('Create failed', error)
      setError('root', {
        message: error.response?.data?.message || 'Failed to create event',
      })
    }
  }

  return (
    <div>
      <h1>Create Event</h1>

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
                minDate={new Date()}
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

        <div>
          <label>
            <input type="radio" value="public" {...register('visibility')} />
            Public
          </label>
          <label>
            <input type="radio" value="private" {...register('visibility')} />
            Private
          </label>
        </div>

        <button type="submit">Create Event</button>
      </form>
    </div>
  )
}