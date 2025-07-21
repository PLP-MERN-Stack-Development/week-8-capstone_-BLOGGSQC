import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Send,
  Eye,
  CreditCard,
} from 'lucide-react';

interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  feeType: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod?: string;
  transactionId?: string;
}

const Fees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterClass, setFilterClass] = useState('');
  
  const [feeRecords] = useState<FeeRecord[]>([
    {
      id: '1',
      studentId: 'STU001',
      studentName: 'Alex Johnson',
      class: '10-A',
      feeType: 'Tuition Fee',
      amount: 1500,
      dueDate: '2024-02-15',
      paidDate: '2024-02-12',
      status: 'paid',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN001234',
    },
    {
      id: '2',
      studentId: 'STU002',
      studentName: 'Emma Davis',
      class: '9-B',
      feeType: 'Activity Fee',
      amount: 250,
      dueDate: '2024-02-20',
      status: 'pending',
    },
    {
      id: '3',
      studentId: 'STU003',
      studentName: 'Michael Brown',
      class: '11-A',
      feeType: 'Library Fee',
      amount: 100,
      dueDate: '2024-01-30',
      status: 'overdue',
    },
    {
      id: '4',
      studentId: 'STU004',
      studentName: 'Sophia Wilson',
      class: '10-B',
      feeType: 'Lab Fee',
      amount: 300,
      dueDate: '2024-02-25',
      status: 'pending',
    },
  ]);

  const filteredRecords = feeRecords.filter((record) => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.feeType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || record.status === filterStatus;
    const matchesClass = filterClass === '' || record.class === filterClass;
    
    return matchesSearch && matchesStatus && matchesClass;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'overdue':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} />;
      case 'pending':
        return <AlertCircle size={16} />;
      case 'overdue':
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  // Calculate statistics
  const totalAmount = filteredRecords.reduce((sum, record) => sum + record.amount, 0);
  const paidAmount = filteredRecords
    .filter(record => record.status === 'paid')
    .reduce((sum, record) => sum + record.amount, 0);
  const pendingAmount = filteredRecords
    .filter(record => record.status === 'pending')
    .reduce((sum, record) => sum + record.amount, 0);
  const overdueAmount = filteredRecords
    .filter(record => record.status === 'overdue')
    .reduce((sum, record) => sum + record.amount, 0);

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
            <h1 className="text-3xl font-bold text-white">Fee Management</h1>
            <p className="text-gray-400 mt-1">Track and manage student fee payments</p>
          </div>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-button flex items-center space-x-2"
            >
              <Send size={18} />
              <span>Send Reminders</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-button flex items-center space-x-2"
            >
              <Download size={18} />
              <span>Export</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass-card p-6 card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">${totalAmount.toLocaleString()}</h3>
          <p className="text-gray-400">Total Amount</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass-card p-6 card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">${paidAmount.toLocaleString()}</h3>
          <p className="text-gray-400">Paid Amount</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass-card p-6 card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">${pendingAmount.toLocaleString()}</h3>
          <p className="text-gray-400">Pending Amount</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass-card p-6 card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">${overdueAmount.toLocaleString()}</h3>
          <p className="text-gray-400">Overdue Amount</p>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search students or fee types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="lg:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="lg:w-48">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Classes</option>
              <option value="9-A">Class 9-A</option>
              <option value="9-B">Class 9-B</option>
              <option value="10-A">Class 10-A</option>
              <option value="10-B">Class 10-B</option>
              <option value="11-A">Class 11-A</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-button flex items-center space-x-2"
          >
            <Filter size={18} />
            <span>More Filters</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Fee Records Table */}
      <motion.div variants={itemVariants} className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Fee Records</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Student</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Fee Type</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Due Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white font-medium">{record.studentName}</p>
                      <p className="text-gray-400 text-sm">{record.studentId} • {record.class}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white">{record.feeType}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-semibold">${record.amount}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-300">{new Date(record.dueDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 w-fit ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      <span className="capitalize">{record.status}</span>
                    </span>
                    {record.paidDate && (
                      <p className="text-xs text-gray-400 mt-1">
                        Paid: {new Date(record.paidDate).toLocaleDateString()}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="glass-button p-2"
                        title="View details"
                      >
                        <Eye size={16} />
                      </motion.button>
                      {record.status !== 'paid' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-lg text-white shadow-lg shadow-primary-500/25"
                          title="Record payment"
                        >
                          <CreditCard size={16} />
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No fee records found</h3>
            <p className="text-gray-400">
              {searchTerm || filterStatus || filterClass
                ? 'Try adjusting your search or filters'
                : 'Fee records will appear here once they are created'
              }
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Fees;