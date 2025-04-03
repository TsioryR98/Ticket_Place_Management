import { eventDataProvider } from "./EventProvider";
import { orderDataProvider } from "./OrderProvider";
import { userDataProvider } from "./UserProvider";
import { combineDataProviders } from "react-admin";

export const dataProvider = combineDataProviders((resource) => {
  switch (resource) {
    case "events":
      return eventDataProvider;
    case "users":
      return userDataProvider;
    case "orders":
      return orderDataProvider;
    default:
      throw new Error(`Unknown resource: ${resource}`);
  }
});
