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

export default function ResourceCard({ data }) {
  const classes = useStyles();

  const cardData = Object.keys(data).map((key) => {
    return (
      <Typography>
        {key}: {data[key]}
      </Typography>
    );
  });
  return <Card className={classes.card}>{cardData}</Card>;
}
