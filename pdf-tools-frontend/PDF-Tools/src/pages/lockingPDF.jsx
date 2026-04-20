import React from 'react'
import CustomPage from "../component/Common/CustomPage"
import { useNavigate } from 'react-router-dom';

const Lock = () => {
  const navigate = useNavigate();


  return (
    <div>
      <CustomPage 
        title={"Lock PDF"} 
        description={"Secure your PDF with a password to prevent unauthorized access."}
        buttonText={"Select Your PDF File"}
       onButtonClick={() => navigate('/lockingInterface')} />
    </div>
  );
};

export default Lock;
