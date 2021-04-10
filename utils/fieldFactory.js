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
import { useForm } from "react-hook-form";
import fetch from "./fetch";
import filterFactory from "./filterFactory";

export default function makeField(value, attr_data) {
  const { type, value: attr_name, name } = attr_data;
  console.log(type);
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
const makeTextField = (attr_name, name, default_val) => {
  return (
    <TextField
      margin="dense"
      id={attr_name}
      label={name}
      name={attr_name}
      type="text"
      defaultValue={default_val}
      fullWidth
    />
  );
};
const makeYesNoSelect = (attr_name, name, default_val) => {
  return (
    <FormControl margin="dense" fullWidth>
      <InputLabel> {name}</InputLabel>
      <Select
        defaultValue={default_val == null ? false : default_val}
        name={attr_name}
      >
        <MenuItem value={true}>Yes</MenuItem>
        <MenuItem value={false}>No</MenuItem>
      </Select>
    </FormControl>
  );
};
