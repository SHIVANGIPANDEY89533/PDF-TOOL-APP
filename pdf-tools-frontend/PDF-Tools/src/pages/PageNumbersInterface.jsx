import React, { useRef, useState } from "react";
import axios from "axios";
import CustomButton from "../component/Common/CustomButton";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const PageNumbersInterface = () => {
  const [file, setFile] = useState(null);
  const [position, setPosition] = useState("bottom-center");
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(12);
  const [color, setColor] = useState("#000000");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleAddNumbers = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("position", position);
      formData.append("start_number", startNumber);
      formData.append("font_size", fontSize);
      formData.append("color", color);
      const res = await axios.post(`${BASE_URL}/edit/page-numbers`, formData, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "numbered.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch { alert("Failed to add page numbers. Please try again."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#BBD7FF] flex items-stretch justify-center">
      <div className="flex flex-col md:flex-row w-full bg-white overflow-hidden">
        {/* Left */}
        <div className="w-full md:w-[60%] min-h-48 p-4 md:p-6 flex flex-col items-center justify-center gap-6 bg-[#BBD7FF]">
          <h2 className="text-xl md:text-2xl font-bold text-black self-start">PDF File</h2>
          <div className="relative w-40 h-56 md:w-48 md:h-64 bg-white border-2 border-dashed border-gray-400 rounded shadow-md flex flex-col cursor-pointer overflow-hidden"
            onClick={() => fileInputRef.current?.click()}>
            <div className="flex-1 flex items-center justify-center p-2">
              <span className="text-xs text-gray-400 text-center">{file ? file.name : "Click to upload"}</span>
            </div>
            {/* Mock page number at bottom */}
            <div className={`w-full py-1 text-xs font-bold text-center ${position === "bottom-center" ? "text-center" : position === "bottom-right" ? "text-right pr-2" : "text-left pl-2"}`}
              style={{ color }}>
              {startNumber}
            </div>
            <input type="file" accept="application/pdf" onChange={handleFileChange} style={{ display: "none" }} ref={fileInputRef} />
          </div>
        </div>
        <div className="hidden md:block w-[1px] bg-gray-300 self-stretch" />
        {/* Right */}
        <div className="w-full md:w-[40%] p-4 md:p-6 flex flex-col items-center gap-4 bg-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold text-black text-center">🔢 Page Numbers</h1>
          <p className="text-gray-500 text-sm text-center max-w-xs">Add page numbers to your PDF. Choose the position, starting number, and style.</p>
          <div className="w-full max-w-sm flex flex-col gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Position</label>
              <select value={position} onChange={(e) => setPosition(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#2C5E7A]">
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
              </select>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-700 block mb-1">Start From</label>
                <input type="number" value={startNumber} min={0} onChange={(e) => setStartNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#2C5E7A]" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-700 block mb-1">Font Size</label>
                <input type="number" value={fontSize} min={8} max={24} onChange={(e) => setFontSize(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#2C5E7A]" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-700 block mb-1">Color</label>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded cursor-pointer" />
              </div>
            </div>
          </div>
          <CustomButton label={loading ? "Adding Numbers..." : "Add Page Numbers"} onClick={handleAddNumbers} disabled={!file || loading} className="shadow-xl rounded-2xl hover:bg-gray-200 w-3xs" />
        </div>
      </div>
    </div>
  );
};
export default PageNumbersInterface;
