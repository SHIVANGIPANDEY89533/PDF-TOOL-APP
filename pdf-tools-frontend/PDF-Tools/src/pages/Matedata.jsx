// src/pages/Matedata.jsx
import React, { useState, useRef } from "react";
import axios from "axios";
import CustomButton from "../component/Common/CustomButton";
import { jsPDF } from "jspdf"; // ✅ install via npm: npm i jspdf

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000/api/v1";

const Matedata = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleExtractText = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`${BASE_URL}/extract-text`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data);
    } catch (err) {
      console.error(err);
      alert("Extraction failed. Make sure the file is a valid PDF.");
    }
    setLoading(false);
  };

  const handleDownloadPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    doc.setFontSize(12);

    doc.text(`Extracted Text from PDF: ${file.name}`, 10, 10);
    let yOffset = 20;

    result.pages.forEach((page, index) => {
      const lines = doc.splitTextToSize(page.text || "No text found", 180);
      doc.text(`Page ${page.page}:`, 10, yOffset);
      yOffset += 6;
      lines.forEach((line) => {
        if (yOffset > 280) { // start new page
          doc.addPage();
          yOffset = 10;
        }
        doc.text(line, 10, yOffset);
        yOffset += 6;
      });
      yOffset += 10;
    });

    doc.save(`${file.name.replace(".pdf", "_extracted.pdf")}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F0F7FF] p-6">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-3xl p-6 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center text-black mb-4">
          PDF Text Extractor
        </h1>

        {/* Upload Section */}
        <div
          className="relative w-full h-40 border-2 border-dashed border-gray-400 rounded flex items-center justify-center cursor-pointer"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <input
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {file ? (
            <span className="text-black font-medium">{file.name}</span>
          ) : (
            <span className="text-gray-500 text-center">
              Click to upload a PDF
            </span>
          )}
        </div>

        {/* Extract Button */}
        <div className="flex justify-center gap-4">
          <CustomButton
            label={loading ? "Extracting..." : "Extract Text"}
            onClick={handleExtractText}
            disabled={!file || loading}
            className="px-4 py-2 rounded-xl shadow-md"
          />
          {result && (
            <CustomButton
              label="Download as PDF"
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-xl shadow-md bg-green-500 text-white"
            />
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
            <h2 className="font-semibold text-lg mb-2">Extracted Text:</h2>
            <p className="text-black mb-2">
              <span className="font-bold">Total Pages: </span>
              {result.pages.length}
            </p>
            {result.pages.map((page) => (
              <div key={page.page} className="mb-4">
                <h3 className="font-semibold">Page {page.page}:</h3>
                <pre className="text-sm whitespace-pre-wrap">{page.text || "No text found"}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matedata;
