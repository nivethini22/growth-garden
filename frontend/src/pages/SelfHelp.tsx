import { useEffect, useState } from "react";

const BACKEND_URL = "https://YOUR_BACKEND_URL_HERE";

const SelfHelp = () => {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/self-help?query=${query}`)

      .then((res) => res.json())
      .then(setArticles);
  }, [query]);

  return (
    <div className="p-6">
      <h2>Self-Help Resources</h2>
      <input
        placeholder="Search topics…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {articles.map((a: any) => (
        <div key={a.id} className="mt-4 p-3 border rounded">
          <h3>{a.title}</h3>
          <p>{a.content}</p>
        </div>
      ))}
    </div>
  );
};

export default SelfHelp;