import React from 'react';
import CustomPage from '../component/Common/CustomPage';
import { useNavigate } from 'react-router-dom';

const Edit = () => {
  const navigate = useNavigate();
  const handleAddTextClick = () => navigate('/editpdf');
  const handleRotateClick = () => navigate('/rotate');
  const handlePageNumbersClick = () => navigate('/page-numbers');
  const handleWatermarkClick = () => navigate('/watermark');

  return (
    <div className="space-y-6">
      <CustomPage
        title="Add Text to PDF"
        description="Add custom text anywhere in your PDF."
        buttonText="Add Text"
        onButtonClick={handleAddTextClick}
      />
      <CustomPage
        title="Rotate PDF"
        description="Rotate pages in your PDF to any angle."
        buttonText="Rotate PDF"
        onButtonClick={handleRotateClick}
      />
      <CustomPage
        title="Add Page Numbers"
        description="Add page numbers to your PDF."
        buttonText="Add Page Numbers"
        onButtonClick={handlePageNumbersClick}
      />
      <CustomPage
        title="Add Watermark"
        description="Add a watermark to your PDF."
        buttonText="Add Watermark"
        onButtonClick={handleWatermarkClick}
      />
    </div>
  );
};

export default Edit;
