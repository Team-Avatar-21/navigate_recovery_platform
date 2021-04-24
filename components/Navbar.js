import { useAuth } from "../utils/auth";
import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    margin: theme.spacing(1),
  },
}));

export default function Navbar() {
  const classes = useStyles();
  const auth = useAuth();
  const admin = auth?.authState?.tokenResult?.claims?.admin;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Grid container justify="space-between">
            <Grid item>
              <Typography>
                <Link href="/">
                  <Button
                    className={classes.menuButton}
                    variant="outlined"
                    color="secondary"
                  >
                    {" "}
                    Main{" "}
                  </Button>
                </Link>

                <Link href="/peer">
                  <Button
                    className={classes.menuButton}
                    variant="outlined"
                    color="secondary"
                  >
                    Peer
                  </Button>
                </Link>

                <Link href="/resources">
                  <Button
                    className={classes.menuButton}
                    variant="outlined"
                    color="secondary"
                  >
                    Resources
                  </Button>
                </Link>
                {admin ? (
                  <Link href="/admin">
                    <Button
                      className={classes.menuButton}
                      variant="outlined"
                      color="secondary"
                    >
                      Admin
                    </Button>
                  </Link>
                ) : (
                  ""
                )}
              </Typography>
            </Grid>
            <Grid item container xs={6} justify="center" alignItems="center">
              {auth?.user ? (
                <Grid item>
                  <span>{auth.user.email}</span>{" "}
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => auth.signout()}
                  >
                    Logout
                  </Button>
                </Grid>
              ) : (
                <Grid item>
                  <Button
                    className={classes.menuButton}
                    variant="outlined"
                    color="secondary"
                  >
                    <Link href="/auth/signin">Signin</Link>{" "}
                  </Button>
                </Grid>
              )}
              {/* </Typography> */}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}
