import { TextField } from "@material-ui/core";
import { Controller, useFormContext } from "react-hook-form";

export default function FormInput(props) {
  const { control } = useFormContext();
  const { name, label } = props;
  return (
    <Controller
      as={TextField}
      variant="outlined"
      name={name}
      label={label}
      defaultValue=""
      control={control}
      {...props}
    />
  );
}
