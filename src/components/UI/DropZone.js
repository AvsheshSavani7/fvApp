import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import GetIconFile from "../../assets/GetIconFile";

const DropZone = ({ className, setImagePreview, style = {} }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        setImagePreview(file);
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          const dataURL = reader.result;

          // Set the image preview using setImagePreview function
        };

        reader.readAsDataURL(file); // Read the file as a data URL
      });
    },
    [setImagePreview]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className={className || ""} style={style}>
      <input {...getInputProps()} />
      <div className="flex flex-col relative">
        <GetIconFile iconName="camera-icon" />
        <p className="text-[#D8D8D8] absolute bottom-2 left-4">Take Photo</p>
      </div>
    </div>
  );
};

export default DropZone;
