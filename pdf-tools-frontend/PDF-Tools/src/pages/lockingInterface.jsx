import React, { useState } from "react";
import axios from "axios";
import CustomButton from "../component/Common/CustomButton";
const BASE_URL = import.meta.env.VITE_BASE_URL 

const LockingInterface = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleDownload = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }
    if (!password || !confirmPassword) {
      alert("Please enter and confirm your password");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);

      const response = await axios.post(
         `${BASE_URL}/lock-pdf`,
        formData,
        { responseType: "blob" }
      );

      // Download the locked file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "locked.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error locking PDF:", error);
      alert("Failed to lock PDF. Please try again.");
    }
  };

  return (
    <div className="sm:w-full md:h-[580px] bg-[#BBD7FF] flex items-center justify-center">
      <div className="flex flex-col md:flex-row justify-end w-full mx-auto h-full bg-white shadow-2xs overflow-hidden">

        {/* Left Column */}
        <div className="w-full md:w-[60%] h-1/2 md:h-full p-6 flex flex-col items-start justify-start gap-8 bg-[#BBD7FF] shadow-2xs">
          <h2 className="text-2xl font-bold text-black">PDF File </h2>

          {/* Upload Preview Box */}
          <div className="relative w-40 h-56 md:w-[40] bg-[#BBD7FF] border-2 border-dashed border-black rounded flex items-center justify-center text-sm font-semibold text-black shadow-inner">
            <div className="w-full h-full rounded p-4">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full h-full opacity-0 absolute cursor-pointer"
                style={{ top: 0, left: 0 }}
              />
              <div className="flex items-center w-full h-full bg-gray-300 px-2">
                {file ? file.name : "Here Will be File"}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-[1px] bg-gray-300 shadow-md h-full"></div>

        {/* Right Column */}
        <div className="w-full md:w-[40%] h-1/2 md:h-full p-6 flex flex-col items-center gap-6 bg-gray-100">
          <h1 className="text-3xl font-bold text-black text-center">Lock PDF</h1>

          {/* Added File Section */}
          <div className="w-full max-w-sm">

            {/* Type Password Box */}
            <div className="relative w-full h-10 bg-white border border-gray-400 rounded flex items-center gap-2 px-4 text-sm font-medium shadow mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c.552 0 1 .448 1 1v2a1 1 0 11-2 0v-2c0-.552.448-1 1-1z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 11V7a5 5 0 00-10 0v4H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2h-2zM7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                type="password"
                placeholder="Type Password"
                className="flex-1 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Re-Enter Password Box */}
            <div className="relative w-full h-10 bg-white border border-gray-400 rounded flex items-center gap-2 px-4 text-sm font-medium shadow mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c.552 0 1 .448 1 1v2a1 1 0 11-2 0v-2c0-.552.448-1 1-1z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 11V7a5 5 0 00-10 0v4H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2h-2zM7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                type="password"
                placeholder="Re-Enter Password"
                className="flex-1 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

          </div>

          {/* Download Button */}
          <CustomButton
            label="Download"
            onClick={handleDownload}
            className="shadow-2xl rounded-2xl hover:bg-gray-200  w-3xs"
          />
        </div>
      </div>
    </div>
  );
};

export default LockingInterface;
