import { Grid, Typography, Button, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => {
  return {
    card: {
      minWidth: " 150px",
      minHeight: "150px",
      padding: "10px",
    },
  };
});

export default function ResourceCard({ resources, attrs }) {
  const classes = useStyles();

  const cardData = Object.keys(resources).map((key) => {
    const attribute_name = attrs[key];
    console.log(attrs);
    return (
      <Typography>
        {attribute_name}: {resources[key]}
      </Typography>
    );
  });
  return <Card className={classes.card}>{cardData}</Card>;
}
