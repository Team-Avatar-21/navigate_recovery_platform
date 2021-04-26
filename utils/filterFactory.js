import {
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
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
  options = options.map((option) => {
    return { name: String(option), value: String(option) };
    // return String(option);
  });
  options.push({ name: "None", value: "" });
  // options.push("None");

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
    <Controller
      render={({ onChange, ...props }) => {
        return (
          <Autocomplete
            autoHighlight
            options={options}
            getOptionLabel={(option) => option.value}
            getOptionSelected={(option, value) => option.name === value.name}
            renderOption={(option) => <span>{option.name}</span>}
            renderInput={(params) => (
              <TextField {...params} label={human_name} />
            )}
            onChange={(e, data) => onChange(data)}
            {...props}
          />
        );
      }}
      onChange={([, data]) => data.name}
      name={name}
      control={control}
    />
  );
};

const makeBooleanSelect = (options, name, human_name, control) => {
  return (
    <>
      <InputLabel> {human_name}</InputLabel>
      <Controller
        name={name}
        control={control}
        render={(props) => (
          <Select defaultValue="" {...props}>
            {options.map((option, idx) => {
              if (option.value === "") {
                return (
                  <MenuItem name={name} value="" key={idx}>
                    N/A
                  </MenuItem>
                );
              }

              if (option.value == "null") {
                return;
              }
              return (
                <MenuItem name={name} value={option.name} key={idx}>
                  {option.name === "true" ? "Yes" : "No"}
                </MenuItem>
              );
            })}
          </Select>
        )}
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
