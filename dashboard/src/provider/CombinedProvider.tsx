import { eventDataProvider } from "./EventProvider";
import { userDataProvider } from "./UserProvider";
import { combineDataProviders } from "react-admin";

export const dataProvider = combineDataProviders((resource) => {
  switch (resource) {
    case "events":
      return eventDataProvider;
    case "users":
      return userDataProvider;
    default:
      throw new Error(`Unknown resource: ${resource}`);
  }
});
