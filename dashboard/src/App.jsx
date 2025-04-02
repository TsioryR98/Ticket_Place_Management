import { Admin, Resource } from "react-admin";
import { authProvider } from "./provider/AuthProvider";
import { dataProvider } from "./provider/CombinedProvider";
import { UserList, UserShow } from "./resource/UserResource";
import { EventList } from "./resource/EventResource";
import SignIn from "./components/loginPage/LoginPage";

export const App = () => (
  <Admin
    loginPage={SignIn}
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
    <Resource name="users" list={UserList} show={UserShow} />
    <Resource name="events" list={EventList} />
  </Admin>
);
export default App;
