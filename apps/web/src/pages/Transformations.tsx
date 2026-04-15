import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Transformation } from '../types';

export default function Transformations() {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'filter',
    config: '{}'
  });

  useEffect(() => {
    api.transformations.getAll()
      .then((res) => setTransformations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.transformations.create({
        ...formData,
        config: JSON.parse(formData.config)
      });
      setShowModal(false);
      setFormData({ name: '', description: '', type: 'filter', config: '{}' });
      api.transformations.getAll().then((res) => setTransformations(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transformation?')) return;
    try {
      await api.transformations.delete(id);
      api.transformations.getAll().then((res) => setTransformations(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  const typeLabels: Record<string, string> = {
    filter: 'Filter',
    aggregate: 'Aggregate',
    enrich: 'Enrich',
    validate: 'Validate',
    normalize: 'Normalize',
    join: 'Join'
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
        <h1>Transformations</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Transformation
        </button>
      </div>

      <div className="card">
        {transformations.length === 0 ? (
          <div className="empty-state">
            <p>No transformations configured.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Description</th>
                <th>Enabled</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transformations.map((t) => (
                <tr key={t.id}>
                  <td><strong>{t.name}</strong></td>
                  <td><span className="badge badge-info">{typeLabels[t.type]}</span></td>
                  <td>{t.description || '-'}</td>
                  <td>
                    <span className={`badge ${t.isEnabled ? 'badge-success' : 'badge-warning'}`}>
                      {t.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td>{t.order}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary" onClick={() => handleDelete(t.id)}>
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
              <h2 className="modal-title">New Transformation</h2>
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
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="filter">Filter</option>
                  <option value="aggregate">Aggregate</option>
                  <option value="enrich">Enrich</option>
                  <option value="validate">Validate</option>
                  <option value="normalize">Normalize</option>
                  <option value="join">Join</option>
                </select>
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
                <label className="form-label">Config (JSON)</label>
                <textarea
                  className="form-textarea"
                  value={formData.config}
                  onChange={(e) => setFormData({ ...formData, config: e.target.value })}
                  style={{ minHeight: '80px' }}
                />
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