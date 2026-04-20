import React, { useState, useEffect, useRef } from 'react';
import logo from '../../../public/assests/Logo.png'; // Adjusted path for image
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const navbarRef = useRef(null);

  const menuItems = {
    'Organize PDF': [
      { name: 'Merge PDF', route: '/merge' },
      { name: 'Split PDF', route: '/splitPage' },
      { name: 'Compress PDF', route: '/compress' },
      { name: 'Rotate PDF', route: '/rotate' }
    ],
    'Edit PDF': [
      { name: 'Edit PDF', route: '/edit' },
      { name: 'Add Watermark', route: '/watermark' },
      { name: 'Add Page Numbers', route: '/page-numbers' },
      { name: 'Repair PDF', route: '/repair' }
    ],
    'Convert PDF': [
      { name: 'PDF to Word', route: '/wordToPDF2' },
      { name: 'PDF to PowerPoint', route: '/pdf-to-ppt' },
      { name: 'PDF to Excel', route: '/pdf-to-excel' },
      { name: 'PDF to Image', route: '/pdftoimage' },
      { name: 'Word to PDF', route: '/wordToPDF1' },
      { name: 'PPT to PDF', route: '/ppt-to-pdf' },
      { name: 'Excel to PDF', route: '/excel-to-pdf' },
      { name: 'Image to PDF', route: '/imagetopdf' }
    ],
    'Security': [
      { name: 'Lock PDF', route: '/lockinginterface' },
      { name: 'Unlock PDF', route: '/unlockinginterface' },
      { name: 'Extract Text', route: '/matedata' }
    ]
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (section) => {
    setActiveDropdown(activeDropdown === section ? null : section);
  };

  const handleLinkClick = () => {
    setActiveDropdown(null);
    setIsOpen(false);
  };

  return (
    <nav ref={navbarRef} className="bg-primary sticky top-0 z-50 p-4">
      <div className="flex items-center justify-between">
        <img
          src={logo}
          alt="Logo"
          className="h-13 w-auto cursor-pointer"
          onClick={() => navigate("/")}
        />

        <div className="md:hidden cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentcolor"
            viewBox='0 0 24 24'
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </div>

        <div className="hidden md:flex space-x-8 text-black font-medium">
          {Object.keys(menuItems).map((section) => (
            <div key={section} className="relative">
              <div
                className="cursor-pointer hover:underline flex items-center gap-1"
                onClick={() => toggleDropdown(section)}
              >
                {section}
                <svg
                  className={`w-4 h-4 transition-transform ${activeDropdown === section ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {activeDropdown === section && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    {menuItems[section].map((item, index) => (
                      <Link
                        key={index}
                        to={item.route}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        onClick={handleLinkClick}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Responsive Menu for Mobile */}
      {isOpen && (
        <div className="flex flex-col md:hidden mt-4 space-y-2 text-black font-medium">
          {Object.keys(menuItems).map((section) => (
            <div key={section} className="border-b border-gray-200 pb-2">
              <div
                className="cursor-pointer hover:underline flex items-center gap-1 py-2"
                onClick={() => toggleDropdown(section)}
              >
                {section}
                <svg
                  className={`w-4 h-4 transition-transform ${activeDropdown === section ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {activeDropdown === section && (
                <div className="ml-4 space-y-1">
                  {menuItems[section].map((item, index) => (
                    <Link
                      key={index}
                      to={item.route}
                      className="block py-1 text-sm text-gray-600 hover:text-gray-900"
                      onClick={handleLinkClick}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
