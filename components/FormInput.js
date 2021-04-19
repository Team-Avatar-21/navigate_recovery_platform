import { TextField } from "@material-ui/core";
import { Controller, useFormContext } from "react-hook-form";

export default function FormInput(props) {
  const { control } = useFormContext();
  const { name, label } = props;
  return (
    <Controller
      variant="outlined"
      name={name}
      defaultValue=""
      render={(props) => <TextField {...props} label={label} />}
      control={control}
      {...props}
    />
  );
}
