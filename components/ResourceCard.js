import { Grid, Typography, Button, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import Modal from "./modal.js";

/**
 * Component class that represents a resource card
 */
const useStyles = makeStyles((theme) => {
  return {
    card: {
      minWidth: " 150px",
      minHeight: "150px",
      padding: "10px",
    },
  };
});

export default function ResourceCard({ resources, attrs, onDelete }) {
  const classes = useStyles();

  /**
   * Prepares data for a resource card
   * simply displays each attribute with appropriate value
   */
  const cardData = Object.keys(resources).map((key) => {
    const attribute_name = attrs[key];
    return (
      <Typography key={key}>
        {attribute_name}: {String(resources[key])}
      </Typography>
    );
  });

  return (
    <Card className={classes.card}>
      {cardData}{" "}
      <Modal show={this.state.show} handleClose={this.hideModal}>
          <p>Modal</p>
      </Modal>
      {onDelete ? (
        <DeleteIcon onClick={() => onDelete(resources.organizationName)} />
      ) : (
        ""
      )}
    </Card>
  );
}
