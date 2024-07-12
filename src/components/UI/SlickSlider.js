import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

let customDotStyles = `
    .slick-dots {
      bottom: -15px;
    }

    .slick-dots li button:before {
      color: gray;
      font-size: 20px !important;
    }

    // .slick-dots li button {
    //   width: 100px;
    //   height: 100px;
    // }
  `;

const SlickSlider = ({
  children,
  infinite = false,
  slidesToShow = 1,
  slidesToScroll = 1,
  handleAfterChange,
}) => {
  const sliderSettings = {
    dots: true,
    infinite: infinite,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    prevArrow: <></>,
    nextArrow: <></>,
    dotsClass: "slick-dots",
    afterChange: handleAfterChange,

    // appendDots: (dots) => (
    //   <div>
    //     {dots.map((dot, index) =>
    //       index == 0 ? (
    //         <div className="rounded-full bg-black w-4 h-4 left-[560px] gap-4" />
    //       ) : (
    //         <div className="rounded-full bg-gray-500 w-4 h-4 left-[560px] gap-4" />
    //       )
    //     )}
    //   </div>
    // ),
  };

  return (
    <>
      <style>{customDotStyles}</style>
      <Slider {...sliderSettings}>{children}</Slider>
    </>
  );
};

export default SlickSlider;
