import { Admin, Resource } from "react-admin";
import { authProvider } from "./provider/AuthProvider";
import { dataProvider } from "./provider/CombinedProvider";
import { userList } from "./resource/UserResource";
import SignIn from "./components/loginPage/LoginPage";

export const App = () => (
  <Admin
    loginPage={SignIn}
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
    <Resource name="users" list={userList} />
  </Admin>
);
export default App;
