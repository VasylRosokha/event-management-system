import { BrowserRouter, Routes, Route } from 'react-router-dom'

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
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/my-events" element={<MyEventsPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/events/:id/edit" element={<EditEventPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
