import React, { useState } from "react";
import axios from "axios";
import SearchModal from "./SearchModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faStar as solidStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import "../styles/repoFetcher.css";

const GitHubRepoFetcher: React.FC = () => {
  const [owner, setOwner] = useState<string>("");
  const [repo, setRepo] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [commits, setCommits] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);

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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (searchTerm: string) => {
    if (searchTerm) {
      const filteredCommits = commits.filter((commit) =>
        commit.commit.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCommits(filteredCommits);
    }
  };

  const toggleFavorite = (sha: string) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(sha)) {
        // If it's already a favorite, remove it
        return prevFavorites.filter((favorite) => favorite !== sha);
      } else {
        // Otherwise, add it to favorites
        return [...prevFavorites, sha];
      }
    });
  };

  return (
    <div className="input-container">
      <h1>GitHub Commit Fetcher</h1>
      <div className="input-row">
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
      </div>
      <div className="button-container">
        <button onClick={fetchCommits}>Fetch All Commits</button>
        <button
          onClick={openModal}
          style={{ display: "flex", alignItems: "center" }}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul className="commit-list">
        {commits.map((commit) => (
          <li key={commit.sha} className="commit-card">
            <div className="commit-content">
              <div style={{ position: "relative" }}>
                <FontAwesomeIcon
                  icon={
                    favorites.includes(commit.sha) ? solidStar : regularStar
                  }
                  onClick={() => toggleFavorite(commit.sha)}
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    color: favorites.includes(commit.sha) ? "gold" : "gray",
                  }}
                />
              </div>
              <strong>{commit.commit.message}</strong>
              <p className="commit-author">By: {commit.commit.author.name}</p>
              <p className="commit-date">
                Date: {new Date(commit.commit.author.date).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <SearchModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default GitHubRepoFetcher;
