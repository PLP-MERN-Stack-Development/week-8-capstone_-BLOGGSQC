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
    <div className="glass-card animate-slide-up">
      <h3 className="text-xl font-semibold text-white mb-6 gradient-text">Upcoming Events</h3>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="glass rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-white">{event.title}</h4>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(event.date, 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${event.color} border border-white/20`}>
                {event.type}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-6 text-sm text-neon-blue hover:text-neon-blue/80 font-medium transition-colors duration-200">
        View all events
      </button>
    </div>
  )
}

export default UpcomingEvents