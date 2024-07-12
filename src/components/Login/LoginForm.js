import { Box } from "@mui/material";
import React from "react";
import MuiTextField from "../UI/MuiTextField";
import Button from "../UI/Button";

const LoginForm = ({ handleSubmit, onSubmit, register, errors }) => {
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="flex flex-col space-y-5 mt-8">
          <MuiTextField
            id="email"
            name="email"
            label="Email"
            type='email'
            variant="outlined"
            register={register}
            error={errors?.email || ""}
          />
          <MuiTextField
            id="password"
            name="password"
            type="password"
            label="Password"
            variant="outlined"
            register={register}
            error={errors?.password || ""}
          />
        </Box>
        <Box className="flex justify-center my-5 mb-10 ">
          <Button
            type="submit"
            className="py-2 px-5 cursor-pointer bg-primary text-white rounded-md text-center"
          >
            Submit
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default LoginForm;
