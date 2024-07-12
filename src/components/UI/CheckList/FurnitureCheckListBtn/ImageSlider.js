import React, { useState } from 'react'
import ImageSliderPopup from '../../ImageSliderPopup';
import Image from '../../Image';

const ImageSlider = ({images,setIsDragEnabled }) => {
      const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupImages, setPopupImages] = useState([]);
  const [popupInitialSlide, setPopupInitialSlide] = useState(0);

  const handleImageClick = (clickedImages, index) => {
    setPopupImages(clickedImages); // Set images for the popup
    setPopupInitialSlide(index); // Set initial slide based on clicked image index
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupImages([]);
    setPopupInitialSlide(0);
  };

  return (
    <>
    <div
      className="w-full !overflow-x-scroll flex items-center gap-2 mt-3 mb-2 pr-2"
      onMouseEnter={() => setIsDragEnabled(false)}
      onMouseLeave={() => setIsDragEnabled(true)}
      onTouchStart={() => setIsDragEnabled(false)}
      onTouchEnd={() => setIsDragEnabled(true)}
    >
      {images?.answer?.map((src, index) => (
        <Image
          className="w-[110px] h-[80px] rounded-sm"
          src={src}
          onClick={() => handleImageClick(images?.answer, index)}
        />
      ))}

      <ImageSliderPopup
        images={popupImages}
        initialSlide={popupInitialSlide}
        open={isPopupOpen}
        onClose={closePopup}
      />
    </div>
  </>
  )
}

export default ImageSlider