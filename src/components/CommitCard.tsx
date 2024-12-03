import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStar as regularStar,
} from "@fortawesome/free-solid-svg-icons";

interface CommitCardProps {
  commitMessage: string;
  authorName: string;
  isFavorite: boolean;
  onToggleFavorite: (sha: string) => void;
  owner: string;
  repo: string;
  sha: string;
  date: string;
  url: string;
}

const CommitCard: React.FC<CommitCardProps> = ({
  commitMessage,
  authorName,
  isFavorite,
  onToggleFavorite,
  owner,
  repo,
  sha,
  date,
  url
}) => {
  return (
    <li className="commit-card">
      <div className="commit-content">
        <div style={{ position: "relative" }}>
          <FontAwesomeIcon
            icon={isFavorite ? solidStar : regularStar}
            onClick={() => onToggleFavorite(sha)}
            style={{
              cursor: "pointer",
              position: "absolute",
              top: "17px",
              right: "10px",
              color: isFavorite ? "black" : "gray",
            }}
          />
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "black" }}
        >
          <strong style={{ marginRight: "70px" }}>{commitMessage}</strong>
        </a>
        <p className="commit-author">By: {authorName}</p>
        <p className="commit-author">Owner: {owner}</p>
        <p className="commit-author">Repo: {repo}</p>
        <p className="commit-date">Date: {new Date(date).toLocaleString()}</p>
      </div>
    </li>
  );
};

export default CommitCard;
