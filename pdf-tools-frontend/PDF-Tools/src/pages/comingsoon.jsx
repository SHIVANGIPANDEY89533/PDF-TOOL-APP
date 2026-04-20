import React from "react";
import Navbar from "../component/Common/Navbar";
 // Optional

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      

      {/* Main content */}
      <main className="flex-grow bg-secondary px-6 py-16 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 text-black">Coming Soon</h1>
        <p className="text-lg text-black text-center max-w-xl">
          Powerful new PDF tools are on the way to enhance your experience.
        </p>

        
      </main>

      {/* Footer */}
      
    </div>
  );
};

export default ComingSoon;
