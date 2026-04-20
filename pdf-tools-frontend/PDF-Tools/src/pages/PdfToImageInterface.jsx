import React, { useRef, useState } from "react";
import axios from "axios";
import CustomButton from "../component/Common/CustomButton";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const PdfToImageInterface = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleConvertAndDownload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${BASE_URL}/convert/pdf-to-image`,
        formData,
        {
          responseType: "blob", // important for ZIP files
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Create a Blob and download the ZIP
      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "converted_images.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Conversion error:", error);
      alert("Conversion failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="sm:w-full md:h-[580px] bg-[#BBD7FF] flex items-center justify-center">
      <div className="flex flex-col md:flex-row justify-end w-full mx-auto h-full bg-white shadow-2xs overflow-hidden">
        
        {/* Left Column */}
        <div className="w-full md:w-[60%] h-1/2 md:h-full p-6 flex flex-col items-start justify-start gap-8 bg-[#BBD7FF] shadow-2xs">
          <h2 className="text-2xl font-bold text-black">PDF File</h2>

          {/* Upload Preview Box */}
          <div
            className="relative w-40 h-56 md:w-40 bg-[#BBD7FF] border-2 border-dashed border-black rounded flex items-center justify-center text-sm font-semibold text-black shadow-inner"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{ cursor: "pointer" }}
          >
            <div className="w-full h-full rounded p-4">
              <div className="flex items-center w-full h-full bg-gray-300 px-2">
                {file ? (
                  <span className="text-black text-center px-2">{file.name}</span>
                ) : (
                  <span className="text-black text-center px-2">Here Will be File</span>
                )}
              </div>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
                ref={fileInputRef}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-[1px] bg-gray-300 shadow-md h-full"></div>

        {/* Right Column */}
        <div className="w-full md:w-[40%] h-1/2 md:h-full p-6 flex flex-col items-center gap-6 bg-gray-100">
          <h1 className="text-3xl font-bold text-black text-center">PDF to Image</h1>

          {/* Added File Section */}
          <div className="w-full max-w-sm">
            <h2 className="text-lg font-semibold text-black mb-4">File</h2>
            <div className="relative w-full h-10 bg-white border border-gray-400 rounded flex items-center justify-between px-4 text-sm font-medium shadow mb-4">
              {file ? file.name : "Select PDF"}
              {file && (
                <button
                  className="text-black hover:text-red-600 font-bold text-lg"
                  onClick={handleRemoveFile}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Download Button */}
          <CustomButton
            label={loading ? "Converting..." : "Convert and Download"}
            className="shadow-2xl rounded-2xl hover:bg-gray-200"
            onClick={handleConvertAndDownload}
            disabled={!file || loading}
          />
        </div>
      </div>
    </div>
  );
};

export default PdfToImageInterface;
