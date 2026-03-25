export const logout = (role) => {
  if (role === "admin") {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminName");
  }

  if (role === "user") {
    localStorage.removeItem("userToken");
  }

  window.location.href = "/";
};
