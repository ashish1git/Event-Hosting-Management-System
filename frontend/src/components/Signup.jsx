import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/auth.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mapping 'name' to 'fullName' as expected by backend
      const payload = {
          fullName: formData.name,
          email: formData.email,
          password: formData.password
      };

      const { data } = await API.post("/api/users/register", payload);

      // Save token/user info
      localStorage.setItem("userInfo", JSON.stringify(data));

      alert("Registration Successful 🎉");
      navigate('/');

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration Failed ❌");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join college events</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register; // Note: Ensure filename matches import. Components is usually Signup.jsx, matching user request 'Register' logic inside Signup.jsx or we rename file. User existing file is Signup.jsx. I will write this into Signup.jsx but keep component name Register or Signup consistent. Let's use Register component name inside Signup.jsx to match user code snippet style but file name remains Signup.jsx.
