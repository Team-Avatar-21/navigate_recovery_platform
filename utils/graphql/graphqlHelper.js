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
/**
 * GraphQL query to fetch all filters with available options
 * TODO: probably will have to rewrite schema to make it more efficient
 */
const GET_ALL_ATTRS = {
  query: `query GET_ALL_FILTERS {
    filters_new {
      filter_human_name
      filter_name
      filter_type
      important
    }
  }`,
};

const fetchAllRes = async (attrs, token) => {
  const attributes = attrs.map((obj) => obj.attribute_name);

  const d = await fetch(GET_RESOURCES(attributes), token);

  return await d.resources_new;
};

const fetchAllAttrs = async (token) => {
  const attrs = fetch(GET_ALL_ATTRS, token);

  return await attrs;
};

export { fetchAllRes, fetchAllAttrs };
