import { useForm } from "react-hook-form";
import { YupValidator } from "../lib/yup-validator";

export const useReactHookForm = ({
  validationSchema,
  defaultValues,
  mode = "onChange",
}) => {
  const methods = useForm({
    mode: mode,
    resolver: YupValidator(validationSchema || {}),
    defaultValues: { ...defaultValues },
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    register,
    setValue,
    getValues,
    trigger,
    formState: { isSubmitting, errors },
  } = methods;

  return {
    reset,
    trigger,
    watch,
    control,
    handleSubmit,
    register,
    setValue,
    getValues,
    errors,
    isSubmitting,
  };
};
