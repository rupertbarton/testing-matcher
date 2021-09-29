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

export const addMessage = (newMessage: string): types.action<string> => {
  return {
    type: "settings/addMessage",
    payload: newMessage,
  };
};

export const clearMessages = (): types.action<boolean> => {
  return {
    type: "settings/clearMessages",
    payload: true,
  };
};

export const initialise = (username: string): types.action<string> => {
  return {
    type: "settings/initialise",
    payload: username,
  };
};
