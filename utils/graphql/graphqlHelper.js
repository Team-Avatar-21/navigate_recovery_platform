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
      important_attr
      id
    }
  }`,
};

const GET_RESOURCE_VISIT = {
  query: `query GET_RESOURCE_VISIT {
    peer_visit(order_by: {visit_ts: desc}, limit: 1000) {
      peer {
        peer_id
      }
      resources {
        name
        city
        notes
      }
      visit_ts
    }
  }`,
};

const GET_RESOURCE_MONTH = (start, end) => {
  return {
    query: `query GET_RESOURCE_VISIT {
      resources_new(order_by: { id: desc}) {
        name
        id
        city
        peer_visits_aggregate(where: {visit_ts: {_gte: "${start}", _lt: "${end}"}}, order_by: {}) {
          aggregate {
            count(columns: visit_ts)
          }
          nodes {
            visit_ts
          }
        }
      }
    }`,
  };
};

const fetchResourceMonthUsage = async (token, start, end) => {
  const resources = await fetch(GET_RESOURCE_MONTH(start, end), token);
  return resources;
};

const fetchAllResourceUsage = async (token) => {
  const resource_usage = await fetch(GET_RESOURCE_VISIT, token);
  return resource_usage;
};

const fetchAllRes = async (attrs, token) => {
  const attributes = attrs.map((obj) => obj.attribute_name);

  const d = await fetch(GET_RESOURCES(attributes), token);

  return await d.resources_new;
};

const fetchAllAttrs = async (token) => {
  const attrs = await fetch(GET_ALL_ATTRS, token);

  return await attrs.filters_new;
};

export {
  fetchAllRes,
  fetchAllAttrs,
  fetchAllResourceUsage,
  fetchResourceMonthUsage,
  GET_ALL_ATTRS,
};
