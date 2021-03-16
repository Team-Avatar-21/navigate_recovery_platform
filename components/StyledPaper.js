import { Paper } from "@material-ui/core";
import { styled, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import { Button, withStyles, Fab } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    borderColor: theme.palette.secondary.light,
    boxShadow: `0px 0px 5px ${theme.palette.secondary.main}`,
    padding: "25px",
    flexGrow: 1,
    margin: "10px",
  },
}));

export default function StyledPaper({ children, className }) {
  const classes = useStyles();
  return (
    <Paper
      elecation={0}
      className={`${classes.paper} ${className}`}
      children={children}
    />
  );
}
