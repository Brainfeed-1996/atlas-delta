import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Metrics, Alert, Dataset } from '../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  Database,
  HardDrive,
  FileJson,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const STATUS_COLORS = {
  fresh: '#22c55e',
  stale: '#f59e0b',
  critical: '#ef4444'
};

const getActivityData = () => [
  { name: 'Mon', datasets: 4, transformations: 2 },
  { name: 'Tue', datasets: 3, transformations: 4 },
  { name: 'Wed', datasets: 6, transformations: 3 },
  { name: 'Thu', datasets: 8, transformations: 5 },
  { name: 'Fri', datasets: 5, transformations: 2 },
  { name: 'Sat', datasets: 2, transformations: 1 },
  { name: 'Sun', datasets: 1, transformations: 0 },
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recentDatasets, setRecentDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      const [metricsRes, alertsRes, datasetsRes] = await Promise.all([
        api.datasets.getMetrics(),
        api.alerts.getAll(true),
        api.datasets.getAll(1, 5)
      ]);
      setMetrics(metricsRes.data);
      setAlerts(alertsRes.data);
      setRecentDatasets(datasetsRes.data);
    } catch (error) {
      addToast('Failed to load dashboard data', 'error');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
    addToast('Dashboard refreshed', 'info');
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getStatusData = () => [
    { name: 'Fresh', value: metrics?.fresh || 0, color: STATUS_COLORS.fresh },
    { name: 'Stale', value: metrics?.stale || 0, color: STATUS_COLORS.stale },
    { name: 'Critical', value: metrics?.critical || 0, color: STATUS_COLORS.critical },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-secondary text-sm">
            Overview of your data platform
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn btn-secondary"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Datasets"
          value={metrics?.total || 0}
          icon={<Database className="w-5 h-5" />}
          trend="+12% from last week"
          color="primary"
        />
        <StatCard
          title="Total Records"
          value={metrics?.totalRecords?.toLocaleString() || '0'}
          icon={<FileJson className="w-5 h-5" />}
          trend="+5.2% growth"
          color="emerald"
        />
        <StatCard
          title="Storage Used"
          value={formatBytes(metrics?.totalSize || 0)}
          icon={<HardDrive className="w-5 h-5" />}
          trend="2.4 GB free"
          color="amber"
        />
        <StatCard
          title="Active Alerts"
          value={alerts.length}
          icon={<AlertCircle className="w-5 h-5" />}
          trend={alerts.length > 0 ? 'Requires attention' : 'All clear'}
          color="red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Dataset Status</h3>
            <Activity className="w-5 h-5 text-secondary" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getStatusData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {getStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(30, 41, 59)',
                    border: '1px solid rgb(51, 65, 85)',
                    borderRadius: '0.5rem',
                    color: '#f1f5f9'
                  }}
                />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  formatter={(value) => <span className="text-sm text-secondary">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Weekly Activity</h3>
            <TrendingUp className="w-5 h-5 text-secondary" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getActivityData()}>
                <defs>
                  <linearGradient id="colorDatasets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTransformations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(30, 41, 59)',
                    border: '1px solid rgb(51, 65, 85)',
                    borderRadius: '0.5rem',
                    color: '#f1f5f9'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="datasets"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorDatasets)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="transformations"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorTransformations)"
                  strokeWidth={2}
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Alerts & Datasets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Alerts</h3>
            {alerts.length > 0 && (
              <span className="badge badge-danger">{alerts.length} unread</span>
            )}
          </div>
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="w-16 h-16 text-emerald-500 mb-3" />
              <p className="text-secondary">No unread alerts</p>
              <p className="text-sm text-muted">Everything is running smoothly</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 5).map(alert => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-dark-900/50 border border-dark-700 hover:border-dark-600 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${
                    alert.severity === 'critical' ? 'bg-red-500/10' :
                    alert.severity === 'warning' ? 'bg-amber-500/10' :
                    'bg-primary-500/10'
                  }`}>
                    <AlertCircle className={`w-4 h-4 ${
                      alert.severity === 'critical' ? 'text-red-500' :
                      alert.severity === 'warning' ? 'text-amber-500' :
                      'text-primary-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{alert.title}</h4>
                    <p className="text-xs text-secondary line-clamp-2">{alert.message}</p>
                    <p className="text-xs text-muted mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Datasets */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Datasets</h3>
            <Database className="w-5 h-5 text-secondary" />
          </div>
          {recentDatasets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Database className="w-16 h-16 text-secondary mb-3 opacity-30" />
              <p className="text-secondary">No datasets yet</p>
              <p className="text-sm text-muted">Create your first dataset to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDatasets.map(dataset => (
                <div
                  key={dataset.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-dark-900/50 border border-dark-700 hover:border-dark-600 transition-all hover:translate-x-1"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${
                      dataset.freshness === 'fresh' ? 'bg-emerald-500/10' :
                      dataset.freshness === 'stale' ? 'bg-amber-500/10' :
                      'bg-red-500/10'
                    }`}>
                      <FileJson className={`w-4 h-4 ${
                        dataset.freshness === 'fresh' ? 'text-emerald-500' :
                        dataset.freshness === 'stale' ? 'text-amber-500' :
                        'text-red-500'
                      }`} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium truncate">{dataset.name}</h4>
                      <p className="text-xs text-secondary">
                        {dataset.recordCount.toLocaleString()} records
                      </p>
                    </div>
                  </div>
                  <span className={`badge ${
                    dataset.freshness === 'fresh' ? 'badge-success' :
                    dataset.freshness === 'stale' ? 'badge-warning' :
                    'badge-danger'
                  }`}>
                    {dataset.freshness}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
  color
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  color: 'primary' | 'emerald' | 'amber' | 'red';
}) {
  const colorClasses = {
    primary: 'bg-primary-500/10 text-primary border-primary-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    red: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <div className="card card-interactive group">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-xs text-secondary">{trend}</span>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-secondary mt-1">{title}</p>
      </div>
    </div>
  );
}
