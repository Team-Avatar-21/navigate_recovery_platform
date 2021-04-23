const admin = require("firebase-admin");
const account = require("../../../navigate-recovery-platfom-firebase-adminsdk-r5iv4-ea3204fe8f.json");
import fetch from "../../../utils/fetch";
// // const private_key = process.env.FIREBASE_PK.replace(/\\n/g, "\n");
// const serviceAccount = account;
const makeFilterName = (name) => {
  const loweName = name.toLowerCase();
  const nameArr = loweName.split(" ");
  return nameArr.join("_");
};

const ADD_NEW_FILTER = (filter_data) => {
  let objects = "";
  Object.keys(filter_data).forEach(
    (key) => (objects += `${key}: "${filter_data[key]}", `)
  );
  const mutation = {
    query: `mutation ADD_NEW_FILTER {
            insert_filters_new(objects: {${objects}}) {
              returning {
                filter_human_name
                filter_name
                filter_type
                id
                important
                important_attr
              }
            }
          }`,
  };
  return mutation;
};

const REMOVE_FILTER = (id) => {
  return {
    query: `mutation REMOVE_FILTER {
        delete_filters_new_by_pk(id: ${id}) {
          filter_human_name
        }
      }`,
  };
};

export default async (req, res) => {
  if (req.method == "POST") {
    const {
      filter_human_name,
      filter_type,
      important,
      important_attr,
      nullable,
      default_val,
    } = req.body.data;
    const { token } = req.body;

    let filter_name = makeFilterName(filter_human_name);
    return fetch(
      ADD_NEW_FILTER({
        filter_human_name,
        filter_name,
        filter_type,
        important,
        important_attr,
      }),
      token
    )
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  }

  if (req.method == "DELETE") {
    const { id, token } = req.body;
    return fetch(REMOVE_FILTER(id), token)
      .then((response) => {
        res.status(200).send("success");
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
};
