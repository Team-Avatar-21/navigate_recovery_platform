import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import { Button, Grid} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useSWR from "swr";
import { useState } from "react";
import { useAuth } from "../../utils/auth";
import Navbar from "../../components/Navbar";

const useStyle = makeStyles((theme) => ({
  userCard: {
    minWidth: "150px",
    minHeight: "150px",
  },
  container: {
    margin: "10px",
  },
}));

const columns = [
  { field: "email", headerName: "E-mail", width: 200 },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    valueGetter: (params) => {
      let { admin, coach, peer } = params.getValue("claims");
      if (admin) {
        return "admin";
      } else if (coach) {
        return "coach";
      } else if (peer) {
        return "peer";
      }
      return "N/A";
    },
  },
  { field: "lastLogin", headerName: "Last Login", width: 250 },
  { field: "createdAt", headerName: "Created", width: 250 },
];

export default function RemoveUsers() {
  const classes = useStyle();
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([]);
  const auth = useAuth();
  const admin = auth?.authState?.tokenResult?.claims?.admin;
  if (!admin) {
    return <>Access Denied</>;
  }
  const getAllUsers = async (url, token) => {
    const data = await axios
      .post(url, { token })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        err;
      });
    setRows(
      data.map((user, idx) => {
        return {
          id: idx,
          email: user.email,
          claims: user.customClaims,
          createdAt: user.metadata.creationTime,
          lastLogin: user.metadata.lastSignInTime,
          uid: user.uid,
        };
      })
    );
    return data;
  };

  const token = auth?.authState?.tokenResult?.token;
  const { data, error, isValidating } = useSWR(
    ["/api/user/get_all", token],
    getAllUsers,
    { revalidateOnFocus: false }
  );
  if (isValidating) {
    return <>Loading...</>;
  }

  const handleSelect = (selection) => {
    const { selectionModel: rowsIds } = selection;
    const newRows = [];
    rowsIds.forEach((rowId, idx) => {
      rowId = Number(rowId);
      newRows.push(rows[rowId].uid);
    });
    setSelectedRows(newRows);
  };
  const handleDelete = async () => {
    axios
      .delete("/api/user/delete_user", { data: { uids: selectedRows, token } })
      .then((res) => {
        setRows(rows.filter((row) => selectedRows.indexOf(row.uid) < 0));
        setSelectedRows([]);
      })
      .then((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Navbar />
      <Grid
        className={classes.container}
        container
        spacing={4}
        style={{ width: "95%" }}
      >
        <Button
          onClick={handleDelete}
          variant="contained"
          color="secondary"
          size="large"
        >
          Delete Selected Users
        </Button>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight={true}
          checkboxSelection
          onSelectionModelChange={handleSelect}
        />
      </Grid>
    </>
  );
}
