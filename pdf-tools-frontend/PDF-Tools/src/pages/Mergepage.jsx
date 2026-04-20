import React from 'react'
import CustomPage from "../component/Common/CustomPage"
import { useNavigate } from 'react-router-dom';

const Mergepage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <CustomPage title={"Merge PDF Files"} description={"Put your PDFs togrther in the right order using the most intutive PDF merger."} 
      buttonText={"Select PDF File "}
      onButtonClick={() => navigate('/mergeInterface')}/>
    </div>
  )
}

export default Mergepage
