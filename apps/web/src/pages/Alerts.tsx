import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Alert } from '../types';

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, [unreadOnly]);

  const loadAlerts = () => {
    api.alerts.getAll(unreadOnly)
      .then((res) => setAlerts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.alerts.markAsRead(id);
      loadAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.alerts.markAllAsRead();
      loadAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.alerts.delete(id);
      loadAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const getSeverityBadge = (severity: string) => {
    const classes: Record<string, string> = {
      critical: 'badge-danger',
      error: 'badge-danger',
      warning: 'badge-warning',
      info: 'badge-info'
    };
    return <span className={`badge ${classes[severity]}`}>{severity}</span>;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h1>Alerts</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
            />
            Unread only
          </label>
          <button className="btn btn-secondary" onClick={handleMarkAllAsRead}>
            Mark all as read
          </button>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <p>No alerts to display.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="alert-item"
              style={{ background: alert.isRead ? 'transparent' : 'var(--bg-primary)' }}
            >
              <div className="alert-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="alert-title">{alert.title}</span>
                  {getSeverityBadge(alert.severity)}
                  {!alert.isRead && <span className="badge badge-info">Unread</span>}
                </div>
                <div className="alert-message">{alert.message}</div>
                <div className="alert-meta">
                  {alert.dataset && <span>Dataset: {alert.dataset.name} </span>}
                  {alert.pipeline && <span>Pipeline: {alert.pipeline.name} </span>}
                  <span>Created: {new Date(alert.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {!alert.isRead && (
                  <button className="btn btn-sm btn-secondary" onClick={() => handleMarkAsRead(alert.id)}>
                    Mark as read
                  </button>
                )}
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(alert.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}