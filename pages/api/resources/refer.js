import * as admin from "firebase-admin";
import account from "../../../utils/service";
import fetch from "../../../utils/fetch";

const GET_PEER_ID_BY_EMAIL = (email) => {
  return {
    query: `query GET_PEER_ID_BY_EMAIL {
        peer(where: {peer_email: {_eq: "${email}"}}) {
          peer_id
        }
      }`,
  };
};

const REFER_PEER = (peer_id, id) => {
  return {
    query: `mutation REFER_PEER {
        insert_peer_visit_one(object: {peer_id: ${peer_id}, resource_id: ${id}}) {
          peer_id
          resource_id
          visit_ts
          peer {
            peer_email
          }
          resources {
            name
          }
        }
      }`,
  };
};

export default async (req, res) => {
  const { id, peer_email: email, token } = req.body;

  fetch(GET_PEER_ID_BY_EMAIL(email), token)
    .then(({ peer }) => {
      if (peer.length == 0) {
        return res
          .status(400)
          .send({ message: `No Peer with email ${email} found.` });
      }
      const { peer_id } = peer[0];
      fetch(REFER_PEER(peer_id, id), token)
        .then((result) => {
          return res.json(result);
        })
        .catch((err) => {
          return res.status(400).json(err);
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
};
