import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    pincode: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert("Registered successfully. Please login.");
      navigate("/");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Create Account</h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />

        <input
          name="age"
          type="number"
          placeholder="Age"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          name="pincode"
          placeholder="Pincode"
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <button className="w-full bg-blue-600 text-white p-3 rounded-lg">
          Register
        </button>
      </form>
    </div>
  );
}
