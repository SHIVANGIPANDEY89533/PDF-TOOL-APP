import React from "react";
import logo from "../../../public/assests/Logo.png"; // adjust path as per your structure

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-4 px-6 flex justify-between items-center mt-auto">
      
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
      </div>

      {/* Center: Text */}
      <div className="text-xl text-center  font-bold ">
        2025 | All rights reserved ©<a href="https://www.techquantum.in/" 
        target="black"
        className="text-green-900 "> Cyvanta Tech Quantum</a>
      </div>

      {/* Right: Read About Us */}
      <div>
        <a href="" className="hover:text-gray-400 text-sm underline">
          
        </a>
      </div>
    </footer>
  );
};

export default Footer;
