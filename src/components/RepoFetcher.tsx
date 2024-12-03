import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchModal from "./SearchModal";
import CommitCard from "./CommitCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faStar as solidStar,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/repoFetcher.css";
import { ClipLoader } from "react-spinners";
import { GitHubCommit, favorite } from "../types";

const GitHubRepoFetcher: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [owner, setOwner] = useState<string>("");
  const [repo, setRepo] = useState<string>("");
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<favorite[]>([]); 
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [showAllFavorites, setShowAllFavorites] = useState<boolean>(false);
  const [allFavoriteCommits, setAllFavoriteCommits] = useState<favorite[]>([]);

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
        alert(`Error parsing favorites from localStorage ${error}`);

        setFavorites([]);
      }
    }
  }, []);

//   const saveFavorites = async () => {
//     console.log(`saving favorites: ${favorites}`);
//     localStorage.setItem("favorites", JSON.stringify(favorites));
//   };

  const fetchCommits = async () => {
    if (!owner || !repo) {
      alert("Fill in both inputs");
      return;
    }
    setCommits([]);
    setError("");
    setShowFavorites(false);
    setShowAllFavorites(false);
    setIsLoading(true);
    try {
      if (owner && repo) {
        const response = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/commits`
        );
        setCommits(response.data);
        console.log("commits", JSON.stringify(response.data))
      }
      
    } catch (err) {
      alert(`error: ${err}`);
      setError(`error: ${err}`);
    } finally {
      setIsLoading(false);
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
          favorite.sha === sha 
      );

      if (existingFavorite) {
        return prevFavorites.filter(
          (favorite) =>
            !(
              favorite.sha === sha  )
        );
      } else {
        return [
            ...prevFavorites,
            { owner, repo, sha, commitMessage: "", authorName: "", date: "", url:"" },
          ];
      }
    });
  };

  const toggleShowFavorites = () => {
    console.log(favorites);
    if (!owner || !repo) {
      alert("Please fill in both inputs");
      return;
    }
    setShowAllFavorites(false);
      setShowFavorites((prev) => !prev)
  };

  const fetchAllFavoriteCommits = async () => {
    setShowFavorites(false);
    const allCommits = [];
    setIsLoading(true);

    for (const favorite of favorites) {
      const { owner, repo, sha } = favorite;
      if (owner && repo && sha) {
        try {
          const response = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`
          );
          const { commit, html_url } = response.data;
          allCommits.push({
            sha,
            owner: owner,
            repo: repo,
            commitMessage: commit.message,
            authorName: commit.author.name,
            date: commit.author.date,
            url: html_url
          });
          console.log("Show all commits: ", JSON.stringify(allCommits))
        } catch (err) {
          alert(err);
          console.error(`Failed to fetch commit with SHA: ${sha}`, err);
          break;
        }
      }
    }
    setAllFavoriteCommits(allCommits);
    setIsLoading(false);
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
          required
        />
        <input
          type="text"
          placeholder="Repository"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          required
        />
      </div>

      <div className="button-container">
        <button onClick={fetchCommits}>Fetch Commits</button>
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

      {isLoading ? (
        <div className="spinner-container">
          <ClipLoader color="#3939a5" loading={isLoading} size={50} />
        </div>
      ) : (
        <div>
          {showAllFavorites && allFavoriteCommits.length === 0 && (
            <p>You have no favorite commits</p>
          )}
          {showFavorites && favorites.length === 0 && (
            <p>
              No favorite commits for this repository. ({owner}-{repo})
            </p>
          )}
          <ul className="commit-list">
            {showAllFavorites
              ? allFavoriteCommits.map((commit) => (
                  <CommitCard
                    key={commit.sha}
                    commitMessage={commit.commitMessage}
                    authorName={commit.authorName}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                    owner={commit.owner}
                    repo={commit.repo}
                    sha={commit.sha}
                    date={commit.date}
                    url={commit.url}
                  />
                ))
              : showFavorites //for specific repo
              ? (() => {
                const filteredFavorites = favorites.filter(
                  (favorite) => favorite.owner === owner && favorite.repo === repo
                );

                // Check if there are favorites for specific repo
                if (filteredFavorites.length === 0) {
                  return <p>No favorite commits for this repository. ({owner}-{repo})</p>;
                }

                return filteredFavorites.map(({ sha }) => {
                  const favoriteCommit = commits.find((commit) => commit.sha === sha);
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
                      url={favoriteCommit.html_url}
                    />
                  ) : null;
                });
              })()
              : commits ? commits.map((commit) => ( //commits that were fetched from github-api
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
                    url={commit.html_url}
                  />
                )) : `No commits found`}
          </ul>
        </div>
      )}

      <SearchModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default GitHubRepoFetcher;
