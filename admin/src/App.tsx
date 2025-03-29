// App.tsx
import { Admin, Resource } from "react-admin";
import { authProvider } from "./Provider/AuthProvider";
import { dataProvider } from "./Provider/CombinedProvider";
import { EventList } from "./components/event/EventList";
import { userList } from "./resource/UserResource";
import SignIn from "./components/loginPage/LoginPage";

export const App = () => (
  <Admin
    loginPage={SignIn}
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
    <Resource name="users" list={userList} />
    <Resource name="events" list={EventList} />
  </Admin>
);
