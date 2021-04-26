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
  const { token, uids } = req.body;

  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      if (!decodedToken.admin) {
        return res.status(400).json({ error: "access denied" });
      }
      admin
        .auth()
        .deleteUsers(uids)
        .then((deleteUsersResult) => {
          console.log(
            `Successfully deleted ${deleteUsersResult.successCount} users`
          );
          console.log(
            `Failed to delete ${deleteUsersResult.failureCount} users`
          );
          deleteUsersResult.errors.forEach((err) => {
            console.log(err.error.toJSON());
          });
          return res.status(200).json({ status: "success" });
        })
        .catch((error) => {
          console.log("Error deleting users:", error);
          return res.status(400).json({ error: error.message });
        });
    });
};
