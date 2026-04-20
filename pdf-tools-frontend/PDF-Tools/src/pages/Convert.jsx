import React from 'react'
import CustomPage from "../component/Common/CustomPage"
import { useNavigate } from 'react-router-dom'

const Convert = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <CustomPage 
        title={"Word to PDF"} 
        description={"Convert Word documents to PDF."} 
        buttonText={"Convert"} 
        onButtonClick={() => navigate('/wordToPDF1')}
      />
      <CustomPage 
        title={"PDF to Word"} 
        description={"Convert PDF to Word documents."} 
        buttonText={"Convert"} 
        onButtonClick={() => navigate('/wordToPDF2')}
      />
      <CustomPage 
        title={"PDF to Image"} 
        description={"Convert PDF pages to images."} 
        buttonText={"Convert"} 
        onButtonClick={() => navigate('/pdftoimage')}
      />
      <CustomPage 
        title={"Image to PDF"} 
        description={"Convert images to PDF."} 
        buttonText={"Convert"} 
        onButtonClick={() => navigate('/imagetopdf')}
      />
      <CustomPage 
        title={"Excel to PDF"} 
        description={"Convert Excel files to PDF."} 
        buttonText={"Convert"} 
        onButtonClick={() => navigate('/excel-to-pdf')}
      />
      <CustomPage 
        title={"PDF to Excel"} 
        description={"Convert PDF to Excel."} 
        buttonText={"Convert"} 
        onButtonClick={() => navigate('/pdf-to-excel')}
      />
      <CustomPage 
        title={"PDF to PowerPoint"} 
        description={"Convert PDF to PowerPoint."} 
        buttonText={"Convert"} 
        onButtonClick={() => navigate('/pdf-to-pptx')}
      />
      <CustomPage 
        title={"PowerPoint to PDF"} 
        description={"Convert PowerPoint to PDF."} 
        buttonText={"Convert"} 
        onButtonClick={() => navigate('/pptx-to-pdf')}
      />
      <CustomPage 
        title={"Extract Text from PDF"} 
        description={"Extract text content from PDF."} 
        buttonText={"Extract"} 
        onButtonClick={() => navigate('/matedata')}
      />
    </div>
  )
}

export default Convert;
