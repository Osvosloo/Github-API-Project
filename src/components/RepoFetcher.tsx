import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchModal from "./SearchModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faStar as solidStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import "../styles/repoFetcher.css";

interface FavoriteCommit {
  owner: string;
  repo: string;
  sha: string;
}

const GitHubRepoFetcher: React.FC = () => {
  const [owner, setOwner] = useState<string>("");
  const [repo, setRepo] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [commits, setCommits] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<FavoriteCommit[]>([]);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [showAllFavorites, setShowAllFavorites] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allFavoriteCommits, setAllFavoriteCommits] = useState<any[]>([]);

  // Load favorites from localStorage when the component mounts
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
  
    if (storedFavorites) {
      try {
        const parsedFavorites = JSON.parse(storedFavorites);
        // Check if parsedFavorites is an array
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
        } else {
          console.warn("Favorites is not an array, resetting to empty.");
          setFavorites([]);
        }
      } catch (error) {
        console.error("Error parsing favorites from localStorage", error);
        setFavorites([]);
      }
      console.log(`load: ${storedFavorites}`);
    }
  }, []);

  const saveFavorites = async () => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    console.log(`save: ${JSON.stringify(favorites)}`);
  };

  const fetchCommits = async () => {
    setError("");
    setShowFavorites(false);
    setShowAllFavorites(false);
    try {
      if (owner && repo) {
        const response = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/commits`
        );
        setCommits(response.data);
      }
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
      const existingFavorite = prevFavorites.find(
        (favorite) =>
          favorite.sha === sha &&
          favorite.owner === owner &&
          favorite.repo === repo
      );

      if (existingFavorite) {
        // If it's already a favorite, remove it
        return prevFavorites.filter(
          (favorite) =>
            !(
              favorite.sha === sha &&
              favorite.owner === owner &&
              favorite.repo === repo
            )
        );
      } else {
        // Otherwise, add it to favorites
        return [...prevFavorites, { owner, repo, sha }];
      }
    });
    saveFavorites();
  };

  const toggleShowFavorites = () => {
    if (owner && repo) {
      setShowFavorites((prev) => !prev);
    }
  };

  const fetchAllFavoriteCommits = async () => {
    const allCommits = [];
    for (const { owner, repo, sha } of favorites) {
      try {
        // Fetch the commit details using the SHA
        if (owner && repo && sha) {
          const response = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`
          );
          allCommits.push(response.data);
        }
      } catch (err) {
        console.error(`Failed to fetch commit with SHA: ${sha}`, err);
      }
    }
    setAllFavoriteCommits(allCommits);
  };

  const toggleShowAllFavorites = () => {
    if (!showAllFavorites) {
      fetchAllFavoriteCommits(); // Fetch all favorite commits when showing
    }
    setShowAllFavorites((prev) => !prev);
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
        <button onClick={toggleShowFavorites}>
          <FontAwesomeIcon icon={solidStar} />
          {showFavorites ? " Hide Repo Favorites" : " Show Repo Favorites"}
        </button>
        <button onClick={toggleShowAllFavorites}>
          <FontAwesomeIcon icon={solidStar} />
          {showAllFavorites ? " Hide All Favorites" : " Show All Favorites"}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul className="commit-list">
        {showAllFavorites
          ? allFavoriteCommits.map((commit) => (
              <li key={commit.sha} className="commit-card">
                <a
                  href={`https://github.com/${commit.repository.owner.login}/${commit.repository.name}/commit/${commit.sha}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <strong>{commit.commit.message}</strong>
                  <p className="commit-author">
                    By: {commit.commit.author.name}
                  </p>
                  <p className="commit-date">
                    Date: {new Date(commit.commit.author.date).toLocaleString()}
                  </p>
                </a>
              </li>
            ))
          : showFavorites
          ? favorites.map(({ sha }) => {
              const favoriteCommit = commits.find(
                (commit) => commit.sha === sha
              );
              return favoriteCommit ? (
                <li key={favoriteCommit.sha} className="commit-card">
                  <strong>{favoriteCommit.commit.message}</strong>
                  <p className="commit-author">
                    By: {favoriteCommit.commit.author.name}
                  </p>
                  <p className="commit-date">
                    Date:{" "}
                    {new Date(
                      favoriteCommit.commit.author.date
                    ).toLocaleString()}
                  </p>
                </li>
              ) : null;
            })
          : commits.map((commit) => (
              <li key={commit.sha} className="commit-card">
                <div className="commit-content">
                  <div style={{ position: "relative" }}>
                    <FontAwesomeIcon
                      icon={
                        favorites.some(
                          (fav) =>
                            fav.sha === commit.sha &&
                            fav.owner === owner &&
                            fav.repo === repo
                        )
                          ? solidStar
                          : regularStar
                      }
                      onClick={() => toggleFavorite(commit.sha)}
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        top: "17px",
                        right: "10px",
                        color: favorites.some(
                          (fav) =>
                            fav.sha === commit.sha &&
                            fav.owner === owner &&
                            fav.repo === repo
                        )
                          ? "gold"
                          : "gray",
                      }}
                    />
                  </div>
                  <strong style={{ marginRight: "70px" }}>
                    {commit.commit.message}
                  </strong>
                  <p className="commit-author">
                    By: {commit.commit.author.name}
                  </p>
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
