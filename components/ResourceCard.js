import { Grid, Typography, Button, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Block } from "@material-ui/icons";
import CardActionArea from '@material-ui/core/CardActionArea';
import { shadows } from '@material-ui/system';

const useStyles = makeStyles((theme) => {
  return {
    card: {
      background: "#f1f1f1",
    '&:hover': {
       background: "#FFFF66",
    },
      display: 'block',
      width: '25vw',
      height: '10vw',
    }, 

    gridContainer:{
      paddingTop: "45px",
      paddingLeft: "60px",
      paddingRight: "25px",
    },
  };
});

export default function ResourceCard({ resources, attrs }) {
  const classes = useStyles();

  const cardData = Object.keys(resources).map((key) => {
    const attribute_name = attrs[key];
    return (
      <Typography key={key}>
        {attribute_name}: {String(resources[key])}
      </Typography>
    );
  });
  return (
    <Grid container spacing={4} className={classes.gridContainer} >
      <Grid item>
        <Card className={classes.card} variant="outlined" >
          {cardData}
          
        </Card>
      </Grid>
    </Grid>
    
  );
}
