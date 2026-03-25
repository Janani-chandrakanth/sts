import axios from "axios";

export const adminLogin = (data) =>
  axios.post("http://localhost:5000/api/admin/login", {
    username: data.email,   // 🔥 IMPORTANT
    password: data.password
  });
