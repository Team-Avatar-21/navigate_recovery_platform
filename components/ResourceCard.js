import { Grid, Typography, Button, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { Block, Edit } from "@material-ui/icons";
import CardActionArea from "@material-ui/core/CardActionArea";
import { shadows } from "@material-ui/system";
import EditIcon from "@material-ui/icons/Edit";

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
      height: "10vw",
      overflow: "scroll",
    },

    gridContainer: {
      paddingTop: "45px",
      paddingLeft: "60px",
      paddingRight: "25px",
    },
  };
});

export default function ResourceCard({ resources, attrs, onDelete, onEdit }) {
  const classes = useStyles();
  /**
   * Prepares data for a resource card
   * simply displays each attribute with appropriate value
   */
  const cardData = Object.keys(resources).map((key) => {
    const attribute_name = attrs[key]["name"];
    return (
      <Typography key={key}>
        {attribute_name}: {String(resources[key])}
      </Typography>
    );
  });
  return (
    <Grid container spacing={4} className={classes.gridContainer}>
      <Grid item>
        <Card className={classes.card} variant="outlined">
          {cardData}
          {onDelete ? (
            <DeleteIcon onClick={() => onDelete(resources.organizationName)} />
          ) : (
            ""
          )}
          {onEdit ? <EditIcon onClick={() => onEdit(resources)} /> : ""}
        </Card>
      </Grid>
    </Grid>
  );
}
