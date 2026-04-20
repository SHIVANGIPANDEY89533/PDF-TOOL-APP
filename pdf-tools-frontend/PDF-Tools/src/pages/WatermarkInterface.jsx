import React, { useRef, useState } from "react";
import axios from "axios";
import CustomButton from "../component/Common/CustomButton";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const WatermarkInterface = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#FF0000");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleWatermark = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("text", text);
      formData.append("font_size", fontSize);
      formData.append("color", color);
      const res = await axios.post(`${BASE_URL}/edit/watermark`, formData, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "watermarked.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch { alert("Watermarking failed. Please try again."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#BBD7FF] flex items-stretch justify-center">
      <div className="flex flex-col md:flex-row w-full bg-white overflow-hidden">
        {/* Left — preview */}
        <div className="w-full md:w-[60%] min-h-48 p-4 md:p-6 flex flex-col items-center justify-center gap-6 bg-[#BBD7FF]">
          <h2 className="text-xl md:text-2xl font-bold text-black self-start">PDF File</h2>
          {/* Mock preview */}
          <div className="relative w-48 h-64 bg-white border-2 border-dashed border-gray-400 rounded shadow-md flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={() => fileInputRef.current?.click()}>
            <span className="absolute text-xs text-gray-400 z-10">{file ? file.name : "Click to upload"}</span>
            <span className="absolute text-4xl font-bold opacity-20 rotate-45 select-none" style={{ color }}>{text || "WATERMARK"}</span>
            <input type="file" accept="application/pdf" onChange={handleFileChange} style={{ display: "none" }} ref={fileInputRef} />
          </div>
        </div>
        <div className="hidden md:block w-[1px] bg-gray-300 self-stretch" />
        {/* Right */}
        <div className="w-full md:w-[40%] p-4 md:p-6 flex flex-col items-center gap-4 bg-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold text-black text-center">💧 Watermark PDF</h1>
          <p className="text-gray-500 text-sm text-center max-w-xs">Stamp an image or text over your PDF in seconds. Choose the font, transparency, and position.</p>
          <div className="w-full max-w-sm flex flex-col gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Watermark Text</label>
              <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. CONFIDENTIAL"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#2C5E7A]" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-700 block mb-1">Font Size</label>
                <input type="number" value={fontSize} min={12} max={120} onChange={(e) => setFontSize(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#2C5E7A]" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-700 block mb-1">Color</label>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded cursor-pointer" />
              </div>
            </div>
          </div>
          <CustomButton label={loading ? "Adding Watermark..." : "Apply Watermark"} onClick={handleWatermark} disabled={!file || loading} className="shadow-xl rounded-2xl hover:bg-gray-200 w-3xs" />
        </div>
      </div>
    </div>
  );
};
export default WatermarkInterface;
