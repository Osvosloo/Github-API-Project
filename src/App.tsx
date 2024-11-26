import React from "react";
import GitHubRepoFetcher from "./components/RepoFetcher";
import "./styles/styles.css";

const App: React.FC = () => {
  return (
    <div>
      <GitHubRepoFetcher />
    </div>
  );
};

export default App;
