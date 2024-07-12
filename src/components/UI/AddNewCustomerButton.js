import React from "react";
import Image from "./Image";

const NewCustomerButton = () => {
  return (
    <div class="relative rounded-full max-w-md flex justify-center m-auto">
      <div class="absolute inset-y-0 -right-2 flex items-center pr-3 pointer-events-none">
        <Image src="/images/newCustomer.svg" />
      </div>
    </div>
  );
};

export default NewCustomerButton;
