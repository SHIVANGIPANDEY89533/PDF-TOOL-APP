import React, { useState, useRef } from "react";
import CustomButton from "../component/Common/CustomButton";
const BASE_URL = import.meta.env.VITE_BASE_URL 
const Unlockinginterface = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState("");  // NEW STATE
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log("File selected:", event.target.files[0]);
  };

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDownload = async () => {
    if (!selectedFile) {
      alert("Please select a PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("password", password);  // NEW: Send password

    try {
      const response = await fetch(`${BASE_URL}/unlock-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + errorData.detail);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "unlocked.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error unlocking PDF:", error);
      alert("Failed to unlock PDF.");
    }
  };

  return (
    <div className="sm:w-full  md:h-[580px]  bg-[#BBD7FF] flex items-center justify-center ">
      <div className="flex flex-col  md:flex-row justify-end w-full mx-auto h-full bg-white shadow-2xs overflow-hidden">
        
        {/* Left Column */}
        <div className="w-full md:w-[60%] h-1/2 md:h-full p-6 flex flex-col items-start justify-start gap-8 bg-[#BBD7FF] shadow-2xs">
          <h2 className="text-2xl font-bold text-black">PDF File </h2>

          <div 
            className="relative w-40 h-56 md:w-[40]  bg-[#BBD7FF] border-2 border-dashed border-black rounded flex items-center justify-center text-sm font-semibold text-black shadow-inner cursor-pointer"
            onClick={handleBoxClick}
          >
            <div className="w-full h-full rounded   p-4">
              <div className="flex items-center w-full h-full bg-gray-300 px-2">
                {selectedFile ? selectedFile.name : "Here Will be File"}
              </div>
            </div>
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-[1px] bg-gray-300 shadow-md h-full"></div>

        {/* Right Column */}
        <div className="w-full md:w-[40%] h-1/2 md:h-full p-6 flex flex-col items-center gap-6 bg-gray-100">
          <h1 className="text-3xl font-bold text-black text-center">UnLock PDF</h1>

          <div className="w-full max-w-sm">
            <h2 className="text-lg font-semibold text-black mb-4">
              Just press Download Button<span> You Will have a PDF with removed Password </span>
            </h2>
          </div>

          {/* NEW: Password Input */}
          <input 
            type="password" 
            placeholder="Enter PDF Password"
            className="border border-gray-400 rounded p-2 w-full max-w-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <CustomButton
            label="Download Unlock PDF"
            className=" shadow-2xl rounded-2xl hover:bg-gray-200 "
            onClick={handleDownload}
          />
        </div>
      </div>
    </div>
  );
};

export default Unlockinginterface;
