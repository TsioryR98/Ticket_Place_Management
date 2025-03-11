import { Admin, Resource } from "react-admin";
import { authProvider } from "./authentication/authProvider";

export const App = () => (
  <Admin authProvider={authProvider}>
    <Resource />
  </Admin>
);
