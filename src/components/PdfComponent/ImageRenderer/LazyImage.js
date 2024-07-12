import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setAllLoadedImagesSrc } from "../../../redux/customer";

const LazyImage = ({ src, alt, oldSrc, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const imgRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px", // Load image 100px before it comes into viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageLoad = () => {
    setIsLoading(false);
    dispatch(setAllLoadedImagesSrc(oldSrc));
  };

  return (
    <div>
      {isLoading && (
        <div className="flex justify-center items-center h-[150px]">
          <img width={30} height={30} src="/images/spinner-gif_1.gif" />
        </div>
      )}
      <img
        ref={imgRef}
        src={isVisible ? src : undefined}
        alt={alt}
        onLoad={handleImageLoad}
        className={`rounded-md w-full h-full object-contain ${
          isLoading ? "hidden" : "block"
        }`}
      />
    </div>
  );
};

export default LazyImage;
