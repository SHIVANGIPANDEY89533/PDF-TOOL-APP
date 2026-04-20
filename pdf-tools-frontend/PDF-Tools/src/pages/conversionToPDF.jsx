import React from 'react'
import CustomPage from "../component/Common/CustomPage"
import { useNavigate } from 'react-router-dom';

const ConversionToPDF = () => {
  const navigate = useNavigate();


  return (
    <div>
      <CustomPage 
        title={"From Word To PDF"} 
        description={"Turn your document into polished in just one click."}
        buttonText={"Select Your Word File"}
       onButtonClick={() => navigate('/wordToPDF1')} />
    </div>
  );
};

export default ConversionToPDF;
