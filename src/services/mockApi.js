// Fallback mock API with in-memory persistence for the session
import { courses as SEED_COURSES, instructors as SEED_INSTRUCTORS } from '../mock/data';

function delay(ms = 400) {
  return new Promise((res) => setTimeout(res, ms));
}

function clone(v) {
  return JSON.parse(JSON.stringify(v));
}

// In-memory DB for the session (non-persistent)
let DB = clone(SEED_COURSES).map((c) => ({ published: true, ...c }));
const INSTRUCTORS = clone(SEED_INSTRUCTORS);

function findCourseIndex(id) {
  return DB.findIndex((x) => x.id === id);
}

export async function getCourses({ offset = 0, limit = 10, q = '', category, onlyPublished = false } = {}) {
  await delay();
  let arr = DB;
  if (q) {
    const qq = String(q).toLowerCase();
    arr = arr.filter((c) => c.title.toLowerCase().includes(qq) || (c.author || '').toLowerCase().includes(qq));
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
  await delay();
  const c = DB.find((x) => x.id === id) || DB[0];
  const teacher = INSTRUCTORS.find((t) => t.id === c.teacherId) || INSTRUCTORS[0];
  return { ...clone(c), teacher: clone(teacher) };
}

// Admin-like operations on mock data (in-memory persistence)
export async function createCourse(payload) {
  await delay();
  const id = 'c' + Math.floor(Math.random() * 100000);
  const next = { id, published: false, lessons: 0, reviews: 0, rating: 0, bestSeller: false, ...payload };
  DB.unshift(next);
  return clone(next);
}

export async function updateCourse(id, payload) {
  await delay();
  const idx = findCourseIndex(id);
  if (idx === -1) return clone({ id, ...payload });
  DB[idx] = { ...DB[idx], ...payload };
  return clone(DB[idx]);
}

export async function deleteCourse(id) {
  await delay();
  DB = DB.filter((x) => x.id !== id);
  return { ok: true, id };
}

export async function setCoursePublished(id, published) {
  await delay(200);
  const idx = findCourseIndex(id);
  if (idx === -1) return { ok: false };
  DB[idx].published = !!published;
  return clone(DB[idx]);
}
