import {
  Grid,
  Typography,
  FormControl,
  Button,
  TextField,
  Checkbox,
} from "@material-ui/core";
import StyledPaper from "../../components/StyledPaper";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../utils/auth";
import useSWR from "swr";

import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import AddResourceAttrModal from "../../components/AddResourceAttrModal";
import { fetchAllAttrs } from "../../utils/graphql/graphqlHelper";
import { useForm, Controller, useFieldArray } from "react-hook-form";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
  formControl: {
    padding: theme.spacing(1),
    minWidth: 200,
    border: `0.5px ${theme.palette.primary.main} solid`,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  container: {
    padding: "1rem",
  },
  item: {
    padding: "1rem",
  },
}));

export default function EditResourceSchema() {
  const classes = useStyles();
  const auth = useAuth();
  const admin = auth?.authState?.tokenResult?.claims?.admin;
  const [attributes, setAttributes] = useState([]);
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    register,
    unregister,
    getValues,
    reset,
  } = useForm({ defaultValues: { attributes } });
  const [attributeForm, setAttributeForm] = useState([]);

  if (!admin) {
    return <>Access Denied</>;
  }

  const token = auth?.authState?.tokenResult?.token;

  const loadInitialAttributes = async (token) => {
    const attrs = await fetchAllAttrs(token);
    setAttributes(attrs);
    attrs.forEach((attr, idx) => {
      append(attr);
    });
    return attrs;
  };

  const { data, isValidating } = useSWR(token, loadInitialAttributes, {
    revalidateOnFocus: false,
  });
  const onSubmit = (data) => {
    axios
      .put("/api/resources/", { attributes: data.attributes, token })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "attributes", // unique name for your Field Array
      keyName: "key",
    }
  );

  const buildAttributesForm = (attributes) => {
    return fields.map((filter, idx) => {
      return (
        <FormControl
          key={filter.key}
          margin="dense"
          className={classes.formControl}
        >
          <FormControl margin="dense">
            <Controller
              name={`attributes[${idx}].filter_human_name`}
              defaultValue={filter.filter_human_name}
              control={control}
              render={(props) => {
                return (
                  <TextField type="text" label={"Filter Name"} {...props} />
                );
              }}
            />
          </FormControl>
          <FormControl margin="dense">
            <Controller
              name={`attributes[${idx}].filter_type`}
              defaultValue={filter.filter_type}
              control={control}
              render={(props) => {
                return (
                  <TextField disabled type="text" label={"Type"} {...props} />
                );
              }}
            />
          </FormControl>
          <FormControl margin="dense">
            <span>
              <label>Important Attribute</label>
              <Controller
                name={`attributes[${idx}].important_attr`}
                control={control}
                defaultValue={filter.important_attr}
                render={(props) => (
                  <Checkbox
                    onChange={(e) => props.onChange(e.target.checked)}
                    checked={props.value}
                  />
                )}
              />
              <label>Important Filter</label>
              <Controller
                name={`attributes[${idx}].important`}
                control={control}
                defaultValue={filter.important}
                render={(props) => (
                  <Checkbox
                    onChange={(e) => props.onChange(e.target.checked)}
                    checked={props.value}
                  />
                )}
              />
            </span>
            <Controller
              name={`attributes[${idx}].filter_name`}
              defaultValue={filter.filter_name}
              control={control}
            />
            <Controller
              name={`attributes[${idx}].id`}
              defaultValue={filter.id}
              control={control}
            />
          </FormControl>
          <FormControl margin="dense"></FormControl>
          <Button onClick={() => handleDelete(filter, idx)}>Delete</Button>
        </FormControl>
      );
    });
  };
  if (isValidating) {
    return "loading...";
  }

  const handleDelete = (filter, idx) => {
    axios
      .delete("/api/resources", {
        data: { id: filter.id, token, filter_name: filter.filter_name },
      })
      .then((res) => {
        remove(idx);
      })
      .catch((err) => {
        console.log(err);
      });
    //
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Navbar />
      <Grid container justify="center">
        <Grid item md={6} xs={10}>
          <StyledPaper>
            <Typography align="center" variant="h2">
              Edit Resource Schema
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container direction="column">
                {buildAttributesForm(attributes)}
                <FormControl margin="normal">
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    size="large"
                  >
                    Save
                  </Button>
                </FormControl>
                <FormControl margin="normal">
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleOpen}
                  >
                    Add New Attribute
                  </Button>
                </FormControl>
              </Grid>
            </form>
            <AddResourceAttrModal
              open={open}
              append={append}
              handleClose={handleClose}
            />
          </StyledPaper>
        </Grid>
      </Grid>
    </>
  );
}
