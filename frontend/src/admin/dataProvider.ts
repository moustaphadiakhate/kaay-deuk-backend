import type { DataProvider, GetListParams, GetOneParams, CreateParams, UpdateParams, DeleteParams, DeleteManyParams, GetManyParams, GetManyReferenceParams } from 'react-admin';

const API_URL = '/api';
const TOKEN_KEY = 'kaaydeuk_auth_token';

// ── Client HTTP avec Authorization header ──────────────────────────────────
async function httpClient(url: string, options: RequestInit = {}): Promise<any> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(options.headers ?? {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 || response.status === 403) {
    throw { status: response.status, message: 'Non autorisé' };
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw { status: response.status, message: body?.message ?? 'Erreur API' };
  }

  const body = await response.json();
  // Notre API enveloppe les réponses dans { success, data, timestamp }
  return body?.data !== undefined ? body.data : body;
}

// ── Construction de la query string ───────────────────────────────────────
function buildQuery(params: Record<string, unknown>): string {
  const filtered = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  );
  return new URLSearchParams(filtered.map(([k, v]) => [k, String(v)])).toString();
}

// ── DataProvider ──────────────────────────────────────────────────────────
export const dataProvider: DataProvider = {
  getList: async (resource: string, params: GetListParams) => {
    const page = params.pagination?.page ?? 1;
    const perPage = params.pagination?.perPage ?? 10;
    const field = params.sort?.field ?? 'id';
    const order = params.sort?.order ?? 'DESC';

    const query = buildQuery({
      page,
      limit: perPage,
      sortBy: field,
      sortOrder: order.toLowerCase(),
      ...params.filter,
    });

    const result = await httpClient(`${API_URL}/${resource}?${query}`);
    // result = { data: [...], total, page, limit }
    return {
      data: result.data ?? result,
      total: result.total ?? (result.data ?? result).length,
    };
  },

  getOne: async (resource: string, params: GetOneParams) => {
    const data = await httpClient(`${API_URL}/${resource}/${params.id}`);
    return { data };
  },

  getMany: async (resource: string, params: GetManyParams) => {
    const requests = params.ids.map((id) => httpClient(`${API_URL}/${resource}/${id}`));
    const results = await Promise.all(requests);
    return { data: results };
  },

  getManyReference: async (resource: string, params: GetManyReferenceParams) => {
    const page = params.pagination?.page ?? 1;
    const perPage = params.pagination?.perPage ?? 10;
    const field = params.sort?.field ?? 'id';
    const order = params.sort?.order ?? 'DESC';

    const query = buildQuery({
      page,
      limit: perPage,
      sortBy: field,
      sortOrder: order.toLowerCase(),
      [params.target]: params.id,
      ...params.filter,
    });

    const result = await httpClient(`${API_URL}/${resource}?${query}`);
    return {
      data: result.data ?? result,
      total: result.total ?? (result.data ?? result).length,
    };
  },

  create: async (resource: string, params: CreateParams) => {
    // Endpoint spécial pour l'attribution de briques
    if (resource === 'briques/attribuer-admin') {
      const result = await httpClient(`${API_URL}/briques/attribuer`, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: { id: result?.transaction?.id ?? Date.now(), ...result } };
    }
    const result = await httpClient(`${API_URL}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
    return { data: result };
  },

  update: async (resource: string, params: UpdateParams) => {
    const result = await httpClient(`${API_URL}/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });
    return { data: result };
  },

  updateMany: async (resource: string, params: { ids: (string | number)[]; data: unknown }) => {
    await Promise.all(
      params.ids.map((id) =>
        httpClient(`${API_URL}/${resource}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(params.data),
        }),
      ),
    );
    return { data: params.ids };
  },

  delete: async (resource: string, params: DeleteParams) => {
    const data = await httpClient(`${API_URL}/${resource}/${params.id}`, {
      method: 'DELETE',
    });
    return { data: data ?? { id: params.id } };
  },

  deleteMany: async (resource: string, params: DeleteManyParams) => {
    await Promise.all(
      params.ids.map((id) =>
        httpClient(`${API_URL}/${resource}/${id}`, { method: 'DELETE' }),
      ),
    );
    return { data: params.ids };
  },
};
