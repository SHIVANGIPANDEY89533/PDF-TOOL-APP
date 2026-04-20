import React from 'react'
import CustomPage from "../component/Common/CustomPage"
import { useNavigate } from 'react-router-dom';
const conversionToWord = () => {
  const navigate = useNavigate();
  return (
    <div>
      <CustomPage title={"From PDF To Word"} 
      description={"Convert PDFs to editable Word document instantly and hassle-free."} 
      buttonText={"Select Your PDF File"}
      onButtonClick={() => navigate('/wordToPDF2')} />
    </div>
  )
}

export default conversionToWord
