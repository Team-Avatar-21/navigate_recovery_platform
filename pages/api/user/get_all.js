import * as admin from "firebase-admin";
import account from "../../../utils/service";

export default async (req, res) => {
  if (admin.apps.length == 0) {
    admin.initializeApp({
      credential: admin.credential.cert(account),
    });
  }
  const { token } = req.body;
  const listAllUsers = async (nextPageToken) => {
    // List batch of users, 1000 at a time.
    return admin
      .auth()
      .listUsers(1000, nextPageToken)
      .then((listUsersResult) => {
        let users = [];
        listUsersResult.users.forEach((userRecord) => {
          users.push(userRecord.toJSON());
        });
        if (listUsersResult.pageToken) {
          // List next batch of users.
          return [...users, listAllUsers(listUsersResult.pageToken)];
        }
        return users;
      })
      .catch((error) => {
        console.log("Error listing users:", error);
      });
  };

  const data = await admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      if (!decodedToken.admin) {
        console.log("access denied");
        return res.status(400).json({ error: "access denied" });
      }
      return listAllUsers();
    })
    .catch((err) => {
      console.log(err);
    });
  return res.json(data);
};
