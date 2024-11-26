import React, { useState } from "react";
import axios from "axios";

const GitHubRepoFetcher: React.FC = () => {
  const [owner, setOwner] = useState<string>("");
  const [repo, setRepo] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [commits, setCommits] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  const fetchCommits = async () => {
    setError("");
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/commits`
      );
      setCommits(response.data);
    } catch (err) {
      setError(`error: ${err}`);
    }
  };

  return (
    <div>
      <h1>GitHub Commit Fetcher</h1>
      <input
        type="text"
        placeholder="Owner"
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
      />
      <input
        type="text"
        placeholder="Repository"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
      />
      <button onClick={fetchCommits}>Fetch Commits</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {commits.map((commit) => (
          <li key={commit.sha}>
            <strong>{commit.commit.message}</strong> -{" "}
            {commit.commit.author.name} on {commit.commit.author.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GitHubRepoFetcher;
