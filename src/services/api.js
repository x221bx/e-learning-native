import config from '../config';
import * as mock from './mockApi';

function buildQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.append(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function normalizeError(err, status) {
  const msg = err?.message || 'Request failed';
  const isNetworkError = msg === 'Failed to fetch' || msg.includes('Network') || msg.includes('Aborted');
  return { message: msg, status: status || null, isNetworkError };
}

async function request(path, { method = 'GET', body, headers, timeout = 12000, retries = 2 } = {}) {
  const base = config.API_BASE_URL;
  if (!base) throw new Error('NO_API_BASE');
  const url = base.replace(/\/$/, '') + path;

  let attempt = 0;
  let lastError = null;

  while (attempt <= retries) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...(headers || {}) },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(id);
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        const err = new Error(`API ${res.status}: ${text || res.statusText}`);
        // No retry on 4xx except 408
        if (res.status >= 400 && res.status < 500 && res.status !== 408) {
          throw err;
        }
        lastError = normalizeError(err, res.status);
        attempt += 1;
        if (attempt > retries) throw err;
        await sleep(300 * attempt); // simple backoff
        continue;
      }
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) return res.json();
      return res.text();
    } catch (e) {
      clearTimeout(id);
      lastError = normalizeError(e);
      attempt += 1;
      if (attempt > retries) throw e;
      await sleep(300 * attempt);
    }
  }
  // Should not reach here
  throw lastError || new Error('Request failed');
}

export const CoursesAPI = {
  async list(params) {
    if (!config.API_BASE_URL) return mock.getCourses(params);
    const { offset, limit, q, category, onlyPublished } = params || {};
    return request(`/courses${buildQuery({ offset, limit, q, category, onlyPublished })}`);
  },
  async get(id) {
    if (!config.API_BASE_URL) return mock.getCourse(id);
    return request(`/courses/${id}`);
  },
  async create(payload) {
    if (!config.API_BASE_URL) return mock.createCourse(payload);
    return request(`/courses`, { method: 'POST', body: payload });
  },
  async update(id, payload) {
    if (!config.API_BASE_URL) return mock.updateCourse(id, payload);
    return request(`/courses/${id}`, { method: 'PUT', body: payload });
  },
  async remove(id) {
    if (!config.API_BASE_URL) return mock.deleteCourse(id);
    return request(`/courses/${id}`, { method: 'DELETE' });
  },
  async setPublished(id, published) {
    if (!config.API_BASE_URL) return mock.setCoursePublished(id, published);
    return request(`/courses/${id}/publish`, { method: 'POST', body: { published } });
  },
};

