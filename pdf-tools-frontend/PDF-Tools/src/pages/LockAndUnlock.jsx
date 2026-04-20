import React from 'react'
import CustomPage from "../component/Common/CustomPage"
import { useNavigate } from 'react-router-dom'

const LockAndUnlock = () => {
  const navigate = useNavigate();

  // onClick handlers for both buttons
  const handleLockClick = () => {
    navigate("/lockingPDF");
  };

  const handleUnlockClick = () => {
    navigate("/unlockPDF");
  };

  const handleRepairClick = () => {
    navigate("/repair");
  };

  return (
    <div className="space-y-6">
      <CustomPage 
        title="Lock PDF"
        description="Secure your PDF with a password."
        buttonText="Lock PDF"
        onButtonClick={handleLockClick}
      />
      <CustomPage 
        title="Unlock PDF"
        description="Remove password protection from PDF."
        buttonText="Unlock PDF"
        onButtonClick={handleUnlockClick}
      />
      <CustomPage 
        title="Repair PDF"
        description="Repair corrupted PDF files."
        buttonText="Repair PDF"
        onButtonClick={handleRepairClick}
      />
    </div>
  );
}

export default LockAndUnlock
