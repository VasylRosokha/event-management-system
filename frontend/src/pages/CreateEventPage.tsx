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

  const inputClass =
    'w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Create Event</h1>

        {errors.root && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
            <input placeholder="Event title" {...register('title')} className={inputClass} />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              placeholder="Event description (optional)"
              {...register('description')}
              rows={3}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Date & Time</label>
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
                  className={inputClass}
                />
              )}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
            <input placeholder="Event location" {...register('location')} className={inputClass} />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Capacity</label>
            <input
              type="number"
              placeholder="Optional"
              {...register('capacity')}
              className={inputClass}
            />
            {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Visibility</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="radio" value="public" {...register('visibility')} />
                Public
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="radio" value="private" {...register('visibility')} />
                Private
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  )
}
