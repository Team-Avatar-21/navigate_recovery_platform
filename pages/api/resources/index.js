const admin = require("firebase-admin");
const account = require("../../../navigate-recovery-platfom-firebase-adminsdk-r5iv4-ea3204fe8f.json");
import axios from "axios";
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

const UPDATE_FILTERS = (fs) => {
  let objects = "";
  Object.keys(fs).forEach((filter) => {
    objects += `{filter_human_name: "${fs[filter].filter_human_name}", filter_name: "${fs[filter].filter_name}", filter_type: "${fs[filter].filter_type}", id: ${fs[filter].id}, important: ${fs[filter].important}, important_attr: ${fs[filter].important_attr}}, `;
  });
  return {
    query: `mutation UPDAT_FILTERS {
            insert_filters_new(objects: [
                ${objects}
            ],
                on_conflict: {
                    constraint: filters_new_filter_name_key, 
                    update_columns: [filter_name, filter_human_name, important, important_attr]
                }) {
              affected_rows
            }
          }`,
  };
};

const ADD_COLUMN = (name, nullable, default_val, type) => {
  return `ALTER TABLE resources_new ADD COLUMN ${name} VARCHAR ${
    nullable ? "" : "NOT NULL"
  } DEFAULT '${default_val}';`;
};
const DROP_COLUMN = (name) => {
  return `ALTER TABLE resources_new DROP COLUMN ${name};`;
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
    axios
      .post(
        "https://testing-heroku-docker.herokuapp.com/v1/query",

        {
          type: "run_sql",
          args: {
            sql: ADD_COLUMN(filter_name, nullable, default_val, filter_type),
          },
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "content-type": "application/json",
          },
        }
      )
      .then((result) => {
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
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }

  if (req.method == "DELETE") {
    const { id, filter_name, token } = req.body;
    return axios
      .post(
        "https://testing-heroku-docker.herokuapp.com/v1/query",

        {
          type: "run_sql",
          args: {
            sql: DROP_COLUMN(filter_name),
          },
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "content-type": "application/json",
          },
        }
      )
      .then((result) => {
        return fetch(REMOVE_FILTER(id), token)
          .then((response) => {
            res.status(200).send("success");
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
  if (req.method == "PUT") {
    const { attributes, token } = req.body;
    return fetch(UPDATE_FILTERS(attributes), token)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
};
