import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

type FormData = {
  email: string
  password: string
}

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
})

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({ resolver: yupResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      const response = await api.post('/auth/login', data)
      login(response.data.access_token)
      navigate('/')
    } catch (error) {
      console.error('Login failed', error)
      setError('root', { message: 'Invalid credentials' })
    }
  }

  return (
    <div>
      <h1>Login</h1>

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

        <button type="submit">Login</button>
      </form>
    </div>
  )
}
