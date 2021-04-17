import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Input,
  Button,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Controller } from "react-hook-form";

const filterFactory = (filter_data, control) => {
  let {
    filter_human_name: human_name,
    filter_name: name,
    filter_type: type,
    filter_options: options,
    important,
  } = filter_data;
  options = Array.from(options);

  switch (type) {
    case "select": {
      return makeSelect(options, name, human_name, control);
    }
    case "boolean": {
      return makeBooleanSelect(options, name, human_name, control);
    }
    case "checkbox": {
      return makeCheckbox(options, name, human_name, control);
    }
    default: {
      return <>default</>;
    }
  }
};

const makeSelect = (options, name, human_name, control) => {
  return (
    <>
      <InputLabel>{human_name}</InputLabel>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        as={
          <Select defaultValue="">
            {options.map((option, idx) => {
              return (
                <MenuItem name={name} value={option} key={idx}>
                  {option}
                </MenuItem>
              );
            })}
            <MenuItem name={name} value="">
              None
            </MenuItem>
          </Select>
        }
      />
    </>
  );
};

const makeBooleanSelect = (options, name, human_name, control) => {
  return (
    <>
      <InputLabel> {human_name}</InputLabel>
      <Controller
        name={name}
        control={control}
        as={
          <Select defaultValue="">
            {options.map((option, idx) => {
              return (
                <MenuItem name={name} value={String(option)} key={idx}>
                  {option ? "Yes" : "No"}
                </MenuItem>
              );
            })}
            <MenuItem name={name} value="">
              N/A
            </MenuItem>
          </Select>
        }
      />
    </>
  );
};
const makeCheckbox = (options, name, human_name, control) => {
  return (
    <Controller
      name={name}
      control={control}
      render={(props) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={props.value ? props.value : false}
              onChange={(e) => props.onChange(e.target.checked)}
            />
          }
          label={human_name}
        />
      )}
    />
  );
};

export default filterFactory;