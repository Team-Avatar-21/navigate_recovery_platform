import * as admin from "firebase-admin";
import account from "../../../utils/service";

// // const private_key = process.env.FIREBASE_PK.replace(/\\n/g, "\n");
// const serviceAccount = account;

export default (req, res) => {
  if (admin.apps.length == 0) {
    admin.initializeApp({
      credential: admin.credential.cert(account),
    });
  }
  const { email, password, displayName, token } = req.body;

  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      if (!decodedToken.admin) {
        return res.status(400).json({ error: "access denied" });
      }

      let uid = null;
      admin
        .auth()
        .createUser({
          email,
          emailVerified: false,
          password,
          displayName,
          disabled: false,
        })
        .then(async (userRecord) => {
          uid = userRecord.uid;
          const customClaims = {
            "https://hasura.io/jwt/claims": {
              "x-hasura-default-role": "coach",
              "x-hasura-allowed-roles": ["peer", "coach"],
              "x-hasura-user-id": uid,
            },
            admin: false,
            coach: true,
            peer: true,
          };
          await admin.auth().setCustomUserClaims(uid, customClaims);
          let updatedRecord = await admin.auth().getUserByEmail(email);
          res.send(updatedRecord);
        })
        .catch((error) => {
          return res.status(409).json({ message: error.message });
        });
    });
};
