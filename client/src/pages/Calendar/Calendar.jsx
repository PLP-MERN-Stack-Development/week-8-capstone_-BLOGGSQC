import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { calendarAPI } from '../../services/api'
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('month') // month, week, day
  const [showModal, setShowModal] = useState(false)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const { data: events, isLoading } = useQuery({
    queryKey: ['calendar-events', currentDate],
    queryFn: () => calendarAPI.getEvents({
      start: calendarStart,
      end: calendarEnd
    }),
    select: (response) => response.data,
  })

  const getEventsForDay = (day) => {
    return events?.filter(event => 
      isSameDay(new Date(event.date), day)
    ) || []
  }

  const getEventColor = (type) => {
    switch (type) {
      case 'exam':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'meeting':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'holiday':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'event':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      setCurrentDate(subMonths(currentDate, 1))
    } else {
      setCurrentDate(addMonths(currentDate, 1))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Manage school events and important dates</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                view === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                view === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                view === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Day
            </button>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-4 text-center text-sm font-medium text-gray-600 bg-gray-50">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDay(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b border-gray-200 ${
                  !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                } hover:bg-gray-50 transition-colors`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday 
                    ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' 
                    : !isCurrentMonth 
                    ? 'text-gray-400' 
                    : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`text-xs p-1 rounded border ${getEventColor(event.type)} cursor-pointer hover:shadow-sm`}
                      title={event.title}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="opacity-75">{format(new Date(event.date), 'HH:mm')}</div>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Events */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Events</h3>
          <div className="space-y-3">
            {getEventsForDay(new Date()).length > 0 ? (
              getEventsForDay(new Date()).map((event, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    event.type === 'exam' ? 'bg-red-100' :
                    event.type === 'meeting' ? 'bg-blue-100' :
                    event.type === 'holiday' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    <CalendarIcon className={`h-4 w-4 ${
                      event.type === 'exam' ? 'text-red-600' :
                      event.type === 'meeting' ? 'text-blue-600' :
                      event.type === 'holiday' ? 'text-green-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(event.date), 'HH:mm')}
                      {event.location && (
                        <>
                          <span className="mx-2">•</span>
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No events today</p>
            )}
          </div>
        </div>

        {/* Event Types Legend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Types</h3>
          <div className="space-y-3">
            {[
              { type: 'exam', label: 'Exams', color: 'bg-red-100 text-red-800', icon: '📝' },
              { type: 'meeting', label: 'Meetings', color: 'bg-blue-100 text-blue-800', icon: '👥' },
              { type: 'holiday', label: 'Holidays', color: 'bg-green-100 text-green-800', icon: '🎉' },
              { type: 'event', label: 'Events', color: 'bg-purple-100 text-purple-800', icon: '🎪' },
            ].map((eventType) => (
              <div key={eventType.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{eventType.icon}</span>
                  <span className="font-medium text-gray-900">{eventType.label}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${eventType.color}`}>
                  {events?.filter(e => e.type === eventType.type).length || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar