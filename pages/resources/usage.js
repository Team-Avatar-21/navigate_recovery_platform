import Navbar from "../../components/Navbar";
import useSWR from "swr";
import fetch from "../../utils/fetch";
import {
  fetchAllResourceUsage,
  fetchResourceMonthUsage,
} from "../../utils/graphql/graphqlHelper";
import { useAuth } from "../../utils/auth";
import { useState } from "react";
import { Button, Grid, TextField } from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import { getResourceUsageDesc } from "../../utils/resourceUsageHelper";
import { DataGrid } from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  dataGrid: {
    maxWidth: "675px",
    minWidth: "675px",
  },
  form: {
    margin: "1rem",
  },
}));

export default function Usage() {
  const classes = useStyles();
  const auth = useAuth();
  const token = auth?.authState?.tokenResult?.token;
  const { control, handleSubmit, register } = useForm();
  const [resourceUsage, setResourceUsage] = useState([]);
  const [filteredResourceUsage, setFilteredResourceUsage] = useState([]);
  const getResourceUsage = async (token) => {
    const data = await fetchAllResourceUsage(token);
    setResourceUsage(data.peer_visit);
    return data;
  };

  const columns = [
    { field: "counter", headerName: "#", width: 70 },
    { field: "name", headerName: "Name", width: 300 },
    { field: "used_times", headerName: "Used Times", width: 300 },
  ];
  const updateFilteredResourceUsage = async (start, end) => {
    const res = await fetchResourceMonthUsage(token, start, end);
    setFilteredResourceUsage(
      Object.entries(getResourceUsageDesc(res)).sort((a, b) => b[0] - a[0])
    );
  };
  const onSubmit = async (data) => {
    const { start, end } = data;
    updateFilteredResourceUsage(start, end);
  };

  const handleThisMonth = () => {
    const today = new Date();
    const thisMonth = today.getMonth() + 1;
    const nextMonth = thisMonth + 1 > 12 ? 1 : thisMonth + 1;
    const thisYear = today.getFullYear();
    const nextYear = thisMonth + 1 > 12 ? thisYear + 1 : thisYear;
    const start = `${thisYear}-${thisMonth}-01`;
    const end = `${nextYear}-${nextMonth}-01`;
    updateFilteredResourceUsage(start, end);
  };

  const handleLastMonth = () => {
    const today = new Date();
    const thisMonth = today.getMonth() + 1;
    const lastMonth = thisMonth - 1 < 1 ? 12 : thisMonth - 1;
    const thisYear = today.getFullYear();
    const lastYear = thisMonth - 1 < 1 ? thisYear - 1 : thisYear;
    const end = `${thisYear}-${thisMonth}-01`;
    const start = `${lastYear}-${lastMonth}-01`;
    updateFilteredResourceUsage(start, end);
  };
  const { data, isValidating } = useSWR(token, getResourceUsage, {
    revalidateOnFocus: false,
  });
  if (isValidating) {
    return <>Loading...</>;
  }
  const buildFilteredResUsage = (filteredResourcesArr) => {
    const usage_list = [];
    let counter = 1;
    filteredResourcesArr.map((entry, idx) => {
      const [times, res_names] = entry;
      res_names.forEach((name, index) => {
        usage_list.push({
          name,
          used_times: times,
          id: `${counter}`,
          counter: `${counter}`,
        });
        counter += 1;
      });
    });
    return (
      <DataGrid
        rows={usage_list}
        columns={columns}
        autoHeight
        className={classes.dataGrid}
        pageSize={15}
      />
    );
  };
  return (
    <>
      <Navbar />
      <Grid container align="center" direction="column">
        <Grid item className={classes.form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container justify="space-around" wrap>
              <Grid item container spacing={2} xs={6}>
                <Grid item>
                  <Controller
                    control={control}
                    name="start"
                    defaultValue={new Date().toLocaleString("en-US")}
                    render={(props) => {
                      return (
                        <TextField
                          {...props}
                          id="start_date"
                          label="Start From"
                          type="date"
                          required
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item>
                  <Controller
                    control={control}
                    name="end"
                    defaultValue={new Date().toLocaleString("en-US")}
                    render={(props) => {
                      return (
                        <TextField
                          {...props}
                          id="end_date"
                          label="End At"
                          type="date"
                          required
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button type="submit" variant="contained" color="secondary">
                    Show Resource Usage
                  </Button>
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleThisMonth}
              >
                This Month
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLastMonth}
              >
                Last Month
              </Button>
            </Grid>
          </form>
        </Grid>
        <Grid item>{buildFilteredResUsage(filteredResourceUsage)}</Grid>
        {/* This code would show all of the resource usage for all time with
        timestamps
        {resourceUsage.map((resource, idx) => {
          const date = new Date(resource.visit_ts);
          const local_date = date.toLocaleDateString("en-US");
          date.setmo;
          return (
            <div key={idx}>
              Name:{resource.resources.name} | Date: {local_date}{" "}
            </div>
          );
        })} */}
      </Grid>
    </>
  );
}
