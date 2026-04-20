import React, { useRef, useState } from "react";
import axios from "axios";
import CustomButton from "../component/Common/CustomButton";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const PdfToExcelInterface = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(`${BASE_URL}/convert/pdf-to-excel`, formData, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "converted.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch { alert("Conversion failed. Please ensure the PDF has selectable text."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#BBD7FF] flex items-stretch justify-center">
      <div className="flex flex-col md:flex-row w-full bg-white overflow-hidden">
        <div className="w-full md:w-[60%] min-h-48 p-4 md:p-6 flex flex-col items-start justify-start gap-6 bg-[#BBD7FF]">
          <h2 className="text-xl md:text-2xl font-bold text-black">PDF File</h2>
          <div className="relative w-36 h-48 md:w-48 md:h-64 bg-[#BBD7FF] border-2 border-dashed border-black rounded flex items-center justify-center cursor-pointer shadow-inner"
            onClick={() => fileInputRef.current?.click()}>
            <div className="w-full h-full rounded p-4">
              <div className="flex items-center w-full h-full bg-gray-300 px-2 text-xs text-center">{file ? file.name : "Here Will be File"}</div>
              <input type="file" accept="application/pdf" onChange={handleFileChange} style={{ display: "none" }} ref={fileInputRef} />
            </div>
          </div>
        </div>
        <div className="hidden md:block w-[1px] bg-gray-300 self-stretch" />
        <div className="w-full md:w-[40%] p-4 md:p-6 flex flex-col items-center gap-4 bg-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold text-black text-center">📈 PDF to Excel</h1>
          <p className="text-gray-500 text-sm text-center max-w-xs">Extract tables and data from your PDF and export them to Excel spreadsheets, one sheet per PDF page.</p>
          <div className="w-full max-w-sm bg-yellow-50 border border-yellow-300 rounded p-3 text-xs text-yellow-800">
            ⚠️ Best results with text-based PDFs containing tables. Scanned PDFs may produce limited output.
          </div>
          <div className="w-full max-w-sm">
            <h2 className="text-base font-semibold text-black mb-2">Selected File</h2>
            <div className="w-full h-10 bg-white border border-gray-400 rounded flex items-center px-4 text-sm shadow truncate">{file ? file.name : "No file selected"}</div>
          </div>
          <CustomButton label={loading ? "Converting..." : "Convert to Excel"} onClick={handleConvert} disabled={!file || loading} className="shadow-xl rounded-2xl hover:bg-gray-200 w-3xs" />
        </div>
      </div>
    </div>
  );
};
export default PdfToExcelInterface;
