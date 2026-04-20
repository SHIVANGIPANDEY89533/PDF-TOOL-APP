import React, { useRef, useState } from "react";
import axios from "axios";
import CustomButton from "../component/Common/CustomButton";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const RotatePDFInterface = () => {
  const [file, setFile] = useState(null);
  const [rotation, setRotation] = useState(90);
  const [pages, setPages] = useState("all");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleRotate = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("rotation", rotation);
      formData.append("pages", pages);
      const res = await axios.post(`${BASE_URL}/edit/rotate`, formData, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "rotated.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch { alert("Rotation failed. Please try again."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#BBD7FF] flex items-stretch justify-center">
      <div className="flex flex-col md:flex-row w-full bg-white overflow-hidden">
        {/* Left — visual rotation preview */}
        <div className="w-full md:w-[60%] min-h-48 p-4 md:p-6 flex flex-col items-center justify-center gap-6 bg-[#BBD7FF]">
          <h2 className="text-xl md:text-2xl font-bold text-black self-start">PDF File</h2>
          <div
            className="w-36 h-48 md:w-48 md:h-64 bg-gray-300 border-2 border-dashed border-black rounded flex items-center justify-center cursor-pointer shadow-inner transition-transform duration-500"
            style={{ transform: `rotate(${rotation === 90 ? 5 : rotation === 180 ? 10 : rotation === 270 ? -5 : 0}deg)` }}
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="text-black text-xs text-center px-2">{file ? file.name : "Click to upload"}</span>
            <input type="file" accept="application/pdf" onChange={handleFileChange} style={{ display: "none" }} ref={fileInputRef} />
          </div>
          {/* Rotation buttons */}
          <div className="flex gap-3 flex-wrap justify-center">
            {[90, 180, 270].map((deg) => (
              <button key={deg} onClick={() => setRotation(deg)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition ${rotation === deg ? "bg-[#2C5E7A] text-white border-[#2C5E7A]" : "bg-white text-[#2C5E7A] border-[#2C5E7A]"}`}>
                {deg}°
              </button>
            ))}
          </div>
        </div>
        <div className="hidden md:block w-[1px] bg-gray-300 self-stretch" />
        {/* Right */}
        <div className="w-full md:w-[40%] p-4 md:p-6 flex flex-col items-center gap-4 bg-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold text-black text-center">🔄 Rotate PDF</h1>
          <p className="text-gray-500 text-sm text-center max-w-xs">Rotate your PDF pages the way you need them. You can even rotate multiple pages at once.</p>
          <div className="w-full max-w-sm flex flex-col gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Pages to rotate</label>
              <input type="text" value={pages} onChange={(e) => setPages(e.target.value)} placeholder='e.g. "all" or "1,3,5"'
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#2C5E7A]" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Rotation angle</label>
              <select value={rotation} onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#2C5E7A]">
                <option value={90}>90° Clockwise</option>
                <option value={180}>180°</option>
                <option value={270}>90° Counter-clockwise</option>
              </select>
            </div>
          </div>
          <CustomButton label={loading ? "Rotating..." : "Rotate & Download"} onClick={handleRotate} disabled={!file || loading} className="shadow-xl rounded-2xl hover:bg-gray-200 w-3xs" />
        </div>
      </div>
    </div>
  );
};
export default RotatePDFInterface;
