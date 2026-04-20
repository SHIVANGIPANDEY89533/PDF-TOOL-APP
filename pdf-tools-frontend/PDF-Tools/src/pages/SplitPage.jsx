import React from 'react'
import CustomPage from "../component/Common/CustomPage"
import { useNavigate } from 'react-router-dom';

const splitpage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <CustomPage title={"Split PDF Files"} description={"Split individual pages or entire section to easily convert them into seoarate PDF files"} 
      buttonText={"Select PDF File "}
      onButtonClick={() => navigate('/splitInterface')}/>
    </div>
  )
}

export default splitpage
