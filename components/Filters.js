import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Input,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import FormInput from "./FormInput";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  layout: {
    margin: "10px",
  },
}));

export default function Filters({ data, setFiltersState }) {
  //default values for filters are all filters empty
  //as long as all filters are of type SELECT
  const default_values = () => {
    const def_vals = {};
    data?.forEach((attr) => (def_vals[attr.attribute_name] = ""));
    return def_vals;
  };

  const { register, handleSubmit, watch, control, reset, getValues } = useForm({
    defaultValues: default_values(),
  });

  const [filterState, setFilterState] = useState(default_values());
  const classes = useStyles();
  const handleFetchFiltered = () => {};
  const onSubmit = (data) => {
    setFiltersState(data);
  };

  const resetFilters = () => {
    setFiltersState(default_values());
    reset(default_values());
  };

  const handleChange2 = (e) => {
    // console.log(getValues());
  };
  const filters = data
    ? data?.map((filter, idx) => {
        const { filter_name, attribute_name } = filter;
        const options = filter.filters || [];
        const { filter_type } = options.length > 0 ? options[0] : "";
        const newOpts = options.map((option) => ({
          value: option.filter_option,
          label: option.filter_option,
        }));

        return (
          <FormControl className={classes.formControl} key={idx}>
            <InputLabel>{filter_name}</InputLabel>
            {filter_type == "SELECT" ? (
              <Controller
                name={attribute_name}
                control={control}
                defaultValue=""
                as={
                  <Select
                    defaultValue=""
                    //    onClose={handleChange2}
                  >
                    {options.map((option, idx) => {
                      const value = option.filter_option;
                      return (
                        <MenuItem name={attribute_name} key={idx} value={value}>
                          {value}
                        </MenuItem>
                      );
                    })}
                  </Select>
                }
              />
            ) : (
              //   <Select inputRef={register} name={attribute_name} ref={register}>
              //     {options.map((option, idx) => {
              //       const value = option.filter_option;
              //       return (
              //         <MenuItem name={attribute_name} key={idx} value={value}>
              //           {value}
              //         </MenuItem>
              //       );
              //     })}
              //   </Select>
              //   <Select inputRef={register}>
              //     <MenuItem value={"none"}>None</MenuItem>
              //   </Select>
              ""
            )}
          </FormControl>
        );
      })
    : [];
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} style={{ display: "flex", flexWrap: "wrap" }}>
        {filters.map((filter, idx) => (
          <Grid key={idx} item>
            {filter}
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleFetchFiltered}
        type="submit"
      >
        Get Filtered Resources
      </Button>
      <Button variant="contained" color="secondary" onClick={resetFilters}>
        Reset Filters
      </Button>
    </form>
  );
}
