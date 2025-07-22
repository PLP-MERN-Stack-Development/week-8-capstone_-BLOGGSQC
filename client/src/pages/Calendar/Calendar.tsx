import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  MapPin,
  Users,
  Bell,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List
} from 'lucide-react'
import { calendarAPI } from '../../services/api'

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'list'>('month')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch calendar events
  const { data: eventsData, isLoading, refetch } = useQuery(
    ['calendar-events', currentDate.getMonth(), currentDate.getFullYear()],
    () => calendarAPI.getEvents({
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear()
    }),
    {
      keepPreviousData: true
    }
  )

  const events = eventsData?.data?.events || []

  // Mock data for demonstration
  const mockEvents = [
    {
      _id: '1',
      title: 'Parent-Teacher Conference',
      description: 'Individual meetings with parents to discuss student progress',
      type: 'meeting',
      startDate: '2024-12-22',
      endDate: '2024-12-23',
      startTime: '09:00',
      endTime: '17:00',
      location: 'School Auditorium',
      organizer: { user: { name: 'Dr. Sarah Johnson' } },
      attendees: ['parents', 'teachers'],
      isAllDay: false,
      priority: 'high',
      color: '#f59e0b',
      reminders: [
        { type: 'email', time: '1 day before' },
        { type: 'notification', time: '2 hours before' }
      ]
    },
    {
      _id: '2',
      title: 'Winter Break',
      description: 'School holiday - Winter vacation for all students and staff',
      type: 'holiday',
      startDate: '2024-12-25',
      endDate: '2025-01-08',
      startTime: null,
      endTime: null,
      location: null,
      organizer: { user: { name: 'System Administrator' } },
      attendees: ['students', 'teachers', 'staff'],
      isAllDay: true,
      priority: 'medium',
      color: '#10b981',
      reminders: []
    },
    {
      _id: '3',
      title: 'Science Fair',
      description: 'Annual science fair showcasing student projects and innovations',
      type: 'event',
      startDate: '2024-12-20',
      endDate: '2024-12-20',
      startTime: '10:00',
      endTime: '16:00',
      location: 'Science Laboratory',
      organizer: { user: { name: 'Prof. Michael Chen' } },
      attendees: ['students', 'parents', 'teachers'],
      isAllDay: false,
      priority: 'high',
      color: '#8b5cf6',
      reminders: [
        { type: 'email', time: '3 days before' },
        { type: 'notification', time: '1 day before' }
      ]
    },
    {
      _id: '4',
      title: 'Mathematics Quiz',
      description: 'Chapter 5 quiz on Quadratic Equations for Grade 10 students',
      type: 'exam',
      startDate: '2024-12-18',
      endDate: '2024-12-18',
      startTime: '10:00',
      endTime: '11:30',
      location: 'Room 101',
      organizer: { user: { name: 'Dr. Sarah Johnson' } },
      attendees: ['students'],
      isAllDay: false,
      priority: 'medium',
      color: '#ef4444',
      reminders: [
        { type: 'notification', time: '1 day before' }
      ]
    },
    {
      _id: '5',
      title: 'Staff Meeting',
      description: 'Monthly staff meeting to discuss curriculum updates and administrative matters',
      type: 'meeting',
      startDate: '2024-12-19',
      endDate: '2024-12-19',
      startTime: '15:00',
      endTime: '16:30',
      location: 'Conference Room',
      organizer: { user: { name: 'Principal Office' } },
      attendees: ['teachers', 'staff'],
      isAllDay: false,
      priority: 'medium',
      color: '#06b6d4',
      reminders: [
        { type: 'email', time: '1 day before' }
      ]
    }
  ]

  const displayEvents = events.length > 0 ? events : mockEvents

  const handleAddEvent = () => {
    setShowAddModal(true)
  }

  const handleEditEvent = (eventId: string) => {
    console.log('Edit event:', eventId)
  }

  const handleDeleteEvent = (eventId: string) => {
    console.log('Delete event:', eventId)
  }

  const handleViewEvent = (eventId: string) => {
    console.log('View event:', eventId)
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500/20 text-blue-400'
      case 'holiday': return 'bg-green-500/20 text-green-400'
      case 'event': return 'bg-purple-500/20 text-purple-400'
      case 'exam': return 'bg-red-500/20 text-red-400'
      case 'assignment': return 'bg-orange-500/20 text-orange-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-500'
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const isToday = (date: string) => {
    const today = new Date().toISOString().split('T')[0]
    return date === today
  }

  const isUpcoming = (date: string) => {
    const eventDate = new Date(date)
    const today = new Date()
    return eventDate > today
  }

  // Filter events for list view
  const filteredEvents = displayEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">School Calendar</h1>
          <p className="text-gray-400">Manage events, meetings, and important dates</p>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-800 rounded-xl p-1">
            {[
              { mode: 'month', icon: Grid3X3 },
              { mode: 'list', icon: List }
            ].map(({ mode, icon: Icon }) => (
              <motion.button
                key={mode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-2 rounded-lg font-medium flex items-center space-x-1 transition-colors ${
                  viewMode === mode 
                    ? 'bg-primary-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="capitalize">{mode}</span>
              </motion.button>
            ))}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddEvent}
            className="bg-gradient-gold text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 neon-glow-gold"
          >
            <Plus className="h-5 w-5" />
            <span>Add Event</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Calendar Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-strong rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateMonth('prev')}
              className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </motion.button>
            
            <h2 className="text-2xl font-bold text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateMonth('next')}
              className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentDate(new Date())}
            className="glass text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors"
          >
            Today
          </motion.button>
        </div>

        {/* Search for List View */}
        {viewMode === 'list' && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-gray-600/30"
            />
          </div>
        )}
      </motion.div>

      {/* Calendar Content */}
      {viewMode === 'month' ? (
        /* Month View - Simplified Calendar Grid */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-2xl p-6"
        >
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-gray-400 font-medium py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => {
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - 6)
              const dayEvents = displayEvents.filter(event => 
                event.startDate === date.toISOString().split('T')[0]
              )
              
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className={`min-h-[80px] p-2 rounded-lg border transition-colors cursor-pointer ${
                    date.getMonth() === currentDate.getMonth()
                      ? 'glass border-gray-600/30 hover:border-primary-500/50'
                      : 'bg-gray-800/30 border-gray-700/30'
                  } ${
                    isToday(date.toISOString().split('T')[0])
                      ? 'ring-2 ring-primary-500'
                      : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    date.getMonth() === currentDate.getMonth() ? 'text-white' : 'text-gray-500'
                  }`}>
                    {date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event._id}
                        className="text-xs p-1 rounded text-white truncate"
                        style={{ backgroundColor: event.color + '40' }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-400">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      ) : (
        /* List View */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className={`glass-strong rounded-2xl p-6 hover:neon-glow transition-all duration-300 border-l-4 ${getPriorityColor(event.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Event Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: event.color }}
                    ></div>
                    <h3 className="text-xl font-bold text-white">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                    {isToday(event.startDate) && (
                      <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Event Details */}
                  <p className="text-gray-300 mb-4">{event.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Date & Time */}
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-white">
                          {new Date(event.startDate).toLocaleDateString()}
                          {event.endDate !== event.startDate && (
                            <span> - {new Date(event.endDate).toLocaleDateString()}</span>
                          )}
                        </div>
                        {!event.isAllDay && (
                          <div className="text-xs text-gray-400">
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    {event.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-white">{event.location}</span>
                      </div>
                    )}

                    {/* Organizer */}
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-white">{event.organizer.user.name}</span>
                    </div>
                  </div>

                  {/* Attendees */}
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Attendees:</span>
                    <div className="flex flex-wrap gap-1">
                      {event.attendees.map((attendee, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full capitalize">
                          {attendee}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Reminders */}
                  {event.reminders && event.reminders.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Reminders:</span>
                      <div className="flex flex-wrap gap-1">
                        {event.reminders.map((reminder, idx) => (
                          <span key={idx} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                            {reminder.type} - {reminder.time}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 ml-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewEvent(event._id)}
                    className="glass text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEditEvent(event._id)}
                    className="bg-primary-500/20 text-primary-400 p-2 rounded-lg hover:bg-primary-500/30 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteEvent(event._id)}
                    className="bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <motion.div 
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredEvents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <CalendarIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No events found</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first event</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddEvent}
            className="bg-gradient-gold text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto neon-glow-gold"
          >
            <Plus className="h-5 w-5" />
            <span>Add First Event</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default Calendar