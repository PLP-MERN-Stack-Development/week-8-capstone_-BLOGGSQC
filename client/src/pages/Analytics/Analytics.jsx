import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { analyticsAPI } from '../../services/api'
import { TrendingUp, Users, BookOpen, GraduationCap, Calendar, Download } from 'lucide-react'
import Chart from '../../components/UI/Chart'
import StatCard from '../../components/UI/StatCard'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month') // week, month, term, year
  const [metric, setMetric] = useState('attendance') // attendance, grades, performance

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics', { timeRange, metric }],
    queryFn: () => {
      switch (metric) {
        case 'attendance':
          return analyticsAPI.getAttendanceStats({ timeRange })
        case 'grades':
          return analyticsAPI.getGradeStats({ timeRange })
        case 'performance':
          return analyticsAPI.getPerformanceStats({ timeRange })
        default:
          return analyticsAPI.getDashboardStats()
      }
    },
    select: (response) => response.data,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="term">This Term</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setMetric('attendance')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              metric === 'attendance'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Attendance Analytics
          </button>
          <button
            onClick={() => setMetric('grades')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              metric === 'grades'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Grade Analytics
          </button>
          <button
            onClick={() => setMetric('performance')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              metric === 'performance'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Performance Analytics
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metric === 'attendance' && (
              <>
                <StatCard
                  title="Average Attendance"
                  value={`${analyticsData?.averageAttendance || 0}%`}
                  icon={Users}
                  color="green"
                  trend={analyticsData?.attendanceTrend}
                />
                <StatCard
                  title="Present Today"
                  value={analyticsData?.presentToday || 0}
                  icon={GraduationCap}
                  color="blue"
                  trend={analyticsData?.presentTrend}
                />
                <StatCard
                  title="Absent Today"
                  value={analyticsData?.absentToday || 0}
                  icon={Users}
                  color="red"
                  trend={analyticsData?.absentTrend}
                />
                <StatCard
                  title="Late Arrivals"
                  value={analyticsData?.lateToday || 0}
                  icon={Calendar}
                  color="orange"
                  trend={analyticsData?.lateTrend}
                />
              </>
            )}

            {metric === 'grades' && (
              <>
                <StatCard
                  title="Class Average"
                  value={`${analyticsData?.classAverage || 0}%`}
                  icon={TrendingUp}
                  color="blue"
                  trend={analyticsData?.averageTrend}
                />
                <StatCard
                  title="A+ Students"
                  value={analyticsData?.topPerformers || 0}
                  icon={GraduationCap}
                  color="green"
                  trend={analyticsData?.topPerformersTrend}
                />
                <StatCard
                  title="Failing Students"
                  value={analyticsData?.failing || 0}
                  icon={Users}
                  color="red"
                  trend={analyticsData?.failingTrend}
                />
                <StatCard
                  title="Assignments Graded"
                  value={analyticsData?.graded || 0}
                  icon={BookOpen}
                  color="purple"
                  trend={analyticsData?.gradedTrend}
                />
              </>
            )}

            {metric === 'performance' && (
              <>
                <StatCard
                  title="Overall Performance"
                  value={`${analyticsData?.overallPerformance || 0}%`}
                  icon={TrendingUp}
                  color="blue"
                  trend={analyticsData?.performanceTrend}
                />
                <StatCard
                  title="Improvement Rate"
                  value={`${analyticsData?.improvementRate || 0}%`}
                  icon={GraduationCap}
                  color="green"
                  trend={analyticsData?.improvementTrend}
                />
                <StatCard
                  title="At Risk Students"
                  value={analyticsData?.atRisk || 0}
                  icon={Users}
                  color="orange"
                  trend={analyticsData?.atRiskTrend}
                />
                <StatCard
                  title="Star Performers"
                  value={analyticsData?.starPerformers || 0}
                  icon={BookOpen}
                  color="purple"
                  trend={analyticsData?.starTrend}
                />
              </>
            )}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {metric === 'attendance' && 'Attendance Trends'}
                {metric === 'grades' && 'Grade Distribution'}
                {metric === 'performance' && 'Performance Overview'}
              </h3>
              <Chart
                data={analyticsData?.chartData || []}
                type="line"
                height={300}
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {metric === 'attendance' && 'Daily Attendance Breakdown'}
                {metric === 'grades' && 'Subject-wise Performance'}
                {metric === 'performance' && 'Class Comparison'}
              </h3>
              <Chart
                data={analyticsData?.secondaryChart || []}
                type="bar"
                height={300}
              />
            </div>
          </div>

          {/* Detailed Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {metric === 'attendance' && 'Perfect Attendance'}
                {metric === 'grades' && 'Top Performers'}
                {metric === 'performance' && 'Most Improved'}
              </h3>
              <div className="space-y-3">
                {analyticsData?.topList?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.class}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{item.value}</div>
                      <div className="text-xs text-gray-500">{item.metric}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Need Attention */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {metric === 'attendance' && 'Low Attendance'}
                {metric === 'grades' && 'Need Attention'}
                {metric === 'performance' && 'At Risk Students'}
              </h3>
              <div className="space-y-3">
                {analyticsData?.attentionList?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-medium text-red-600">
                        !
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.class}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-red-600">{item.value}</div>
                      <div className="text-xs text-gray-500">{item.metric}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights and Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights & Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Insights</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {analyticsData?.insights?.map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {analyticsData?.recommendations?.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">→</span>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Analytics