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
    <Card className="p-4 bg-card/95 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 rounded-lg bg-gradient-accent">
          {icon}
        </div>
        <span className={`text-sm font-semibold ${trendColor}`}>
          {trend}
        </span>
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <p className="text-2xl font-bold text-card-foreground">{value}</p>
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
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">{value}h saved</span>
      </div>
      <div className="w-full bg-muted rounded-full h-3">
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
      icon: <Clock className="w-5 h-5 text-shadcn-primary" />,
      title: "Time Saved This Month",
      value: "187h",
      trend: "+23%",
      trendColor: "text-success"
    },
    {
      icon: <DollarSign className="w-5 h-5 text-success" />,
      title: "Cost Savings",
      value: "$28,400",
      trend: "+18%",
      trendColor: "text-success"
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-shadcn-primary" />,
      title: "Efficiency Gain",
      value: "85%",
      trend: "+12%",
      trendColor: "text-success"
    },
    {
      icon: <Users className="w-5 h-5 text-shadcn-accent" />,
      title: "Processes Automated",
      value: "24",
      trend: "+4",
      trendColor: "text-shadcn-primary"
    }
  ];

  const timeData = [
    { label: "Email Management", value: 45, maxValue: 60, color: "bg-gradient-primary" },
    { label: "Document Processing", value: 38, maxValue: 50, color: "bg-gradient-accent" },
    { label: "Client Communications", value: 52, maxValue: 70, color: "bg-gradient-primary" },
    { label: "Data Entry Tasks", value: 28, maxValue: 35, color: "bg-gradient-accent" }
  ];

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 bg-card/10 backdrop-blur-md rounded-2xl border border-border/20 shadow-2xl ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">Automation Dashboard</h3>
        <p className="text-foreground/80 text-sm">Real-time workflow efficiency metrics</p>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
      
      {/* Progress Bars Section */}
      <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 space-y-6">
        <h4 className="text-lg font-semibold text-card-foreground mb-4">Time Savings by Category</h4>
        {timeData.map((item, index) => (
          <ProgressBar key={index} {...item} />
        ))}
      </div>
      
      {/* Interactive Element */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 text-white/80 text-sm">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-foreground/80">Live data updating every 5 minutes</span>
        </div>
      </div>
    </div>
  );
}