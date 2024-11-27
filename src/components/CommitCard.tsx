import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStar as regularStar,
} from "@fortawesome/free-solid-svg-icons";

interface CommitCardProps {
  commitMessage: string; // Changed to commitMessage for clarity
  authorName: string; // Added authorName prop
  isFavorite: boolean;
  onToggleFavorite: (sha: string) => void;
  owner: string;
  repo: string;
  sha: string;
  date: string; // Changed to string for consistency with API response
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
              color: isFavorite ? "gold" : "gray",
            }}
          />
        </div>
        <a
          href={`https://github.com/${owner}/${repo}/commit/${sha}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "black" }}
        >
          <strong style={{ marginRight: "70px" }}>{commitMessage}</strong>
        </a>
        <p className="commit-author">By: {authorName}</p>
        <p className="commit-date">Date: {new Date(date).toLocaleString()}</p>
      </div>
    </li>
  );
};

export default CommitCard;
