import axios from "axios";

export const adminLogin = (data) =>
  axios.post("https://sts-backend-0zqu.onrender.com/api/admin/login", {
    username: data.email,   // 🔥 IMPORTANT
    password: data.password
  });
