import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import fetch from "./fetch";
import filterFactory from "./filterFactory";

export default function makeField(value, attr_data, control) {
  const { type, value: attr_name, name } = attr_data;
  const makeTextField = (attr_name, name, default_val) => {
    return (
      <Controller
        control={control}
        name={attr_name}
        defaultValue={default_val}
        as={
          <TextField
            margin="dense"
            id={attr_name}
            label={name}
            type="text"
            // defaultValue={default_val}
            fullWidth
          />
        }
      />
    );
  };
  const makeYesNoSelect = (attr_name, name, default_val) => {
    return (
      <FormControl margin="dense" fullWidth>
        <InputLabel> {name}</InputLabel>
        <Controller
          name={attr_name}
          control={control}
          defaultValue={default_val == null ? false : default_val}
          as={
            <Select>
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          }
        />
      </FormControl>
    );
  };
  switch (type) {
    case "select":
      return makeTextField(attr_name, name, value);
    case "boolean":
    case "checkbox":
      return makeYesNoSelect(attr_name, name, value);
    default:
      return "default";
  }
}