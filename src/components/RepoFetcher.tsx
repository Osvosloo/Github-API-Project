import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchModal from "./SearchModal";
import CommitCard from "./CommitCard"; // Import the CommitCard component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faStar as solidStar,
} from "@fortawesome/free-solid-svg-icons";
// import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import "../styles/repoFetcher.css";

const GitHubRepoFetcher: React.FC = () => {
  const [owner, setOwner] = useState<string>("");
  const [repo, setRepo] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [commits, setCommits] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [favorites, setFavorites] = useState<any[]>([]); // Use any for now, can be refined later
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [showAllFavorites, setShowAllFavorites] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allFavoriteCommits, setAllFavoriteCommits] = useState<any[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      try {
        const parsedFavorites = JSON.parse(storedFavorites);
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
    }
  }, []);

  const saveFavorites = async () => {
    console.log(`saving favorites: ${favorites}`);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  const fetchCommits = async () => {
    setCommits([]);
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
    setShowAllFavorites(false);
    setShowFavorites(false);
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
        return prevFavorites.filter(
          (favorite) =>
            !(
              favorite.sha === sha &&
              favorite.owner === owner &&
              favorite.repo === repo
            )
        );
      } else {
        return [
          ...prevFavorites,
          { owner, repo, sha, commitMessage: "", authorName: "", date: "" },
        ];
      }
    });
    saveFavorites();
  };

  const toggleShowFavorites = () => {
    console.log(favorites);
    setShowAllFavorites(false);
    if (owner && repo) {
      setShowFavorites((prev) => !prev);
    }
  };

  const fetchAllFavoriteCommits = async () => {
    setShowFavorites(false);
    const allCommits = [];
    for (const favorite of favorites) {
      const { owner, repo, sha } = favorite;
      if (owner && repo && sha) {
        try {
          const response = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`
          );
          const { commit } = response.data;
          allCommits.push({
            sha,
            commitMessage: commit.message,
            authorName: commit.author.name,
            date: commit.author.date,
          });
        } catch (err) {
          console.error(`Failed to fetch commit with SHA: ${sha}`, err);
        }
      }
    }
    setAllFavoriteCommits(allCommits);
  };

  const toggleShowAllFavorites = () => {
    if (!showAllFavorites) {
      fetchAllFavoriteCommits();
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
              <CommitCard
                key={commit.sha}
                commitMessage={commit.commitMessage}
                authorName={commit.authorName}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
                owner={owner}
                repo={repo}
                sha={commit.sha}
                date={commit.date}
              />
            ))
          : showFavorites
          ? favorites.map(({ sha }) => {
              const favoriteCommit = commits.find(
                (commit) => commit.sha === sha
              );
              return favoriteCommit ? (
                <CommitCard
                  key={favoriteCommit.sha}
                  commitMessage={favoriteCommit.commit.message}
                  authorName={favoriteCommit.commit.author.name}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                  owner={owner}
                  repo={repo}
                  sha={favoriteCommit.sha}
                  date={favoriteCommit.commit.author.date}
                />
              ) : null;
            })
          : commits.map((commit) => (
              <CommitCard
                key={commit.sha}
                commitMessage={commit.commit.message}
                authorName={commit.commit.author.name}
                isFavorite={favorites.some(
                  (fav) =>
                    fav.sha === commit.sha &&
                    fav.owner === owner &&
                    fav.repo === repo
                )}
                onToggleFavorite={toggleFavorite}
                owner={owner}
                repo={repo}
                sha={commit.sha}
                date={commit.commit.author.date}
              />
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
