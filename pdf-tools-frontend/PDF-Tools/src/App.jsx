import React, { useEffect } from "react";
import axios from "axios";
import Approutes from "../src/routes/Approutes";

// ✅ Read backend URL from environment variable
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000/api/v1";

const App = () => {
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/welcome`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

       
      } catch (error) {
        
      }
    };

    checkBackend();
  }, []);

  return (
    <div>
      <Approutes />
    </div>
  );
};

export default App;
