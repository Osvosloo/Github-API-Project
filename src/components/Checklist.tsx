// src/Checklist.tsx
import React, { useState } from "react";
import "../styles/checklist.css";
import { fetchUser } from "../api/githubAPI";
import { GitHubUser } from "../types"; // Import the GitHubUser  type

interface ChecklistProps {
  selectedFields: string[];
  onFieldToggle: (field: string) => void;
}

const Checklist: React.FC<ChecklistProps> = ({
  selectedFields,
  onFieldToggle,
}) => {
  const [userData, setUserData] = useState<GitHubUser | null>(null); // Change type to GitHubUser  | null
  const [username, setUsername] = useState<string>(""); // State for username input

  const handleLoadInformation = async () => {
    if (username) {
      try {
        const data = await fetchUser(username); // Fetch user data with the input username
        console.log(data);
        setUserData(data); // Set the user data
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null); // Handle errors (e.g., user not found)
      }
    }
  };

  const renderChecklist = () => {
    if (!userData) return null;

    const fields = Object.keys(userData); // Dynamically get fields from userData

    return (
      <div style={{ maxHeight: "100px", overflowY: "scroll" }}>
        {fields.map((field) => (
          <div key={field}>
            <input
              type="checkbox"
              checked={selectedFields.includes(field)}
              onChange={() => onFieldToggle(field)} // Use the prop function to toggle
            />
            <label>{field}</label>
          </div>
        ))}
      </div>
    );
  };

  const renderSelectedData = () => {
    if (!userData) return null;

    return selectedFields.map((field) => (
      <div key={field}>
        <strong>{field}:</strong>{" "}
        {typeof userData[field as keyof GitHubUser] === "string"
          ? userData[field as keyof GitHubUser]
          : String(userData[field as keyof GitHubUser])}{" "}
      </div>
    ));
  };

  return (
    <div className="checklist-container">
      <h2>GitHub User Data Checklist</h2>
      <div className="input-button-container">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update the username state on input change
          placeholder="Enter GitHub username"
          required
        />
        <button onClick={handleLoadInformation} style={{ marginLeft: "10px" }}>
          Load Information
        </button>
      </div>
      {renderChecklist()}
      {userData && <div>{renderSelectedData()}</div>}{" "}
      {/* Render selected data if userData is available */}
    </div>
  );
};

export default Checklist;
