import React from 'react'
import CustomPage from "../component/Common/CustomPage"
import { useNavigate } from 'react-router-dom';

const Unlock = () => {
  const navigate = useNavigate();


  return (
    <div>
      <CustomPage 
        title={"Unlock PDF"} 
        description={"Remove password protection from your PDF in seconds."}
        buttonText={"Select Your PDF File"}
       onButtonClick={() => navigate('/unlockingInterface')} />
    </div>
  );
};

export default Unlock;
