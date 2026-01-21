import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://10.118.232.248:8000";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const res = await fetch(`${BACKEND_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        age: Number(age),
        email,
        phone,
      }),
    });

    const data = await res.json();

    if (data.user_id) {
      localStorage.setItem("user_id", data.user_id.toString());
      navigate("/dashboard");
    }
  };

  return (
    <div className="p-6">
      <h2>Sign Up</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        placeholder="Age"
        onChange={(e) => setAge(e.target.value)}
      />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Phone"
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={handleSignup}>
        Create Account
      </button>
    </div>
  );
};

export default Signup;
