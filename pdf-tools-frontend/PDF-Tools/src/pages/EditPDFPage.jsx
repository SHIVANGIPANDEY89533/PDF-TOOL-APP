import React, { useRef, useState } from "react";
import axios from "axios";

// Example CustomButton component
const CustomButton = ({ label, onClick, disabled, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-2 bg-blue-500 text-white font-semibold ${className} disabled:opacity-50`}
  >
    {label}
  </button>
);

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000/api/v1";

const EditPDFPage = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [editType, setEditType] = useState('add-text');
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(50);
  const [xPos, setXPos] = useState(50);
  const [yPos, setYPos] = useState(50);
  const [rotation, setRotation] = useState(90);
  const [pages, setPages] = useState("all");
  const [watermarkText, setWatermarkText] = useState("DRAFT");
  const [watermarkFontSize, setWatermarkFontSize] = useState(50);
  const [watermarkColor, setWatermarkColor] = useState("#FF0000");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleConvertAndDownload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      let endpoint = "";
      if (editType === 'add-text') {
        endpoint = "/edit/add-text";
        formData.append("text", text);
        formData.append("font_size", fontSize);
        formData.append("x_pos", xPos);
        formData.append("y_pos", yPos);
      } else if (editType === 'rotate') {
        endpoint = "/edit/rotate";
        formData.append("rotation", rotation);
        formData.append("pages", pages);
      } else if (editType === 'compress') {
        endpoint = "/compress/pdf";
      } else if (editType === 'watermark') {
        endpoint = "/edit/watermark";
        formData.append("text", watermarkText);
        formData.append("font_size", watermarkFontSize);
        formData.append("color", watermarkColor);
      } else if (editType === 'page-numbers') {
        endpoint = "/edit/page-numbers";
        formData.append("position", "bottom-right");
        formData.append("start_number", 1);
        formData.append("font_size", 12);
        formData.append("color", "#000000");
      }

      const response = await axios.post(`${BASE_URL}${endpoint}`, formData, {
        responseType: "blob",
        headers: { "Content-Type": "multipart/form-data" },
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `edited_${file.name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Edit PDF error:", err);
      let message = "PDF editing failed. Please try again.";
      if (err.response) {
        try {
          const reader = new FileReader();
          reader.onload = () => {
            const text = reader.result;
            alert(text || message);
          };
          reader.readAsText(err.response.data);
          setLoading(false);
          return;
        } catch (readError) {
          console.error("Error reading edit error blob:", readError);
        }
      }
      alert(message);
    }
    setLoading(false);
  };

  return (
    <div className="sm:w-full md:h-[600px] bg-[#BBD7FF] flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl h-full bg-white shadow-lg rounded overflow-hidden">

        {/* Left Column: Upload & Inputs */}
        <div className="w-full md:w-2/3 p-6 flex flex-col gap-6 bg-[#BBD7FF]">
          <h2 className="text-2xl font-bold text-black">Upload PDF & Edit</h2>

          {/* File Upload */}
          <div
            className="relative w-full h-20 border-2 border-dashed border-black rounded flex items-center justify-center cursor-pointer bg-[#DDEFFF]"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            {file ? (
              <span className="text-black">{file.name}</span>
            ) : (
              <span className="text-gray-700 text-center">Click to upload PDF</span>
            )}
            <input
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {/* Edit Type Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Edit Type:</label>
            <select
              value={editType}
              onChange={(e) => setEditType(e.target.value)}
              className="px-4 py-2 border rounded"
            >
              <option value="add-text">Add Text</option>
              <option value="rotate">Rotate Pages</option>
              <option value="compress">Compress PDF</option>
              <option value="watermark">Add Watermark</option>
              <option value="page-numbers">Add Page Numbers</option>
            </select>
          </div>

          {/* Conditional Inputs */}
          {editType === 'add-text' && (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Text to add"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="px-4 py-2 border rounded w-full"
              />
              <input
                type="number"
                placeholder="Font Size"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="px-4 py-2 border rounded w-full"
              />
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="X Position"
                  value={xPos}
                  onChange={(e) => setXPos(Number(e.target.value))}
                  className="px-4 py-2 border rounded w-1/2"
                />
                <input
                  type="number"
                  placeholder="Y Position"
                  value={yPos}
                  onChange={(e) => setYPos(Number(e.target.value))}
                  className="px-4 py-2 border rounded w-1/2"
                />
              </div>
            </div>
          )}

          {editType === 'rotate' && (
            <div className="flex flex-col gap-4">
              <input
                type="number"
                placeholder="Rotation (degrees)"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="px-4 py-2 border rounded w-full"
              />
              <input
                type="text"
                placeholder="Pages (e.g., 1,2,3 or all)"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                className="px-4 py-2 border rounded w-full"
              />
            </div>
          )}

          {editType === 'watermark' && (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Watermark Text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="px-4 py-2 border rounded w-full"
              />
              <input
                type="number"
                placeholder="Font Size"
                value={watermarkFontSize}
                onChange={(e) => setWatermarkFontSize(Number(e.target.value))}
                className="px-4 py-2 border rounded w-full"
              />
              <input
                type="color"
                value={watermarkColor}
                onChange={(e) => setWatermarkColor(e.target.value)}
                className="px-4 py-2 border rounded w-full"
              />
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden md:block w-[1px] bg-gray-300"></div>

        {/* Right Column: Convert & Download */}
        <div className="w-full md:w-1/3 p-6 flex flex-col items-center justify-center gap-6 bg-gray-100">
          <h1 className="text-3xl font-bold text-black text-center">Edit PDF</h1>
          <CustomButton
            label={loading ? "Processing..." : "Edit & Download"}
            onClick={handleConvertAndDownload}
            disabled={!file || loading}
            className="shadow-2xl rounded-2xl hover:bg-gray-200"
          />
        </div>
      </div>
    </div>
  );
};

export default EditPDFPage;
