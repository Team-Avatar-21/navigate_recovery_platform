import fetch from "../fetch";
const parseAttrsForGraphQL = (attributes) => {
  let attrs = "";
  attributes.forEach((element) => {
    attrs += element + "\n";
  });
  return attrs;
};

const GET_RESOURCES = (attributes) => {
  let attrs = parseAttrsForGraphQL(attributes);
  const query = {
    query: `query GET_ALL_RESROUCES {
        resources_new {
          ${attrs}
          id
        }
      }`,
  };

  return query;
};

const fetchAllRes = async (attrs, token) => {
  const attributes = attrs.map((obj) => obj.attribute_name);

  const d = await fetch(GET_RESOURCES(attributes), token);

  // console.log(d);
  // setResources(d.resources_new);
  // res.dispatch({ type: "set", value: d.resources_new });
  // setIsFetched(true);
  return await d.resources_new;
};

export { fetchAllRes };
