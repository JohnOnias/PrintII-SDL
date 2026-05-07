// ===============================
// 📦 USER LOCAL STORAGE
// ===============================

export function getUser() {
  const user = localStorage.getItem("user");

  if (!user) return null;

  return JSON.parse(user);
}

export function updateUser(data) {
  localStorage.setItem(
    "user",
    JSON.stringify(data)
  );

  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  window.location.href = "/login";
}