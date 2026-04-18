import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Dataset, DatasetSnapshot } from '../types';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Clock,
  HardDrive,
  FileJson,
  Database,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export default function Datasets() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState<Dataset | null>(null);
  const [editingDataset, setEditingDataset] = useState<Dataset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sourceType: 'api' as Dataset['sourceType']
  });

  const { addToast } = useToast();

  const loadDatasets = async () => {
    try {
      const res = await api.datasets.getAll(page, 20);
      setDatasets(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (error) {
      addToast('Failed to load datasets', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatasets();
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDataset) {
        await api.datasets.update(editingDataset.id, formData);
        addToast('Dataset updated successfully', 'success');
      } else {
        await api.datasets.create(formData);
        addToast('Dataset created successfully', 'success');
      }
      setShowModal(false);
      setEditingDataset(null);
      setFormData({ name: '', description: '', sourceType: 'api' });
      loadDatasets();
    } catch (error) {
      addToast(editingDataset ? 'Failed to update dataset' : 'Failed to create dataset', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dataset?')) return;
    try {
      await api.datasets.delete(id);
      addToast('Dataset deleted successfully', 'success');
      loadDatasets();
    } catch (error) {
      addToast('Failed to delete dataset', 'error');
    }
  };

  const handleCreateSnapshot = async (id: string) => {
    try {
      await api.datasets.createSnapshot(id);
      addToast('Snapshot created successfully', 'success');
      loadDatasets();
    } catch (error) {
      addToast('Failed to create snapshot', 'error');
    }
  };

  const openEditModal = (dataset: Dataset) => {
    setEditingDataset(dataset);
    setFormData({
      name: dataset.name,
      description: dataset.description || '',
      sourceType: dataset.sourceType
    });
    setShowModal(true);
  };

  const filteredDatasets = datasets.filter(ds => {
    const matchesSearch = ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ds.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ds.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getFreshnessBadge = (freshness: string) => {
    const config = {
      fresh: { class: 'badge-success', label: 'Fresh', icon: CheckCircle },
      stale: { class: 'badge-warning', label: 'Stale', icon: Clock },
      critical: { class: 'badge-danger', label: 'Critical', icon: AlertCircle }
    };
    const { class: className, label, icon: Icon } = config[freshness as keyof typeof config] || config.fresh;
    return (
      <span className={`badge ${className} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

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
          <h1 className="page-title">Datasets</h1>
          <p className="text-secondary text-sm">
            Manage your data sources and datasets
          </p>
        </div>
        <button
          onClick={() => {
            setEditingDataset(null);
            setFormData({ name: '', description: '', sourceType: 'api' });
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          New Dataset
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <input
              type="text"
              placeholder="Search datasets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-secondary" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select w-auto"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="deprecated">Deprecated</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {filteredDatasets.length === 0 ? (
          <div className="empty-state">
            <Database className="w-16 h-16 text-secondary opacity-30" />
            <h3 className="text-lg font-medium mb-2">No datasets found</h3>
            <p className="text-secondary mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first dataset to get started'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <Plus className="w-4 h-4" />
                Create Dataset
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Source</th>
                    <th>Freshness</th>
                    <th>Records</th>
                    <th>Size</th>
                    <th>Updated</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDatasets.map((ds) => (
                    <tr key={ds.id} className="group">
                      <td>
                        <div>
                          <strong className="font-medium block">{ds.name}</strong>
                          {ds.description && (
                            <span className="text-xs text-secondary line-clamp-1">
                              {ds.description}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          ds.status === 'active' ? 'badge-success' :
                          ds.status === 'deprecated' ? 'badge-warning' : 'badge-neutral'
                        }`}>
                          {ds.status}
                        </span>
                      </td>
                      <td>
                        <span className="capitalize text-sm">{ds.sourceType}</span>
                      </td>
                      <td>{getFreshnessBadge(ds.freshness)}</td>
                      <td className="font-mono text-sm">
                        {ds.recordCount.toLocaleString()}
                      </td>
                      <td className="font-mono text-sm">
                        {formatBytes(ds.sizeBytes)}
                      </td>
                      <td className="text-sm text-secondary">
                        {new Date(ds.updatedAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setShowDetails(ds)}
                            className="btn btn-ghost btn-sm"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(ds)}
                            className="btn btn-ghost btn-sm"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCreateSnapshot(ds.id)}
                            className="btn btn-ghost btn-sm"
                            title="Create snapshot"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ds.id)}
                            className="btn btn-ghost btn-sm text-red-500 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-dark-700">
                <p className="text-sm text-secondary">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn btn-ghost btn-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn btn-ghost btn-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingDataset ? 'Edit Dataset' : 'Create New Dataset'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="modal-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">
                <div>
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter dataset name"
                  />
                </div>
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    className="textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="form-label">Source Type</label>
                  <select
                    className="select"
                    value={formData.sourceType}
                    onChange={(e) => setFormData({ ...formData, sourceType: e.target.value as Dataset['sourceType'] })}
                  >
                    <option value="api">API</option>
                    <option value="database">Database</option>
                    <option value="file">File</option>
                    <option value="stream">Stream</option>
                    <option value="webhook">Webhook</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDataset ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && (
        <DatasetDetails
          dataset={showDetails}
          onClose={() => setShowDetails(null)}
          onCreateSnapshot={() => handleCreateSnapshot(showDetails.id)}
          onEdit={() => openEditModal(showDetails)}
          onDelete={() => handleDelete(showDetails.id)}
        />
      )}
    </div>
  );
}

function DatasetDetails({
  dataset,
  onClose,
  onCreateSnapshot,
  onEdit,
  onDelete
}: {
  dataset: Dataset;
  onClose: () => void;
  onCreateSnapshot: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [snapshots, setSnapshots] = useState<DatasetSnapshot[]>([]);
  const [loadingSnapshots, setLoadingSnapshots] = useState(true);

  useEffect(() => {
    api.datasets.getSnapshots(dataset.id)
      .then(res => setSnapshots(res.data))
      .catch(console.error)
      .finally(() => setLoadingSnapshots(false));
  }, [dataset.id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{dataset.name}</h2>
            <p className="text-sm text-secondary mt-1">{dataset.description || 'No description'}</p>
          </div>
          <button onClick={onClose} className="modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-dark-900/50 border border-dark-700">
              <div className="flex items-center gap-2 text-secondary mb-2">
                <FileJson className="w-4 h-4" />
                <span className="text-xs font-medium">Records</span>
              </div>
              <p className="text-xl font-bold">{dataset.recordCount.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-dark-900/50 border border-dark-700">
              <div className="flex items-center gap-2 text-secondary mb-2">
                <HardDrive className="w-4 h-4" />
                <span className="text-xs font-medium">Size</span>
              </div>
              <p className="text-xl font-bold">{formatBytes(dataset.sizeBytes)}</p>
            </div>
            <div className="p-4 rounded-lg bg-dark-900/50 border border-dark-700">
              <div className="flex items-center gap-2 text-secondary mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">Created</span>
              </div>
              <p className="text-sm font-medium">{new Date(dataset.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-dark-900/50 border border-dark-700">
              <div className="flex items-center gap-2 text-secondary mb-2">
                <RefreshCw className="w-4 h-4" />
                <span className="text-xs font-medium">Last Ingested</span>
              </div>
              <p className="text-sm font-medium">
                {dataset.lastIngestedAt
                  ? new Date(dataset.lastIngestedAt).toLocaleString()
                  : 'Never'}
              </p>
            </div>
          </div>

          {/* Snapshots */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Snapshots</h4>
              <button
                onClick={onCreateSnapshot}
                className="btn btn-secondary btn-sm"
              >
                <RefreshCw className="w-3 h-3" />
                Create Snapshot
              </button>
            </div>
            {loadingSnapshots ? (
              <div className="loading py-8">
                <div className="spinner" />
              </div>
            ) : snapshots.length === 0 ? (
              <p className="text-sm text-secondary text-center py-8">
                No snapshots yet. Create one to version your data.
              </p>
            ) : (
              <div className="space-y-2">
                {snapshots.map(snap => (
                  <div
                    key={snap.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-dark-900/50 border border-dark-700"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        Version {snap.version}
                      </p>
                      <p className="text-xs text-secondary">
                        {snap.recordCount.toLocaleString()} records • {formatBytes(snap.sizeBytes)}
                      </p>
                    </div>
                    <span className="text-xs text-muted">
                      {new Date(snap.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onEdit}>
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button className="btn btn-danger" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
