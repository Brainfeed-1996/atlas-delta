import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Pipeline } from '../types';

export default function Pipelines() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schedule: '',
    isActive: true
  });

  useEffect(() => {
    api.pipelines.getAll()
      .then((res) => setPipelines(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.pipelines.create(formData);
      setShowModal(false);
      setFormData({ name: '', description: '', schedule: '', isActive: true });
      api.pipelines.getAll().then((res) => setPipelines(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRun = async (id: string) => {
    try {
      await api.pipelines.triggerRun(id);
      api.pipelines.getAll().then((res) => setPipelines(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this pipeline?')) return;
    try {
      await api.pipelines.delete(id);
      api.pipelines.getAll().then((res) => setPipelines(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      active: 'badge-success',
      pending: 'badge-warning'
    };
    return <span className={`badge ${classes[status] || 'badge-info'}`}>{status}</span>;
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
        <h1>Pipelines</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Pipeline
        </button>
      </div>

      <div className="grid grid-cols-3">
        {pipelines.map((pipeline) => (
          <div key={pipeline.id} className="card">
            <div className="card-header">
              <h3 className="card-title">{pipeline.name}</h3>
              {getStatusBadge(pipeline.isActive ? 'active' : 'pending')}
            </div>
            {pipeline.description && (
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {pipeline.description}
              </p>
            )}
            {pipeline.schedule && (
              <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <strong>Schedule:</strong> {pipeline.schedule}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-sm btn-primary" onClick={() => handleRun(pipeline.id)}>
                Run
              </button>
              <button className="btn btn-sm btn-secondary" onClick={() => handleDelete(pipeline.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {pipelines.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <p>No pipelines configured. Create your first pipeline to get started.</p>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">New Pipeline</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Schedule (cron expression)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="0 * * * *"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  Active
                </label>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}