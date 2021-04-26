import {
  Grid,
  Typography,
  Select,
  Container,
  Button,
  TextField,
  FormControl,
  MenuItem,
  InputLabel,
  Box,
} from "@material-ui/core";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../utils/auth";
import useSWR from "swr";
import fetch from "../../utils/fetch";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";
import PeerDetailTable from "../../components/PeerDetailTable";

/**
 * Displays page with resources and filters
 */

/**
 * GraphQL query to fetch all filters with available options
 * TODO: probably will have to rewrite schema to make it more efficient
 */
const GET_ALL_PEERS = {
  query: `query GET_ALL_PEERS {
      peer {
        emergency_name
        emergency_number
        first_name
        last_name
        nick_name
        notes
        peer_email
        peer_id
        peer_number
        resource_id
      }
      peer_visit {
        peer_id
        visit_ts
      }
    }`,
};

/**
* Styling classes for Material UI components
*/
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  layout: {
    margin: "10px",
  },
}));

export default function Resources() {
  const classes = useStyles();
  const auth = useAuth();
  const [peers, setPeers] = useState({});
  const token = auth?.authState?.tokenResult?.token;
  /**
   * Method that fetches all filter values from the DB
   * also sets attributes based of the filters
   * @param  {...any} args not sure what this is here for, just keep it for now
   * @returns {Object} response object from GraphQL endpoint
   */
  const getData = async (token) => {
    await fetch(GET_ALL_PEERS, token)
      .then((data) => {
        setPeers(data.peer);
        console.info(data);
    })
    .catch((err) => {
        console.error(err)
    })
  };

  const { data, error } = useSWR(token, getData);

  if (!auth.user) {
    return "access deined";
  }

  return (
    <Box className={classes.layout}>
      <Navbar />
      <Grid container justify="center" direction="column" spacing={4}>
          <ol>
              <li>
                  <Link href="/peer/create_peer">Create New Profile</Link>
              </li>
          </ol>
          {(() => {
              const peerRows = [];

              for (let i = 0; i < peers.length; i++) {
                peerRows.push(<PeerDetailTable peer={peers[i]}/>);
              }

              return peerRows;
            })()}
      </Grid>
    </Box>
  );
}