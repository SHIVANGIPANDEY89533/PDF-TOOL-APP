import React, { useRef, useState } from 'react';
import axios from "axios";
import CustomButton from "../component/Common/CustomButton";
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000/api/v1";

console.log("MergeInterface API base URL:", BASE_URL);

const MergeInterface = () => {
  const [files, setFiles] = useState([null, null]); // Support multiple files
  const [loading, setLoading] = useState(false);
  const [mergedPDF, setMergedPDF] = useState(null);
  const fileInputRefs = useRef([React.createRef(), React.createRef()]);

  // Add one more file input
  const handleAddFile = () => {
    setFiles([...files, null]);
    fileInputRefs.current.push(React.createRef());
  };

  const handleFileChange = (idx, e) => {
    const newFiles = [...files];
    newFiles[idx] = e.target.files[0];
    setFiles(newFiles);
  };

  const handleRemoveFile = (idx) => {
    const newFiles = [...files];
    newFiles[idx] = null;
    setFiles(newFiles);
  };

  const handleMergeAndDownload = async () => {
    if (files.filter(Boolean).length < 2) return;
    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        if (file) formData.append("files", file);
      });

      const response = await axios.post(
        `${BASE_URL}/mergePDF`,
        formData,
        {
          responseType: "blob"
        }
      );

      // Only handle direct download (remove logic)
      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('application/json')) {
        const text = await response.data.text();
        const data = JSON.parse(text);
        if (data.download_url) {
          window.open(data.download_url, "_blank");
        } else {
          alert("No download link found!");
        }
      } else {
        setMergedPDF(response.data);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "merged.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      const serverMsg = error?.response?.data?.detail || error?.response?.data?.message || error?.message;
      alert(`Merge failed. ${serverMsg}`);
      console.error("Merge error", error);
    }
    setLoading(false);
  };

  const handleSplit = async () => {
    if (!mergedPDF) {
      alert("Please merge PDFs first!");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", mergedPDF, "merged.pdf");

      const response = await axios.post(
        `${BASE_URL}/splitPDF`,
        formData,
        {
          responseType: "blob"
        }
      );

      // Only handle direct download (remove logic)
      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('application/json')) {
        const text = await response.data.text();
        const data = JSON.parse(text);
        if (data.download_url) {
          window.open(data.download_url, "_blank");
        } else {
          alert("No download link found!");
        }
      } else {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "split.zip");
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      alert("Split failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="w-screen min-h-screen bg-[#BBD7FF] flex items-center justify-center m-0 p-0">
      <div className="flex flex-col md:flex-row w-full min-h-full bg-white border-[6px] border-[#BBD7FF] shadow-2xs overflow-hidden">
        {/* Left Column */}
        <div className="w-full md:w-[60%] h-full md:h-full p-6 flex flex-col items-center justify-center gap-8 bg-[#BBD7FF] shadow-2xs">
          <div className="flex items-end gap-4 flex-wrap justify-center">
            {files.map((file, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center gap-2">
                  <h3 className="text-base font-semibold text-black">{`PDF ${idx + 1}`}</h3>
                  <div
                    className="relative w-40 h-56 bg-[#BBD7FF] border-2 border-dashed border-black shadow flex items-center justify-center text-sm font-medium p-4 cursor-pointer"
                    onClick={() => fileInputRefs.current[idx].current && fileInputRefs.current[idx].current.click()}
                  >
                    <div className="bg-gray-300 w-full h-full flex items-center justify-center rounded p-4">
                      <span className="text-black text-center px-4">
                        {file ? file.name : `Here will be page ${idx + 1}`}
                      </span>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(idx, e)}
                        style={{ display: "none" }}
                        ref={fileInputRefs.current[idx]}
                      />
                    </div>
                  </div>
                </div>
                {idx < files.length - 1 && (
                  <span className="text-4xl font-bold text-[#2C5E7A] mb-14">+</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <div
            className="w-40 h-56 bg-[#E0ECFF] border-2 border-dashed border-black rounded flex items-center justify-center text-sm font-semibold text-black hover:bg-blue-300 cursor-pointer transition"
            onClick={handleAddFile}
          >
            + Add One More PDF
          </div>
        </div>

        <div className="w-full md:w-[1px] h-[1px] md:h-full bg-gray-300 shadow-md"></div>

        {/* Right Column */}
        <div className="w-full md:w-[40%] h-full md:h-full p-6 flex flex-col items-center gap-6 bg-gray-100">
      
          <h1 className="text-3xl font-bold text-black text-center">Merge</h1>

          <div className="w-full max-w-sm">
            <h2 className="text-lg font-semibold text-black mb-4">ADDED PDFs</h2>
            {files.map((file, idx) => (
              <div key={idx} className="relative mb-4 w-full h-10 bg-white border border-gray-400 rounded flex items-center justify-between px-4 text-sm font-medium shadow">
                {file ? file.name : `PDF ${idx + 1}`}
                {file && (
                  <button className="text-black hover:text-black-600 font-bold text-lg" onClick={() => handleRemoveFile(idx)}>×</button>
                )}
              </div>
            ))}
          </div>
             <div className="flex gap-4">
            <button
              className="px-6 py-2 bg-gray-100 text-gray-700 border-1 border-gray-800 rounded-4xl hover:bg-gray-200 transition"
              onClick={handleMergeAndDownload}
              disabled={files.filter(Boolean).length < 2 || loading}
            >
              {loading ? "Merging..." : "Merge"}
            </button>
            {/* <button
              className="px-6 py-2 bg-blue-500 text-white rounded-4xl hover:bg-blue-600 transition"
              onClick={handleSplit}
              disabled={!mergedPDF || loading}
            >
              Split
            </button> */}
          </div>

          {/* <CustomButton
            label='Download Merge PDF'
            className="shadow-2xl rounded-2xl hover:bg-gray-200 "
            onClick={handleMergeAndDownload}
            disabled={files.filter(Boolean).length < 2 || loading}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default MergeInterface;
