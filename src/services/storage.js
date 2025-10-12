import AsyncStorage from '@react-native-async-storage/async-storage';

// Centralized AsyncStorage helpers for admin features and auth

export const STORAGE_KEYS = {
  users: '@elearning_users',
  invite: '@elearning_invite_code',
  auth: '@elearning_auth_state',
  courses: '@elearning_courses',
  live: '@elearning_live_now',
  schedule: '@elearning_schedule',
};

export async function readJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export async function writeJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export async function getUsers() {
  return (await readJSON(STORAGE_KEYS.users, [])) || [];
}

export async function saveUsers(list) {
  await writeJSON(STORAGE_KEYS.users, list || []);
}

export async function upsertUser(user) {
  const list = await getUsers();
  const key = (user?.email || '').toLowerCase();
  const next = list.filter((u) => (u.email || '').toLowerCase() !== key);
  next.push(user);
  await saveUsers(next);
  return next;
}

export async function deleteUserById(id) {
  const list = await getUsers();
  const next = list.filter((u) => u.id !== id);
  await saveUsers(next);
  return next;
}

export async function getInviteCode() {
  try { return (await AsyncStorage.getItem(STORAGE_KEYS.invite)) || ''; } catch { return ''; }
}

export async function setInviteCode(code) {
  try { await AsyncStorage.setItem(STORAGE_KEYS.invite, code || ''); } catch {}
}

export async function getLiveSessions() {
  return (await readJSON(STORAGE_KEYS.live, [])) || [];
}

export async function saveLiveSessions(list) {
  await writeJSON(STORAGE_KEYS.live, list || []);
}

export async function getSchedule() {
  return (await readJSON(STORAGE_KEYS.schedule, [])) || [];
}

export async function saveSchedule(list) {
  await writeJSON(STORAGE_KEYS.schedule, list || []);
}

export async function getCourses() {
  return (await readJSON(STORAGE_KEYS.courses, [])) || [];
}

export async function saveCourses(list) {
  await writeJSON(STORAGE_KEYS.courses, list || []);
}
