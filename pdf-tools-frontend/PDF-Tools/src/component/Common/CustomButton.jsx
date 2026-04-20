import React from 'react';
import { useNavigate } from 'react-router-dom';


const CustomButton = ({
  label = "",
  onClick,
  center = false,
  mt = "mt-0",
  className
}) => {
  return (
    <div className={`${center ? 'flex justify-center' : ''} ${mt}`}>
      <button
        onClick={onClick}
        className={`bg-[#2C5E7A] text-white px-6 py-3 rounded-2xl shadow-2xl hover:shadow-[0_8px_30px_rgba(44,94,122,0.8)]  ${className} w-3xs`}
 
      >
        {label}
      </button>
    </div>
  );
};

export default CustomButton;
