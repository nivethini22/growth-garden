import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "https://YOUR_BACKEND_URL_HERE";

const Login = () => {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();

const handleLogin = async () => {
const res = await fetch(`${BACKEND_URL}/signin`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ username, password }),
});

const data = await res.json();

if (data.user_id) {
localStorage.setItem("user_id", data.user_id.toString());
navigate("/dashboard");
}
};

return (
<div className="p-6">
<h2>Login</h2>
<input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
<input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
<button onClick={handleLogin}>Login</button>
</div>
);
};

export default Login;

