import React, { useCallback, useEffect, useState } from "react";
import Slider from "react-slick";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import GetIconFile from "../../assets/GetIconFile";
import { useDispatch, useSelector } from "react-redux";
import { removeImageFromStore } from "../../helper/removeImgeHelper";

const ImageSliderPopup = React.memo(
  ({
    images,
    initialSlide,
    open,
    onClose,
    questionId,
    type,
    checkListIndex,
    storeKeyToUpdate,
    setPopupImages,
    roomId,
  }) => {
    const singleCustomerData = useSelector(
      (state) => state.customerReducer.singleCustomer
    );
    const dispatch = useDispatch();

    const settings = {
      initialSlide,
      arrows: false,
      infinite: false,
      dots: true,
    };

    const customDialogContentStyle = {
      height: "410px",
    };

    const customDotStyles = `
    .image-slider-popup .slick-dots {
      bottom: -22px;
    }
    .image-slider-popup .slick-dots li button:before {
      font-size: 16px !important;
    }
    .image-slider-popup .slick-slide {
        height: 366px;
    }
`;

    const removeImageHandler = useCallback(
      async (e, image) => {
        e.stopPropagation();
        removeImageFromStore(
          singleCustomerData,
          questionId,
          type,
          checkListIndex,
          storeKeyToUpdate,
          image,
          roomId,
          dispatch
        );
        setPopupImages((prev) => {
          const newImages = prev.filter((item) => item !== image);
          if (newImages?.length === 0) {
            onClose();
          }
          return newImages;
        });
      },
      [images]
    );

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent style={customDialogContentStyle}>
          <DialogContentText>
            <style>{customDotStyles}</style>

            <Slider className="image-slider-popup" {...settings}>
              {images?.map((image, index) => (
                <div key={image} className="flex justify-center relative">
                  <img
                    src={image}
                    alt={`Image ${index}`}
                    className="mx-auto rounded-xl"
                    style={{ width: "530px", height: "365px" }}
                  />
                  <div
                    className={`absolute rounded-full bg-white padding-2.5 top-0 right-0`}
                    onClick={(e) => removeImageHandler(e, image)}
                    // onTouchStart={(e) => removeImageHandler(e, image)}
                  >
                    <GetIconFile
                      data={{ width: "24px", height: "24px" }}
                      iconName="remove-icon"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    );
  }
);

export default ImageSliderPopup;
