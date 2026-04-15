import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Dataset } from '../types';

export default function Datasets() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sourceType: 'api'
  });

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = () => {
    api.datasets.getAll(1, 50)
      .then((res) => setDatasets(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.datasets.create(formData);
      setShowModal(false);
      setFormData({ name: '', description: '', sourceType: 'api' });
      loadDatasets();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dataset?')) return;
    try {
      await api.datasets.delete(id);
      loadDatasets();
    } catch (err) {
      console.error(err);
    }
  };

  const getFreshnessBadge = (freshness: string) => {
    const classes: Record<string, string> = {
      fresh: 'badge-success',
      stale: 'badge-warning',
      critical: 'badge-danger'
    };
    return <span className={`badge ${classes[freshness]}`}>{freshness}</span>;
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
        <h1>Datasets</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Dataset
        </button>
      </div>

      <div className="card">
        {datasets.length === 0 ? (
          <div className="empty-state">
            <p>No datasets found. Create your first dataset to get started.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Source</th>
                <th>Freshness</th>
                <th>Records</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((ds) => (
                <tr key={ds.id}>
                  <td>
                    <strong>{ds.name}</strong>
                    {ds.description && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {ds.description}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${ds.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {ds.status}
                    </span>
                  </td>
                  <td>{ds.sourceType}</td>
                  <td>{getFreshnessBadge(ds.freshness)}</td>
                  <td>{ds.recordCount.toLocaleString()}</td>
                  <td>{(ds.sizeBytes / 1024).toFixed(1)} KB</td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleDelete(ds.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">New Dataset</h2>
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
                <label className="form-label">Source Type</label>
                <select
                  className="form-select"
                  value={formData.sourceType}
                  onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
                >
                  <option value="api">API</option>
                  <option value="database">Database</option>
                  <option value="file">File</option>
                  <option value="stream">Stream</option>
                  <option value="webhook">Webhook</option>
                </select>
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