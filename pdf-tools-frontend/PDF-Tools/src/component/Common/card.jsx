import React from 'react';

const Card = ({ image }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 w-32 h-32 flex items-center justify-center">
      <img src={image} alt="Logo" className="w-16 h-16 object-contain" />
    </div>
  );
};

export default Card;
