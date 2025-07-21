import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Filter,
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'exam' | 'meeting' | 'holiday' | 'assignment' | 'other';
  location?: string;
  attendees?: string[];
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [filterType, setFilterType] = useState('');

  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Mathematics Midterm Exam',
      description: 'Class 10-A Mathematics midterm examination',
      date: '2024-02-15',
      startTime: '09:00',
      endTime: '11:00',
      type: 'exam',
      location: 'Room 101',
      attendees: ['Class 10-A'],
    },
    {
      id: '2',
      title: 'Parent-Teacher Conference',
      description: 'Individual meetings with parents',
      date: '2024-02-16',
      startTime: '14:00',
      endTime: '18:00',
      type: 'meeting',
      location: 'Main Hall',
      attendees: ['All Teachers', 'Parents'],
    },
    {
      id: '3',
      title: 'Science Fair',
      description: 'Annual school science fair exhibition',
      date: '2024-02-20',
      startTime: '10:00',
      endTime: '16:00',
      type: 'other',
      location: 'School Auditorium',
      attendees: ['All Students'],
    },
    {
      id: '4',
      title: 'English Assignment Due',
      description: 'Shakespeare essay submissions',
      date: '2024-02-18',
      startTime: '23:59',
      endTime: '23:59',
      type: 'assignment',
    },
  ]);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'exam':
        return 'bg-red-500/20 text-red-400 border-red-400/30';
      case 'meeting':
        return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'holiday':
        return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'assignment':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      default:
        return 'bg-purple-500/20 text-purple-400 border-purple-400/30';
    }
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1), 1));
  };

  const getEventsForDate = (date: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return events.filter(event => event.date === dateString && (filterType === '' || event.type === filterType));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white">Calendar</h1>
            <p className="text-gray-400 mt-1">Manage events, exams, and important dates</p>
          </div>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 rounded-xl text-white font-semibold shadow-lg shadow-primary-500/25 flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Add Event</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Calendar Controls */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Date Navigation */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateMonth('prev')}
              className="glass-button p-2"
            >
              <ChevronLeft size={18} />
            </motion.button>
            
            <h2 className="text-2xl font-bold text-white min-w-0">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateMonth('next')}
              className="glass-button p-2"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>

          {/* View Mode and Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex bg-white/10 rounded-xl p-1">
              {(['month', 'week', 'day'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    viewMode === mode
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Events</option>
              <option value="exam">Exams</option>
              <option value="meeting">Meetings</option>
              <option value="assignment">Assignments</option>
              <option value="holiday">Holidays</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Calendar Grid */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-gray-400 font-semibold text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }, (_, index) => (
            <div key={`empty-${index}`} className="p-2 h-24"></div>
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const date = index + 1;
            const dayEvents = getEventsForDate(date);
            const isToday = new Date().getDate() === date && 
                           new Date().getMonth() === currentDate.getMonth() && 
                           new Date().getFullYear() === currentDate.getFullYear();

            return (
              <motion.div
                key={date}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), date))}
                className={`p-2 h-24 border border-white/10 rounded-lg cursor-pointer transition-all ${
                  isToday ? 'bg-primary-500/20 border-primary-500/50' : 'hover:bg-white/5'
                }`}
              >
                <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-primary-400' : 'text-white'}`}>
                  {date}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded border-l-2 ${getEventTypeColor(event.type)}`}
                      title={event.title}
                    >
                      <div className="truncate">{event.title}</div>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-400">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Event Details Sidebar */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {getEventsForDate(selectedDate.getDate()).map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border-l-4 ${getEventTypeColor(event.type)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{event.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs capitalize ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                </div>
                
                {event.description && (
                  <p className="text-gray-300 text-sm mb-3">{event.description}</p>
                )}
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-300">
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="text-gray-300">{event.location}</span>
                    </div>
                  )}
                  
                  {event.attendees && (
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-gray-400" />
                      <span className="text-gray-300">{event.attendees.join(', ')}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {getEventsForDate(selectedDate.getDate()).length === 0 && (
              <div className="text-center py-8">
                <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No events scheduled for this date</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Calendar;