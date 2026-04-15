import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { LineageGraph } from '../types';

export default function Lineage() {
  const [graphs, setGraphs] = useState<LineageGraph[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    api.lineage.getAll()
      .then((res) => setGraphs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.lineage.create(formData);
      setShowModal(false);
      setFormData({ name: '' });
      api.lineage.getAll().then((res) => setGraphs(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lineage graph?')) return;
    try {
      await api.lineage.delete(id);
      api.lineage.getAll().then((res) => setGraphs(res.data));
    } catch (err) {
      console.error(err);
    }
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
        <h1>Data Lineage</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Graph
        </button>
      </div>

      <div className="grid grid-cols-3">
        {graphs.map((graph) => (
          <div key={graph.id} className="card">
            <div className="card-header">
              <h3 className="card-title">{graph.name}</h3>
            </div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              <div>Nodes: {graph.nodes.length}</div>
              <div>Edges: {graph.edges.length}</div>
            </div>
            <button className="btn btn-sm btn-secondary" onClick={() => handleDelete(graph.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {graphs.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <p>No lineage graphs configured. Create a graph to start tracking data lineage.</p>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">New Lineage Graph</h2>
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