import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/auth.css";

function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assuming backend is at /api/users/login as per previous backend setup
      const { data } = await API.post("/api/users/login", loginData);

      // Save token/user info
      localStorage.setItem("userInfo", JSON.stringify(data));

      alert("Login Successful ✅");

      // Redirect based on role
      if(data.role === 'admin') {
          navigate('/admin');
      } else {
          navigate('/'); // or user dashboard
      }

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Invalid Credentials ❌");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to your account</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={loginData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            required
          />

          {/* Forgot Password */}
          <div className="auth-forgot">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit">Login</button>
        </form>

        <div className="auth-switch">
          Don’t have an account? <Link to="/signup">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
