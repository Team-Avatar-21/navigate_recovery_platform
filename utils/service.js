const pk = process.env.NEXT_PUBLIC_PRIVATE_KEY.replace(/\\n/g, "\n");
export default {
  type: "service_account",
  project_id: "navigate-recovery-platfom",
  private_key_id: process.env.NEXT_PUBLIC_PRIVATE_KEY_ID,
  private_key: pk,
  client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
  client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-r5iv4%40navigate-recovery-platfom.iam.gserviceaccount.com",
};
