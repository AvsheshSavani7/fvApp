import React from "react";
import LazyImage from "./LazyImage";
import { fetchAndCompressImage } from "../../../helper/helper";
import { useDispatch } from "react-redux";
import { setAllImagesSrc, setIsImagesExist } from "../../../redux/customer";

const SingleImage = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = React.useState("");
  const dispatch = useDispatch();

  const fetchAndCompressWithRetry = React.useCallback(
    async (imageUrl) => {
      try {
        const img = await fetchAndCompressImage(imageUrl);
        setImgSrc(img);
      } catch (error) {
        console.error(`Fetch and compress failed for ${imageUrl}`);
      }
    },
    [src]
  );

  React.useEffect(() => {
    fetchAndCompressWithRetry(src)
      .then((imgSrc) => console.log(imgSrc))
      .catch((error) => console.error(error));

    dispatch(setIsImagesExist(true));
    dispatch(setAllImagesSrc(src));
  }, [src]);

  return <LazyImage src={imgSrc} alt={alt || "Checklist Image"} oldSrc={src} />;
};

export default SingleImage;
