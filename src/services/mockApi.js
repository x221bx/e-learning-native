// Fallback mock API with persistence to AsyncStorage (and in-memory for the session)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { courses as SEED_COURSES, instructors as SEED_INSTRUCTORS } from '../mock/data';

const STORAGE_KEY = '@elearning_courses';

function delay(ms = 400) {
  return new Promise((res) => setTimeout(res, ms));
}

function clone(v) {
  return JSON.parse(JSON.stringify(v));
}

// In-memory DB for the session (persisted across sessions via AsyncStorage)
let DB = null; // initialized lazily
const INSTRUCTORS = clone(SEED_INSTRUCTORS);

async function ensureLoaded() {
  if (DB) return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // If previously saved empty array (dev), reseed to ensure demo data
        if (parsed.length === 0) {
          throw new Error('EMPTY_DB');
        }
        DB = parsed;
        return;
      }
    }
  } catch {}
  // Fallback seed
  DB = clone(SEED_COURSES).map((c) => ({ published: true, ...c }));
  try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DB)); } catch {}
}

async function saveDB() {
  try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DB)); } catch {}
}

function findCourseIndex(id) {
  return (DB || []).findIndex((x) => x.id === id);
}

export async function getCourses({ offset = 0, limit = 10, q = '', category, onlyPublished = false } = {}) {
  await ensureLoaded();
  await delay();
  let arr = DB || [];
  if (q) {
    const qq = String(q).toLowerCase();
    arr = arr.filter((c) => c.title?.toLowerCase().includes(qq) || (c.author || '').toLowerCase().includes(qq));
  }
  if (category) {
    arr = arr.filter((c) => c.categoryId === category);
  }
  if (onlyPublished) {
    arr = arr.filter((c) => c.published !== false);
  }
  const total = arr.length;
  const items = arr.slice(offset, offset + limit);
  return { items: clone(items), total, hasMore: offset + limit < total };
}

export async function getCourse(id) {
  await ensureLoaded();
  await delay();
  const c = (DB || []).find((x) => x.id === id) || (DB || [])[0];
  if (!c) return null;
  const teacher = INSTRUCTORS.find((t) => t.id === c.teacherId) || INSTRUCTORS[0];
  return { ...clone(c), teacher: clone(teacher) };
}

// Admin-like operations on mock data (persisted)
export async function createCourse(payload) {
  await ensureLoaded();
  await delay();
  const id = 'c' + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
  const next = { id, published: false, lessons: 0, reviews: 0, rating: 0, bestSeller: false, ...payload };
  DB.unshift(next);
  await saveDB();
  return clone(next);
}

export async function updateCourse(id, payload) {
  await ensureLoaded();
  await delay();
  const idx = findCourseIndex(id);
  if (idx === -1) {
    const next = { id, published: false, lessons: 0, reviews: 0, rating: 0, bestSeller: false, ...payload };
    DB.unshift(next);
    await saveDB();
    return clone(next);
  }
  DB[idx] = { ...DB[idx], ...payload };
  await saveDB();
  return clone(DB[idx]);
}

export async function deleteCourse(id) {
  await ensureLoaded();
  await delay();
  DB = (DB || []).filter((x) => x.id !== id);
  await saveDB();
  return { ok: true, id };
}

export async function setCoursePublished(id, published) {
  await ensureLoaded();
  await delay(200);
  const idx = findCourseIndex(id);
  if (idx === -1) return { ok: false };
  DB[idx].published = !!published;
  await saveDB();
  return clone(DB[idx]);
}
