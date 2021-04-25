const getResourceUsageDesc = (r_arr) => {
  const resource_usage_obj = {};
  r_arr = r_arr?.resources_new;
  r_arr.forEach((resource, idx) => {
    const { name } = resource;
    const usage_count = resource.peer_visits_aggregate.aggregate.count;
    const usage_res = resource_usage_obj[usage_count] || [];
    usage_res.push(name);
    resource_usage_obj[usage_count] = usage_res;
  });
  return resource_usage_obj;
};

export { getResourceUsageDesc };
