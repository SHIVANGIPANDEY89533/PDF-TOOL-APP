import React from 'react';
import CustomPage from '../component/Common/CustomPage';
import { useNavigate } from 'react-router-dom';

const MergeAndSplit = () => {
  const navigate = useNavigate();

  const handleMergeClick = () => {
    navigate('/merge');
  };

  const handleSplitClick = () => {
    navigate('/SplitPage');
  };

  return (
    <div>
      <CustomPage
        title="Merge/Split"
        description="Split or merge your pdf files effortlessly."
        buttonText="Merge PDF Files"
        secondButtonText="Split PDF Files"
        onButtonClick={handleMergeClick}
        onSecondButtonClick={handleSplitClick}
      />
    </div>
  );
};

export default MergeAndSplit;
