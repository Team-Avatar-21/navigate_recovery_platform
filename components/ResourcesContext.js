import { useContext, createContext, useReducer, useState } from "react";
const ResourcesContext = createContext();

function resourcesReducer(state, action) {
  switch (action.type) {
    case "set_filters": {
      console.log("set filters");
      return { ...state, filters: action.value };
    }
    case "update": {
      console.log("update");
      const filtered_res = state.resources.filter((res) => {
        console.log(action.value.id);
        return action.value.id != res.id;
      });
      return { ...state, resources: [...filtered_res, action.value] };
    }
    case "set": {
      console.log("set");
      console.log(action);
      return { ...state, resources: action.value };
    }
    case "update_filters": {
      const newFilters = [...state.filters];
      const newRes = action.value.new;
      const oldRes = action.value.old;
      console.log("newres");
      console.log(newRes);
      newFilters.forEach((filter) => {
        const { filter_name } = filter;
        if (newRes[filter_name]) {
          filter.filter_options.add(newRes[filter_name]);
          // filter.filter_options.delete(oldRes[filter_name]);
        }
      });

      return { ...state, filters: [...newFilters] };
    }
  }
}

function ResourcesProvider({ children }) {
  const [state, dispatch] = useReducer(resourcesReducer, {
    resources: [],
    filters: [],
  });

  const value = { state, dispatch };

  return (
    <ResourcesContext.Provider value={value}>
      {children}
    </ResourcesContext.Provider>
  );
}
const useResources = () => {
  const context = useContext(ResourcesContext);
  return context;
};
export { ResourcesProvider, useResources };
