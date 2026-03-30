import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import EventsPage from './pages/EventsPage'
import EventDetailsPage from './pages/EventDetailsPage'
import MyEventsPage from './pages/MyEventsPage'
import CreateEventPage from './pages/CreateEventPage'
import EditEventPage from './pages/EditEventPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <main className="mx-auto max-w-5xl px-4 py-6">
          <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/my-events" element={<MyEventsPage />} />
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/events/:id/edit" element={<EditEventPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
