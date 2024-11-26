// src/App.tsx
import React from "react";
import GitHubRepoFetcher from "./components/RepoFetcher";
// import Checklist from "./components/Checklist"; // Import the Checklist component
import "./styles/styles.css";

const App: React.FC = () => {
  // const [selectedFields, setSelectedFields] = useState<string[]>([]);

  // const handleFieldToggle = (field: string) => {
  //   setSelectedFields((prev) =>
  //     prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
  //   );
  // };

  return (
    <div>
      <GitHubRepoFetcher />
      {/* <h1>GitHub User Info Fetcher</h1> */}
      {/* <Checklist
        selectedFields={selectedFields}
        onFieldToggle={handleFieldToggle}
      /> */}
    </div>
  );
};

export default App;
