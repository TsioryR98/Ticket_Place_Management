import { Admin, CustomRoutes, Resource } from "react-admin";
import { Route } from 'react-router-dom'; // <-- Ajoutez cette importation
import { authProvider } from "./provider/AuthProvider";
import { dataProvider } from "./provider/CombinedProvider";
import { UserEdit, UserList, UserShow } from "./resource/UserResource";
import { OrderList, OrderShow } from "./resource/OrderResource";
import {
  EventCreate,
  EventEdit,
  EventList,
  EventShow,
} from "./resource/EventResource";
import SignIn from "./components/loginPage/LoginPage";
import { EventShowWithOrders } from "./resource/EventShowWithOrders";

export const App = () => (
  <Admin
    loginPage={SignIn}
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
    <Resource name="users" list={UserList} show={UserShow} edit={UserEdit} />
    <Resource
      name="events"
      list={EventList}
      show={EventShow}
      edit={EventEdit}
      create={EventCreate}
    />
    <Resource
      name="orders"
      list={OrderList}
      show={OrderShow}
    />
    <CustomRoutes>
      <Route
        path="/events/:id/show-with-orders"
        element={<EventShowWithOrders />}
      />
    </CustomRoutes>
  </Admin>
);

export default App;