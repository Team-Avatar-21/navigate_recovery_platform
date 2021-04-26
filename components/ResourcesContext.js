import { useContext, createContext, useReducer } from "react";
const ResourcesContext = createContext();

function resourcesReducer(state, action) {
  switch (action.type) {
    case "set_filters": {
      return { ...state, filters: action.value };
    }
    case "set_attrs": {
      return { ...state, attrs: action.value };
    }
    case "update": {
      const filtered_res = state.resources.filter((res) => {
        return action.value.id != res.id;
      });
      return { ...state, resources: [...filtered_res, action.value] };
    }
    case "set": {
      return { ...state, resources: action.value };
    }
    case "update_filters": {
      const newFilters = [...state.filters];
      const newRes = action.value.new;
      const oldRes = action.value.old;

      newFilters.forEach((filter) => {
        const { filter_name } = filter;
        if (newRes[filter_name] != oldRes[filter_name]) {
          filter.filter_options.add(newRes[filter_name]);
          const newValCount = filter.filter_value_obj[newRes[filter_name]] || 0;
          filter.filter_value_obj[newRes[filter_name]] = newValCount + 1;
          filter.filter_value_obj[oldRes[filter_name]] -= 1;
          const oldValCount = filter.filter_value_obj[oldRes[filter_name]];
          if (oldValCount <= 0) {
            filter.filter_options.delete(oldRes[filter_name]);
            delete filter.filter_value_obj[oldRes[filter_name]];
          }
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
    attrs: [],
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
