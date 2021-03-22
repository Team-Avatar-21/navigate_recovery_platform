import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));
const useStyles1 = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
}));
function Index() {
  const classes = useStyles1();

  const [value, setValue] = React.useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };
}

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h10" className={classes.title}>
              NAVIGATE RECOVERY
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </div>

      <div className="Test">
        <Grid
          container
          spacing={3}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={3}>
            <FormControl
              variant="filled"
              fullWidth="true"
              className={classes.formControl}
            >
              <InputLabel shrink>City</InputLabel>

              <Select labelId="demo1" id="city-select">
                <MenuItem value={""}></MenuItem>
                <MenuItem value={"Alpharetta"}>Alpharetta</MenuItem>
                <MenuItem value={"Athens"}>Athens</MenuItem>
                <MenuItem value={"Atlanta"}>Atlanta</MenuItem>
                <MenuItem value={"Augusta"}>Augusta</MenuItem>
                <MenuItem value={"Ball Ground"}>Ball Ground</MenuItem>
                <MenuItem value={"Carrolton"}>Carrolton</MenuItem>
                <MenuItem value={"Charlotte, NC"}>Charlotte, NC</MenuItem>
                <MenuItem value={"Dahlonega"}>Dahlonega</MenuItem>
                <MenuItem value={"Decatur"}>Decatur</MenuItem>
                <MenuItem value={"Lawrenceville"}>Lawrenceville</MenuItem>
                <MenuItem value={"Monroe"}>Monroe</MenuItem>
                <MenuItem value={"Riverdale"}>Riverdale</MenuItem>
                <MenuItem value={"Sautee"}>Sautee</MenuItem>
                <MenuItem value={"Smyrna"}>Smyrna</MenuItem>
                <MenuItem value={"Statesboro"}>Statesboro</MenuItem>
                <MenuItem value={"Valdosta"}>Valdosta</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl
              variant="filled"
              fullWidth="true"
              className={classes.formControl}
            >
              <InputLabel shrink>Gender</InputLabel>

              <Select labelId="demo2" id="gender-select">
                <MenuItem value={""}></MenuItem>
                <MenuItem value={"Male"}>Male</MenuItem>
                <MenuItem value={"Female"}>Female</MenuItem>
                <MenuItem value={"Both"}>Both</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl
              variant="filled"
              fullWidth="true"
              className={classes.formControl}
            >
              <InputLabel shrink>None</InputLabel>

              <Select labelId="demo3" id="none-select">
                <MenuItem value={""}></MenuItem>
                <MenuItem value={"True"}>True</MenuItem>
                <MenuItem value={"False"}>False</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
/*<React.Fragment>
    <CssBaseline />
    <Container relative>
      
      <Typography component="div" style={{ backgroundColor: '#cfe8fc', height: '100vh'}} />
      
    </Container>
  </React.Fragment>*/
