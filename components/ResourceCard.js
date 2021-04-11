import { Grid, Typography, Button, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Block } from "@material-ui/icons";
import CardActionArea from '@material-ui/core/CardActionArea';
import { shadows } from '@material-ui/system';
import DeleteIcon from "@material-ui/icons/Delete";
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

export default function ResourceCard({ resources, attrs, onDelete }) {
  const classes = useStyles();
  const [isShown, setIsShown] = useState(false);
  const [moreInfo, setMoreInfo] = useState({});
  const auth = useAuth();

  const getResourceQuery = (organizationName) => {
    return {
      query: `query GET_RESOURCE {
        Resources (where: {organizationName: {_eq: "` + organizationName + `"}}) {
          organizationName
          id
          City
          CocaineTreatment
          acceptHealthIns
          allowsCouples
          availableScholarships
          canWork
          coEd
          detox
          drugCourtApproved
          freeServices
          friendlyLGBT
          homeless
          homelessWomen
          inPatient
          transFriendly
          sexTraffickingVictims
          providesTransportation
          privatelyOwned
          outPatient
          methTreatment
          womenOnly
          womenWithChildren
        }
      }`,
    }
  }

  /*
    Gets resource data
  */
    const handleGetResourceData = async (organizationName) => {
      const data = await fetch(getResourceQuery(organizationName), auth.authState.tokenResult.token)
      .then((data) => {
        setMoreInfo(data.Resources[0]);
        setIsShown(true);
      })
      .catch((err) => {
        console.error(err);
      })
    };

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

  function MoreInfo() {

    if (isShown) {
      return (
        <div>
          {
            Object.keys(moreInfo).map((key) => {
              return <Typography key={key}>{key}: {moreInfo[key]}</Typography>;
            })
          }
          <a onClick={() => setIsShown(false)}>See Less</a>
        </div>
      );
    } else {
      return (
        <div>
          <a onClick={() => handleGetResourceData(resources["organizationName"])}>See More</a>
        </div>
      );
    }
  }

  return (
    <Grid container spacing={4} className={classes.gridContainer} >
      <Grid item>
        <Card className={classes.card} variant="outlined" >
          {cardData}
          <MoreInfo></MoreInfo>
          {onDelete ? (
        <DeleteIcon onClick={() => onDelete(resources.organizationName)} />
      ) : (
        ""
      )}
        </Card>
      </Grid>
    </Grid>
    
  );
}
