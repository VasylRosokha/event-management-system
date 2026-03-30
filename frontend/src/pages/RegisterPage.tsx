import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

type FormData = {
  email: string
  password: string
}

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

export default function RegisterPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({ resolver: yupResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/auth/register', data)
      navigate('/login')
    } catch (error) {
      console.error('Registration failed', error)
      setError('root', { message: 'Registration failed. Email may already be in use.' })
    }
  }

  return (
    <div>
      <h1>Register</h1>

      {errors.root && <p style={{ color: 'red' }}>{errors.root.message}</p>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <input type="email" placeholder="Email" {...register('email')} />
          {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
        </div>

        <div>
          <input type="password" placeholder="Password" {...register('password')} />
          {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  )
}
