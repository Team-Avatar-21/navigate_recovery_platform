const GRAPHQL_ENDPOINT =
  "https://testing-heroku-docker.herokuapp.com/v1/graphql";

const headers = {
  "Content-Type": "application/json",
  //   "x-hasura-admin-secret": "secret",
};

const _fetch = async (...args) => {
  let token = args[1];
  const options = {
    headers: { ...headers, Authorization: `Bearer ${token}` },
    method: "POST",
    body: JSON.stringify(args[0]),
  };

  const res = await fetch(GRAPHQL_ENDPOINT, options);
  const res_json = await res.json();

  if (res_json.errors) {
    throw res_json.errors;
  }
  return res_json.data;
};

export default _fetch;
