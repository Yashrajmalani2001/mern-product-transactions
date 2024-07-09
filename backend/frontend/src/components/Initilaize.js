
import React from "react";
import axios from "axios";

const Initialize = () => {
  const initializeDatabase = async () => {
    try {
      const response = await axios.get("http://localhost:3000/initialize");
      alert(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={initializeDatabase}>Initialize Database</button>
    </div>
  );
};

export default Initialize;
