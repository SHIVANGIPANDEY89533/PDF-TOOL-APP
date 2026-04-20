import React, { useState, useRef } from 'react';
import CustomButton from '../component/Common/CustomButton';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const SplitInterface = () => {
  const [mode, setMode] = useState('range'); // 'range' or 'all'
  const [file, setFile] = useState(null);
  const [splitFileUrl, setSplitFileUrl] = useState(null);
  const [ranges, setRanges] = useState([{ from: '', to: '' }, { from: '', to: '' }]);
  const [previews, setPreviews] = useState([{ first: null, last: null }, { first: null, last: null }]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
    setSplitFileUrl(null);
  };

  const handleRangeChange = (index, field, value) => {
    const newRanges = [...ranges];
    newRanges[index][field] = value;
    setRanges(newRanges);

    const newPreviews = [...previews];
    if (field === 'from') newPreviews[index].first = value || null;
    if (field === 'to') newPreviews[index].last = value || null;
    setPreviews(newPreviews);
  };

  const handleAddRange = () => {
    setRanges([...ranges, { from: '', to: '' }]);
    setPreviews([...previews, { first: null, last: null }]);
  };

  const handleRemoveRange = (index) => {
    setRanges(ranges.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSplitRange = async () => {
    if (!file) return alert('Please upload a PDF first.');

    const validRanges = ranges
      .map((range) => ({ from: range.from.toString().trim(), to: range.to.toString().trim() }))
      .filter((range) => range.from !== '' && range.to !== '');

    if (validRanges.length === 0) {
      return alert('Please add at least one valid page range before splitting.');
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ranges', JSON.stringify(validRanges));
    try {
      const res = await axios.post(`${BASE_URL}/split-pdf-ranges`, formData, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      setSplitFileUrl(url);
      alert('PDF split successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to split PDF.');
    }
    setLoading(false);
  };

  const handleSplitAll = async () => {
    if (!file) return alert('Please upload a PDF first.');
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${BASE_URL}/splitPDF`, formData, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      setSplitFileUrl(url);
      alert('PDF split successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to split PDF.');
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!splitFileUrl) return alert('Please split the PDF first.');
    const a = document.createElement('a');
    a.href = splitFileUrl;
    a.download = 'split.zip';
    a.click();
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-1/2 bg-secondary flex items-start justify-center p-4 md:p-10 relative">
        <div className="absolute top-0 right-0 w-[4px] h-full bg-black shadow-2xl opacity-30 z-10 hidden md:block"></div>
        <div className="w-full flex flex-col items-center">
          {mode === 'range' && (
            <div className="w-full max-w-xs h-[80vh] overflow-y-auto p-2 mt-0">
              {previews.map((preview, index) => (
                <div className="mb-6" key={index}>
                  <h2 className="text-lg font-semibold mb-2 text-center md:text-left">Range {index + 1}</h2>
                  <div className="border-2 border-dashed border-black-600 p-4 grid grid-cols-3 w-full h-[200px] bg-secondary gap-2">
                    <div className="bg-[#D9D9D9] flex items-center justify-center">
                      {preview.first ? (
                        <span className="font-bold text-black">Page {preview.first}</span>
                      ) : (
                        <div className="text-sm text-gray-600 text-center p-2">Here will be the pdf's 1st page of that range</div>
                      )}
                    </div>
                    <div className="flex flex-row items-center justify-center text-black font-bold text-lg">
                      <span>•</span><span>•</span><span>•</span>
                    </div>
                    <div className="bg-[#D9D9D9] flex items-center justify-center">
                      {preview.last ? (
                        <span className="font-bold text-black">Page {preview.last}</span>
                      ) : (
                        <div className="text-sm text-gray-600 text-center p-2">Here will be the pdf's last page of that range</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-start p-4 md:p-6 shadow-right">
        <div className="w-full max-w-xs">
          {/* Mode buttons */}
          <div className="flex gap-2 mb-4">
            <button
              className={`flex-1 px-4 py-2 rounded-lg ${mode === 'range' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => setMode('range')}
            >
              Split Range
            </button>
            <button
              className={`flex-1 px-4 py-2 rounded-lg ${mode === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => setMode('all')}
            >
              Split All
            </button>
          </div>

          {mode === 'range' ? (
            <>
              <h2 className="text-md font-semibold mb-2">Ranges</h2>
              <div className="max-h-[70vh] mb-4 p-2 border border-gray-200 rounded overflow-y-auto">
                {ranges.map((range, index) => (
                  <div className="mb-2 relative" key={index}>
                    <label className="block text-sm mb-1">Range {index + 1}</label>
                    <button
                      className="absolute top-0 right-0 text-gray-600 hover:text-black text-lg font-bold px-2"
                      onClick={() => handleRemoveRange(index)}
                    >
                      ×
                    </button>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="number"
                        className="border px-2 py-1 w-1/2 rounded"
                        placeholder="From Page"
                        value={range.from}
                        onChange={(e) => handleRangeChange(index, 'from', e.target.value)}
                      />
                      <input
                        type="number"
                        className="border px-2 py-1 w-1/2 rounded"
                        placeholder="To Page"
                        value={range.to}
                        onChange={(e) => handleRangeChange(index, 'to', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="bg-blue-500 text-white w-full px-4 py-2 rounded mb-4 hover:bg-green-600"
                onClick={handleAddRange}
              >
                + Add Range
              </button>

                <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <button
                className="bg-gray-300 text-black w-full h-10 py-2 rounded mb-4 hover:bg-gray-400"
                onClick={() => fileInputRef.current.click()}
              >
                {file ? `Selected: ${file.name}` : 'Upload PDF'}
              </button>
              
              <div className="flex flex-col mt-3 gap-2">
                <button
                  className="bg-blue-500 text-white w-full sm:w-auto px-8 py-2 rounded-4xl hover:bg-blue-600"
                  onClick={handleSplitRange}
                  disabled={loading}
                >
                  {loading ? 'Splitting...' : 'Split Range'}
                </button>
              </div>
            </>
          ) : (
            <>
              <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <button
                className="bg-gray-300 text-black w-full h-10 py-2 rounded mb-4 hover:bg-gray-400"
                onClick={() => fileInputRef.current.click()}
              >
                {file ? `Selected: ${file.name}` : 'Upload PDF'}
              </button>
              <div className="flex flex-col mt-3 gap-2">
                <button
                  className="bg-blue-500 text-white w-full sm:w-auto px-8 py-2 rounded-4xl hover:bg-blue-600"
                  onClick={handleSplitAll}
                  disabled={loading}
                >
                  {loading ? 'Splitting...' : 'Split All'}
                </button>
              </div>
            </>
          )}

          <div className="w-full flex justify-center mt-3">
            <CustomButton
              label="Download"
              onClick={handleDownload}
              className="shadow-lg rounded-lg hover:shadow-xl transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitInterface;
