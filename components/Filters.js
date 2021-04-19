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
import filterFactory from "../utils/filterFactory";
import { useResources } from "../components/ResourcesContext";

/**
 * Component class that represents filters to filter through resources
 */
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
  const resContext = useResources();
  //default values for filters are all filters empty
  //as long as all filters are of type SELECT
  const default_values = () => {
    const def_vals = {};
    data?.forEach((attr) => {
      if (attr.filter_type === "select")
        def_vals[attr.filter_name] = { name: "None", value: "" };
      else {
        def_vals[attr.filter_name] = "";
      }
    });
    console.log(def_vals);
    return def_vals;
  };
  const defaultValues = default_values();
  // console.log(resContext);
  const { register, handleSubmit, watch, control, reset, getValues } = useForm({
    defaultValues,
  });

  const [filterState, setFilterState] = useState(default_values());
  const classes = useStyles();
  const handleFetchFiltered = () => {};

  /**
   * Handles click on Get Filtered Resources button
   * updates state of filters in the parent component
   * @param {Object} data of the current form state
   */
  const onSubmit = (data) => {
    console.log(data);
    setFiltersState(data);
  };

  const resetFilters = () => {
    setFiltersState(default_values());
    reset(defaultValues);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} style={{ display: "flex", flexWrap: "wrap" }}>
        {resContext.state.filters.map((filter_data, idx) => {
          const filter = filterFactory(filter_data, control);
          const { filter_name, filter_human_name } = filter_data;
          return (
            <Grid item key={idx}>
              <FormControl className={classes.formControl}>
                {filter}
              </FormControl>
            </Grid>
          );
        })}
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
