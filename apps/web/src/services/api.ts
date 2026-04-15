const API_BASE = '/api/v1';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

export const api = {
  datasets: {
    getAll: (page = 1, limit = 20) =>
      fetchJson<{ data: any[]; pagination: any }>(`${API_BASE}/datasets?page=${page}&limit=${limit}`),
    getById: (id: string) =>
      fetchJson<{ data: any }>(`${API_BASE}/datasets/${id}`),
    create: (data: any) =>
      fetchJson<{ data: any }>(`${API_BASE}/datasets`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      fetchJson<{ data: any }>(`${API_BASE}/datasets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchJson<any>(`${API_BASE}/datasets/${id}`, { method: 'DELETE' }),
    getMetrics: () =>
      fetchJson<{ data: any }>(`${API_BASE}/datasets/metrics`),
    getSnapshots: (id: string) =>
      fetchJson<{ data: any[] }>(`${API_BASE}/datasets/${id}/snapshots`),
    createSnapshot: (id: string) =>
      fetchJson<{ data: any }>(`${API_BASE}/datasets/${id}/snapshots`, { method: 'POST' })
  },

  transformations: {
    getAll: () =>
      fetchJson<{ data: any[] }>(`${API_BASE}/transformations`),
    getById: (id: string) =>
      fetchJson<{ data: any }>(`${API_BASE}/transformations/${id}`),
    create: (data: any) =>
      fetchJson<{ data: any }>(`${API_BASE}/transformations`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      fetchJson<{ data: any }>(`${API_BASE}/transformations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchJson<any>(`${API_BASE}/transformations/${id}`, { method: 'DELETE' })
  },

  pipelines: {
    getAll: () =>
      fetchJson<{ data: any[] }>(`${API_BASE}/pipelines`),
    getById: (id: string) =>
      fetchJson<{ data: any }>(`${API_BASE}/pipelines/${id}`),
    create: (data: any) =>
      fetchJson<{ data: any }>(`${API_BASE}/pipelines`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      fetchJson<{ data: any }>(`${API_BASE}/pipelines/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchJson<any>(`${API_BASE}/pipelines/${id}`, { method: 'DELETE' }),
    triggerRun: (id: string) =>
      fetchJson<{ data: any }>(`${API_BASE}/pipelines/${id}/run`, { method: 'POST' }),
    getRuns: (id: string) =>
      fetchJson<{ data: any[] }>(`${API_BASE}/pipelines/${id}/runs`)
  },

  qualityChecks: {
    getByDataset: (datasetId: string) =>
      fetchJson<{ data: any[] }>(`${API_BASE}/quality-checks/dataset/${datasetId}`),
    create: (data: any) =>
      fetchJson<{ data: any }>(`${API_BASE}/quality-checks`, { method: 'POST', body: JSON.stringify(data) }),
    execute: (id: string) =>
      fetchJson<{ data: any }>(`${API_BASE}/quality-checks/${id}/execute`, { method: 'POST' }),
    delete: (id: string) =>
      fetchJson<any>(`${API_BASE}/quality-checks/${id}`, { method: 'DELETE' })
  },

  lineage: {
    getAll: () =>
      fetchJson<{ data: any[] }>(`${API_BASE}/lineage`),
    getById: (id: string) =>
      fetchJson<{ data: any }>(`${API_BASE}/lineage/${id}`),
    create: (data: any) =>
      fetchJson<{ data: any }>(`${API_BASE}/lineage`, { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchJson<any>(`${API_BASE}/lineage/${id}`, { method: 'DELETE' }),
    addNode: (graphId: string, data: any) =>
      fetchJson<{ data: any }>(`${API_BASE}/lineage/${graphId}/nodes`, { method: 'POST', body: JSON.stringify(data) }),
    addEdge: (graphId: string, data: any) =>
      fetchJson<{ data: any }>(`${API_BASE}/lineage/${graphId}/edges`, { method: 'POST', body: JSON.stringify(data) })
  },

  alerts: {
    getAll: (unreadOnly = false) =>
      fetchJson<{ data: any[] }>(`${API_BASE}/alerts?unreadOnly=${unreadOnly}`),
    getCount: () =>
      fetchJson<{ data: { unreadCount: number } }>(`${API_BASE}/alerts/count`),
    markAsRead: (id: string) =>
      fetchJson<{ data: any }>(`${API_BASE}/alerts/${id}/read`, { method: 'PATCH' }),
    markAllAsRead: () =>
      fetchJson<{ data: { markedAsRead: number } }>(`${API_BASE}/alerts/read-all`, { method: 'POST' }),
    delete: (id: string) =>
      fetchJson<any>(`${API_BASE}/alerts/${id}`, { method: 'DELETE' })
  }
};