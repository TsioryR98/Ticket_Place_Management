import { Admin, Resource, CustomRoutes } from "react-admin";
import { authProvider } from "./Provider/authProvider";
import { Route } from "react-router-dom";
import { userDataProvider } from "./Provider/userProvider";
import { userList } from "./components/userList";
import SignIn from "./components/loginPage/LoginPage";
import RegisterPage from "./components/registerPage/RegisterPage";
export const App = () => (
  <Admin
    loginPage={SignIn}
    dataProvider={userDataProvider}
    authProvider={authProvider}
  >
    <CustomRoutes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/signin" element={<SignIn />} />
    </CustomRoutes>
    <Resource name="users" list={userList} />
  </Admin>
);
