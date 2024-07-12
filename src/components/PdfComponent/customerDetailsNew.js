import React from "react";
import { pdfStyle } from "../../utils/Constants";

const CustomerDetailsNew = ({ customerDetails1 }) => {
  const customerDetails =
    Object.keys(customerDetails1 || {}).length > 0
      ? customerDetails1?.fv_data?.customer
      : {};
  return (
    <>
      <div className="w-full  relative overflow-hidden ">
        <img
          src="https://field-visit.s3.ap-south-1.amazonaws.com/newbedroom_bedroomImg1.png"
          className="w-full h-[110px] object-cover rounded-t-[14px]"
          // src="/images/bedroomImg.png"
          // className=" w-full rounded-t-[14px]"
        />
        <img
          // src="/images/kasa_logo.jpg"
          src="https://field-visit.s3.ap-south-1.amazonaws.com/1695962067150_kasa_logo.jpg"
          className="absolute bottom-3 left-3 w-[200px] rounded-md"
        />
      </div>

      <div className="my-2">
        <div className={`flex py-${pdfStyle?.paddingY} justify-between`}>
          <div
            className={`flex flex-col items-start my-${pdfStyle?.marginY} pl-[15px] `}
          >
            <div className={`flex items-center justify-start my-1`}>
              <span className={` text-[18px]  font-kalam italic font-bold`}>
                {customerDetails1?.customer_name}
              </span>
            </div>
            <div className={`flex items-center justify-start my-1 font-kalam`}>
              <span className={`font-normal text-[18px] `}>
                {customerDetails1?.email}
              </span>
            </div>
            <div className={`flex items-center justify-start my-1 font-kalam`}>
              <span className={`font-normal text-[18px] `}>
                {customerDetails1?.mobile}
              </span>
            </div>
          </div>
          <div
            className={`flex flex-col items-end my-${pdfStyle?.marginY} pr-[15px]`}
          >
            {customerDetails?.buildingType?.answer ? (
              <div
                className={`flex items-center justify-end my-1 w-[230px] font-kalam`}
              >
                <span className={`font-normal text-[18px] text-start  `}>
                  {customerDetails?.buildingType?.answer || ""}
                </span>
              </div>
            ) : (
              ``
            )}
            <div
              className={`flex items-center justify-end my-1 w-[175px] font-kalam`}
            >
              <span className={`font-normal text-[18px] text-end `}>
                {customerDetails1?.address}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDetailsNew;
