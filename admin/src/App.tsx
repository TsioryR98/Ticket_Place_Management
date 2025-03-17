import { Admin, Resource } from "react-admin";
import { authProvider } from "./Provider/authProvider";
import { userDataProvider } from "./Provider/userProvider";
import { userList } from "./components/resource/userList";
import SignIn from "./components/loginPage/LoginPage";
export const App = () => (
  <Admin
    loginPage={SignIn}
    dataProvider={userDataProvider}
    authProvider={authProvider}
  >
    <Resource name="users" list={userList} />
  </Admin>
);
