import React, { useState } from "react";
import SortUpIcon from "/public/assests/sort_up.png";
import SortDownIcon from "/public/assests/sort_down.png";
import { FaTrash } from "react-icons/fa";
import CustomButton from "../component/Common/CustomButton";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000/api/v1";

function RightSection() {
  const [pdf1, setPdf1] = useState(null);
  const [pdf2, setPdf2] = useState(null);
  const [pdf1Name, setPdf1Name] = useState("");
  const [pdf2Name, setPdf2Name] = useState("");
  const [pages, setPages] = useState([]); // {id, previewUrl, pageNumber, source:'pdf1'|'pdf2'}

  // Upload PDF 1 or PDF 2 depending on box clicked
  const handleFileUpload = async (e, source) => {
    const file = e.target.files[0];
    if (!file) return;
    const sourceIndex = source === "pdf1" ? 0 : 1;
    if (source === "pdf1") {
      setPdf1(file);
      setPdf1Name(file.name);
    } else {
      setPdf2(file);
      setPdf2Name(file.name);
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/upload-pdf-preview`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json(); // {pages:[{id,previewUrl,pageNumber},...]}
      const newPages = (data.pages || []).map((p) => ({ ...p, source, sourceIndex }));
      setPages((prev) => [...prev, ...newPages]);
    } catch (err) {
      console.error("Error uploading PDF:", err);
    }
  };

  const removePage = (id) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  const swapPages = (index1, index2) => {
    setPages((prev) => {
      const updated = [...prev];
      const temp = updated[index1];
      updated[index1] = updated[index2];
      updated[index2] = temp;
      return updated;
    });
  };

  // Swap uploaded files if no pages are loaded yet
  const swapFiles = () => {
    const tempPdf = pdf1;
    const tempName = pdf1Name;
    setPdf1(pdf2);
    setPdf1Name(pdf2Name);
    setPdf2(tempPdf);
    setPdf2Name(tempName);
  };

const organisedPDF = async () => {
  try {
    const formData = new FormData();
    if (pdf1) formData.append("files", pdf1);
    if (pdf2) formData.append("files", pdf2);

    formData.append(
      "order",
      JSON.stringify(pages.map((p) => ({
        pageNumber: p.pageNumber,
        sourceIndex: p.sourceIndex, // ✅ index
      })))
    );

    const res = await fetch(`${BASE_URL}/reorganize-pdfs-download`, {
      method: "POST",
      body: formData,
    });

    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType.includes("application/pdf")) {
      const errMsg = await res.text();
      throw new Error(errMsg || "Failed to generate PDF");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Reorganized.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error("Error reorganizing PDF:", err);
    alert("Failed to generate reorganized PDF");
  }
};



  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen ">
      {/* Left Section */}
      <div className="bg-blue-200 p-6 md:p-9 w-full md:w-1/2 flex flex-col gap-10 items-center shadow-[0_-4px_10px_rgba(2,3,4,5.1)] z-10">
        {pages.length === 0 ? (
          <>
            {/* Page 1 Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-4 relative ml-5wh0">
              <div className="flex flex-col items-center gap-2 sm:-ml-46 relative">
                <p className="font-semibold text-lg">Page 1</p>
                <FaTrash className="absolute top-9 -left-6 text-black-600 cursor-pointer z-10" />
                <div
                  className="relative border-2 border-dashed border-black-600 p-4 w-40 min-h-[12rem] bg-secondary flex items-center justify-center cursor-pointer"
                  onClick={() => document.getElementById("pdf1Upload").click()}
                >
                  <div className="bg-[#D9D9D9] w-40 h-45 flex items-center justify-center text-sm text-gray-600 p-2 text-center">
                    {pdf1Name || "Upload PDF 1"}
                  </div>
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileUpload(e, "pdf1")}
                  className="hidden"
                  id="pdf1Upload"
                />
              </div>
              <img
                src={SortUpIcon}
                alt="Arrow Icon"
                className="w-10 h-10 ml-50 sm:w-20 sm:h-20 mt-2 sm:mt-6 cursor-pointer"
                title="Swap files"
                onClick={swapFiles}
              />
            </div>

            {/* Page 2 Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-4 relative">
              <div className="flex flex-col items-center gap-2 sm:ml-4 relative">
                <p className="font-semibold text-lg">Page 2</p>
                <FaTrash className="absolute top-9 -left-6 text-black-600 cursor-pointer z-10" />
                <div
                  className="relative border-2 border-dashed border-black-600 p-4 w-40 min-h-[12rem] bg-secondary flex items-center justify-center cursor-pointer"
                  onClick={() => document.getElementById("pdf2Upload").click()}
                >
                  <div className="bg-[#D9D9D9] w-40 h-45 flex items-center justify-center text-sm text-gray-600 p-2 text-center">
                    {pdf2Name || "Upload PDF 2"}
                  </div>
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileUpload(e, "pdf2")}
                  className="hidden"
                  id="pdf2Upload"
                />
              </div>
              <img
                src={SortDownIcon}
                alt="Arrow Icon"
                className="w-10 h-10 ml-50 sm:w-20 sm:h-20 mt-2 sm:mt-6 cursor-pointer"
                title="Swap files"
                onClick={swapFiles}
              />
            </div>
          </>
        ) : (
          // Show uploaded pages
          pages.map((p, index) => (
            <div
              key={p.id}
              className="flex flex-col sm:flex-row items-center gap-4 relative"
            >
              <div className="flex flex-col items-center gap-2 relative">
                <p className="font-semibold text-lg">
                  Page {p.pageNumber} ({p.source})
                </p>
                <FaTrash
                  className="absolute top-9 -left-6 text-black-600 cursor-pointer z-10"
                  onClick={() => removePage(p.id)}
                />
                <div className="relative border-2 border-dashed border-black-600 p-4 w-40 min-h-[12rem] bg-secondary flex items-center justify-center">
                  <img
                    src={p.previewUrl}
                    alt={`Page ${p.pageNumber}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {index < pages.length - 1 && (
                <img
                  src={SortDownIcon}
                  alt="Arrow Icon"
                  className="w-10 h-10 ml-50 sm:w-20 sm:h-20 mt-2 sm:mt-6 cursor-pointer"
                  onClick={() => swapPages(index, index + 1)}
                  title="Swap with next page"
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 bg-white p-6 flex flex-col items-end justify-start gap-6 shadow-[0_-4px_10px_rgba(0,1,1,1.1)] z-10 ">
        <h1 className="text-6xl font-bold text-center  w-full">Re-organize</h1>
        <CustomButton
          label="Organised PDF"
          onClick={organisedPDF}
          className="mt-90 shadow-[0_9px_29px_rgba(2,2,2,0.25)] mr-0 md:mr-50 w-full sm:w-60"
        />
      </div>
    </div>
  );
}

export default RightSection;
