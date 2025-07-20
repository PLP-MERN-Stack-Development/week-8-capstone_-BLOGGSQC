import { Calendar, MapPin, Clock } from 'lucide-react'
import { format } from 'date-fns'

const UpcomingEvents = () => {
  // Mock data - in real app, this would come from API
  const events = [
    {
      id: 1,
      title: 'Parent-Teacher Meeting',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      time: '10:00 AM',
      location: 'Main Hall',
      type: 'meeting',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      id: 2,
      title: 'Science Fair',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      time: '9:00 AM',
      location: 'Science Lab',
      type: 'event',
      color: 'bg-green-100 text-green-800',
    },
    {
      id: 3,
      title: 'Final Exams Begin',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      time: '9:00 AM',
      location: 'All Classrooms',
      type: 'exam',
      color: 'bg-red-100 text-red-800',
    },
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(event.date, 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${event.color}`}>
                {event.type}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
        View all events
      </button>
    </div>
  )
}

export default UpcomingEvents
