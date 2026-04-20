import React from 'react'
import CustomPage from "../component/Common/CustomPage"
import { useNavigate } from 'react-router-dom';

const ReOrganize = () => {
  const navigate = useNavigate();


  return (
    <div>
      <CustomPage 
        title={"Re-Organize Your PDF"} 
        description={"Upload your PDF file and Re-Organize the pages of that PDF."}
        buttonText={"Select PDF File"}
       onButtonClick={() => navigate('/pagePreviewSection')} />
    </div>
  );
};

export default ReOrganize;
