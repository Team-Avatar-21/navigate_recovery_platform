import { useAuth } from "../../utils/auth";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    margin: theme.spacing(1),
  },
}));
export default function AdminIndex() {
  const classes = useStyles();
  const auth = useAuth();
  const admin = auth?.authState?.tokenResult?.claims?.admin;
  if (!admin) {
    return "Access Denied";
  }
  return (
    <>
      <Navbar />
      <ol>
        <Link href="/admin/add_users">
          <Button
            className={classes.menuButton}
            variant="outlined"
            color="primary"
          >
            Add Users
          </Button>
        </Link>

        <Link href="/admin/remove_users">
          <Button
            className={classes.menuButton}
            variant="outlined"
            color="primary"
          >
            Remove Users
          </Button>
        </Link>

        <Link href="/admin/add_resources">
          <Button
            className={classes.menuButton}
            variant="outlined"
            color="primary"
          >
            Add Resources
          </Button>
        </Link>

        <Link href="/admin/edit_resource_schema">
          <Button
            className={classes.menuButton}
            variant="outlined"
            color="primary"
          >
            Edit Resource Skeleton
          </Button>
        </Link>
        
        <Link href="/resources/usage">
          <Button
            className={classes.menuButton}
            variant="outlined"
            color="primary"
          >
            View Resource Usage
          </Button>
        </Link>
        
      </ol>
    </>
  );
}
