import { Grid, Typography, Button, Card, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useState } from "react";
import { useAuth } from "../utils/auth";
import fetch from "../utils/fetch";

/**
 * Component class that represents a resource card
 */
const useStyles = makeStyles((theme) => {
  return {
    card: {
      background: "#f1f1f1",
      "&:hover": {
        background: "#FFFF66",
      },
      display: "block",
      width: "25vw",
      minHeight: "10vw",
    },
    gridContainer: {
      // paddingTop: "45px",
      // paddingLeft: "60px",
      // paddingRight: "25px",
    },
  };
});

export default function ResourceCard({
  resource,
  attrs,
  onDelete,
  onEdit,
  onView,
}) {
  const classes = useStyles();

  /**
   * Prepares data for a resource card
   * simply displays each attribute with appropriate value
   */
  const cardData = Object.keys(attrs).map((key) => {
    const attribute_name = attrs[key]["name"];

    return (
      <Typography key={key}>
        {attribute_name}: {String(resource[key])}
      </Typography>
    );
  });
  return (
    <Grid container className={classes.gridContainer}>
      <Grid item>
        <Card className={classes.card} variant="outlined">
          {cardData}
          {onDelete ? (
            <DeleteIcon onClick={() => onDelete(resource.organizationName)} />
          ) : (
            ""
          )}
          {onEdit ? (
            <IconButton onClick={() => onEdit(resource)}>
              <EditIcon />
            </IconButton>
          ) : (
            ""
          )}
          <Button onClick={() => onView(resource)}> See More </Button>
        </Card>
      </Grid>
    </Grid>
  );
}
