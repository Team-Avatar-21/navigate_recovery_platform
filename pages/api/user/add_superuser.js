const admin = require("firebase-admin");
const account = require("../../../navigate-recovery-platfom-firebase-adminsdk-r5iv4-ea3204fe8f.json");
// // const private_key = process.env.FIREBASE_PK.replace(/\\n/g, "\n");
// const serviceAccount = account;

module.exports.createSuperUser = (req, res) => {
  if (admin.apps.length == 0) {
    admin.initializeApp({
      credential: admin.credential.cert(account),
    });
  }
  const { email, password, displayName } = req.body; // req.body = {email:value, password:value, displayName:value}

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
          "x-hasura-default-role": "admin",
          "x-hasura-allowed-roles": ["admin", "peer", "coach"],
          "x-hasura-user-id": uid,
        },
        admin: true,
        coach: true,
        peer: true,
      };
      await admin.auth().setCustomUserClaims(uid, customClaims);
      // console.log(claimsReturn);/
      let updatedRecord = await admin.auth().getUserByEmail(email);
      res.send(updatedRecord);
    })
    .catch((error) => {
      return res.status(409).json({ message: error.message });
    });
};
