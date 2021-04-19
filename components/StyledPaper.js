import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
      elevation={0}
      className={`${classes.paper} ${className}`}
      children={children}
    />
  );
}
