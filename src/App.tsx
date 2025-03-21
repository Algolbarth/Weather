import React, { useState } from "react";

const App: React.FC = () => {
  const [darkMode, set_darkMode] = useState(false);

  return (
    <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: darkMode ? "#222" : "#fff", color: darkMode ? "#fff" : "#000" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>Météo en temps réel</h1>
    </div>
  );
};

export default App;
