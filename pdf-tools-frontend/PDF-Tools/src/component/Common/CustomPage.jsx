import React from 'react';
import Button from '../Common/CustomButton';

const CustomPage = ({ title, description, buttonText, secondButtonText, thirdButtonText,fourthButtonText, onButtonClick, onSecondButtonClick,onthirdButtonClick,onfourthButtonClick ,fiftyButtonText,onfiftyButtonTextClick}) => {
  return (
    <section className="w-full min-h-screen bg-secondary py-16 px-6">
      {/* Main content */}
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">{title}</h1>
          <p className="text-base text-black mb-6">{description}</p>

          {/* First Button with Click */}
          {buttonText && (
            <div className="mb-4">
              <Button label={buttonText} onClick={onButtonClick} />
            </div>
          )}

          {/* Second Button with Click */}
          {secondButtonText && (
            <div className='mb-4'>
              <Button label={secondButtonText} onClick={onSecondButtonClick} />
            </div>
          )}
          {/* Third Button with Click */}
          {thirdButtonText && (
            <div className='mb-4'>
              <Button label={thirdButtonText} onClick={onthirdButtonClick} />
            </div>
          )}
          {/* Fourth Button with Click */}
          {fourthButtonText && (
            <div className='mb-4'>
              <Button label={fourthButtonText} onClick={onfourthButtonClick} />
            </div>
          )}
           { fiftyButtonText && (
            <div className='mb-4'>
              <Button label={ fiftyButtonText} onClick={onfiftyButtonTextClick} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomPage;
