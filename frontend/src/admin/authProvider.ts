import type { AuthProvider } from 'react-admin';

const API_URL = '/api';
const TOKEN_KEY = 'kaaydeuk_auth_token';
const USER_KEY = 'kaaydeuk_auth_user';

export const authProvider: AuthProvider = {
  // ── Login ─────────────────────────────────────────────────────────────────
  login: async ({ username, password }: { username: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.message ?? 'Email ou mot de passe incorrect');
    }

    const body = await response.json();
    const result = body.data ?? body;

    localStorage.setItem(TOKEN_KEY, result.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(result.admin));
  },

  // ── Logout ────────────────────────────────────────────────────────────────
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // ── Vérification d'authentification ────────────────────────────────────────
  checkAuth: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return Promise.reject({ redirectTo: '/login' });
    }
    // Vérification d'expiration côté client (optionnel mais utile UX)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return Promise.reject({ redirectTo: '/login' });
      }
    } catch {
      // Si le token est malformé, on laisse l'API gérer
    }
  },

  // ── Gestion des erreurs réseau ─────────────────────────────────────────────
  checkError: async (error: { status?: number }) => {
    if (error?.status === 401 || error?.status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return Promise.reject({ redirectTo: '/login' });
    }
  },

  // ── Infos utilisateur connecté ─────────────────────────────────────────────
  getIdentity: async () => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) throw new Error('Non authentifié');
    const user = JSON.parse(raw);
    return {
      id: user.id ?? 0,
      fullName: user.nom ?? 'Admin',
      avatar: undefined,
    };
  },

  // ── Permissions ───────────────────────────────────────────────────────────
  getPermissions: async () => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user.type ?? 'ADMINISTRATEUR';
  },
};
