import { useEffect, useState } from "react";

const BACKEND_URL = "https://YOUR_BACKEND_URL_HERE";

const MoodTracker = () => {
const [moods, setMoods] = useState([]);
const userId = localStorage.getItem("user_id") || "1";

useEffect(() => {
fetch(`${BACKEND_URL}/moods/${userId}`)
.then((res) => res.json())
.then(setMoods);
}, []);

return (
<div className="p-6">
<h2>Your Mood History</h2>
{moods.map((m: any) => (
<div key={m.day}>
{m.day}: <strong>{m.mood}</strong>
</div>
))}
</div>
);
};

export default MoodTracker;
