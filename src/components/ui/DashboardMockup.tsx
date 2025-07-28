import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Clock, DollarSign, Users } from 'lucide-react';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
  trendColor: string;
}

function MetricCard({ icon, title, value, trend, trendColor }: MetricCardProps) {
  return (
    <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          {icon}
        </div>
        <span className={`text-sm font-semibold ${trendColor}`}>
          {trend}
        </span>
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </Card>
  );
}

interface ProgressBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

function ProgressBar({ label, value, maxValue, color }: ProgressBarProps) {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{value}h saved</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

interface DashboardMockupProps {
  className?: string;
}

export default function DashboardMockup({ className = '' }: DashboardMockupProps): JSX.Element {
  const metrics = [
    {
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      title: "Time Saved This Month",
      value: "187h",
      trend: "+23%",
      trendColor: "text-green-600"
    },
    {
      icon: <DollarSign className="w-5 h-5 text-green-600" />,
      title: "Cost Savings",
      value: "$28,400",
      trend: "+18%",
      trendColor: "text-green-600"
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      title: "Efficiency Gain",
      value: "85%",
      trend: "+12%",
      trendColor: "text-green-600"
    },
    {
      icon: <Users className="w-5 h-5 text-orange-600" />,
      title: "Processes Automated",
      value: "24",
      trend: "+4",
      trendColor: "text-blue-600"
    }
  ];

  const timeData = [
    { label: "Email Management", value: 45, maxValue: 60, color: "bg-gradient-to-r from-blue-500 to-blue-600" },
    { label: "Document Processing", value: 38, maxValue: 50, color: "bg-gradient-to-r from-green-500 to-green-600" },
    { label: "Client Communications", value: 52, maxValue: 70, color: "bg-gradient-to-r from-purple-500 to-purple-600" },
    { label: "Data Entry Tasks", value: 28, maxValue: 35, color: "bg-gradient-to-r from-orange-500 to-orange-600" }
  ];

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Automation Dashboard</h3>
        <p className="text-gray-200 text-sm">Real-time workflow efficiency metrics</p>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
      
      {/* Progress Bars Section */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 space-y-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Time Savings by Category</h4>
        {timeData.map((item, index) => (
          <ProgressBar key={index} {...item} />
        ))}
      </div>
      
      {/* Interactive Element */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 text-white/80 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live data updating every 5 minutes</span>
        </div>
      </div>
    </div>
  );
}