import type * as types from "src/types";

export const setCurrentObject = (
  newObject: types.currentObject
): types.action<types.currentObject> => {
  return {
    type: "settings/setCurrentObject",
    payload: newObject,
  };
};

export const setCurrentError = (newError: string): types.action<string> => {
  return {
    type: "settings/setCurrentError",
    payload: newError,
  };
};
