import { Admin, Resource } from "react-admin";
import { authProvider } from "./provider/AuthProvider";
import { dataProvider } from "./provider/CombinedProvider";
import { UserEdit, UserList, UserShow } from "./resource/UserResource";
import { EventList, EventShow } from "./resource/EventResource";
import SignIn from "./components/loginPage/LoginPage";

export const App = () => (
  <Admin
    loginPage={SignIn}
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
    <Resource name="users" list={UserList} show={UserShow} edit={UserEdit} />
    <Resource name="events" list={EventList} show={EventShow} />
  </Admin>
);
export default App;
