const KEY = "access_token";
export const getAccessToken = () => localStorage.getItem(KEY);
export const putAccessToken = (t) => localStorage.setItem(KEY, t);
export const removeAccessToken = () => localStorage.removeItem(KEY);
export async function apiFetch(path, { method = "GET", params, body, form } = {}) {
  const url = new URL(DELCOM_BASEURL + path);
  Object.entries(params || {}).forEach(([k, v]) => v !== "" && v != null && url.searchParams.set(k, v));
  const headers = {};
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(url, { method, headers, body: form || (body ? JSON.stringify(body) : undefined) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) throw new Error(json.message || "Terjadi kesalahan");
  return json;
}
