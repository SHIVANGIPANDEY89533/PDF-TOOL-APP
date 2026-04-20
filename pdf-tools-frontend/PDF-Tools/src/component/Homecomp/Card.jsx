import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const toolCategories = [
  {
    category: '📂 Organize PDF',
    gradient: 'from-blue-500 to-blue-700',
    tools: [
      { emoji: '🔗', text: 'Merge PDF', desc: 'Combine multiple PDFs into one document.', route: '/merge' },
      { emoji: '✂️', text: 'Split PDF', desc: 'Extract pages or split into parts.', route: '/splitPage' },
      { emoji: '🗜️', text: 'Compress PDF', desc: 'Reduce file size while keeping quality.', route: '/compress' },
      { emoji: '🔄', text: 'Rotate PDF', desc: 'Rotate pages in your PDF to any angle.', route: '/rotate' }
    ]
  },
  {
    category: '✏️ Edit PDF',
    gradient: 'from-purple-500 to-purple-700',
    tools: [
      { emoji: '✏️', text: 'Edit PDF', desc: 'Edit text, images and layout.', route: '/edit' },
      { emoji: '💧', text: 'Watermark', desc: 'Add text/image watermark.', route: '/watermark' },
      { emoji: '🔢', text: 'Page Numbers', desc: 'Add page numbers automatically.', route: '/page-numbers' },
      { emoji: '🔧', text: 'Repair PDF', desc: 'Fix corrupted PDF files.', route: '/repair' }
    ]
  },
  {
    category: '🔄 Convert PDF',
    gradient: 'from-green-500 to-green-700',
    tools: [
      { emoji: '📝', text: 'PDF to Word', desc: 'Convert PDF to editable Word.', route: '/wordToPDF2' },
      { emoji: '📊', text: 'PDF to PowerPoint', desc: 'Turn PDF pages into slides.', route: '/pdf-to-ppt' },
      { emoji: '📈', text: 'PDF to Excel', desc: 'Extract tables from PDF.', route: '/pdf-to-excel' },
      { emoji: '🖼️', text: 'PDF to Image', desc: 'Convert pages to JPG/PNG.', route: '/pdftoimage' },
      { emoji: '📄', text: 'Word to PDF', desc: 'Turn Word docs into PDF.', route: '/wordToPDF1' },
      { emoji: '📑', text: 'PPT to PDF', desc: 'Convert PPT to PDF.', route: '/ppt-to-pdf' },
      { emoji: '📋', text: 'Excel to PDF', desc: 'Convert Excel to PDF.', route: '/excel-to-pdf' },
      { emoji: '🖼️', text: 'Image to PDF', desc: 'Convert images to PDF.', route: '/imagetopdf' }
    ]
  },
  {
    category: '🔒 Security',
    gradient: 'from-red-500 to-red-700',
    tools: [
      { emoji: '🔒', text: 'Lock PDF', desc: 'Add password protection.', route: '/lockinginterface' },
      { emoji: '🔓', text: 'Unlock PDF', desc: 'Remove PDF password.', route: '/unlockinginterface' },
      { emoji: '📖', text: 'Extract Text', desc: 'Extract all text content.', route: '/matedata' }
    ]
  }
];

const Card = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL}/welcome`).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen w-full bg-secondary">
      <div className="w-full text-center py-10 px-4 bg-secondary">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#2C5E7A] mb-3">Every PDF Tool You Need</h1>
        <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
          Merge, split, compress, convert, rotate, watermark and repair PDFs — all in one place.
        </p>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 pb-10 flex flex-col gap-8">
        {toolCategories.map((cat) => (
          <section key={cat.category} className="w-full">
            <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${cat.gradient} text-white text-base md:text-lg font-bold px-5 py-2 rounded-full mb-4 shadow-lg`}>
              {cat.category}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {cat.tools.map((tool, i) => (
                <div
                  key={i}
                  onClick={() => navigate(tool.route)}
                  className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-4 flex flex-col gap-2 border border-gray-100"
                >
                  <div className="text-3xl">{tool.emoji}</div>
                  <p className="text-base md:text-lg font-bold text-[#2C5E7A]">{tool.text}</p>
                  <p className="text-xs md:text-sm text-gray-500">{tool.desc}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Card;
