import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Metrics, Alert } from '../types';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.datasets.getMetrics(),
      api.alerts.getAll(true)
    ])
      .then(([metricsRes, alertsRes]) => {
        setMetrics(metricsRes.data);
        setAlerts(alertsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div>
      <div className="header">
        <h1>Dashboard</h1>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card stat-card">
          <span className="stat-label">Total Datasets</span>
          <span className="stat-value">{metrics?.total ?? 0}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Fresh</span>
          <span className="stat-value text-success">{metrics?.fresh ?? 0}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Stale</span>
          <span className="stat-value text-warning">{metrics?.stale ?? 0}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Critical</span>
          <span className="stat-value text-danger">{metrics?.critical ?? 0}</span>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Storage Overview</h2>
          </div>
          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div>
              <div className="stat-label">Total Records</div>
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>
                {metrics?.totalRecords?.toLocaleString() ?? 0}
              </div>
            </div>
            <div>
              <div className="stat-label">Total Size</div>
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>
                {formatBytes(metrics?.totalSize ?? 0)}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Alerts</h2>
            {alerts.length > 0 && (
              <span className="badge badge-danger">{alerts.length} unread</span>
            )}
          </div>
          {alerts.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No unread alerts</p>
          ) : (
            <div>
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="alert-item">
                  <span className={`alert-icon badge badge-${alert.severity === 'critical' ? 'danger' : alert.severity === 'warning' ? 'warning' : 'info'}`}>
                    {alert.severity === 'critical' ? '!' : alert.severity === 'warning' ? '!' : 'i'}
                  </span>
                  <div className="alert-content">
                    <div className="alert-title">{alert.title}</div>
                    <div className="alert-message">{alert.message}</div>
                    <div className="alert-meta">
                      {new Date(alert.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}