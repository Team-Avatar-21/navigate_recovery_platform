import { useContext, createContext, useReducer, useState } from "react";
const ResourcesContext = createContext();

function resourcesReducer(state, action) {
  console.log(state);
  console.log(action);
  switch (action.type) {
    case "update": {
      const filtered_res = state.resources.filter((res) => {
        console.log(action.value.id);
        return action.value.id != res.id;
      });
      return { resources: [...filtered_res, action.value] };
    }
    case "set": {
      return { resources: action.value };
    }
  }
}

function ResourcesProvider({ children }) {
  const [state, dispatch] = useReducer(resourcesReducer, {
    resources: [],
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
