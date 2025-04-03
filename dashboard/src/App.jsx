import { Admin, Resource } from "react-admin";
import { authProvider } from "./provider/AuthProvider";
import { dataProvider } from "./provider/CombinedProvider";
import { UserEdit, UserList, UserShow } from "./resource/UserResource";
import { EventList, EventShow } from "./resource/EventResource";
import SignIn from "./components/loginPage/LoginPage";
import { TicketProvider } from "./provider/TicketProvider";

//  dataProvider combiné
const dataProvider = {
  ...baseDataProvider,
  tickets: ticketDataProvider,
  getList: (resource, params) => {
    return resource === 'tickets' 
      ? ticketDataProvider.getList(resource, params)
      : baseDataProvider.getList(resource, params);
  },
  // Ajoutez les autres méthodes si nécessaire
};

export const App = () => (
  <Admin
    loginPage={SignIn}
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
<<<<<<< HEAD
    <Resource name="users" list={userList} />
    <Resource 
      name="tickets" 
      list={ticketList}
      edit={ticketEdit}
      create={ticketCreate}
    />
    {/* Ajoutez d'autres ressources si nécessaire */}
=======
    <Resource name="users" list={UserList} show={UserShow} edit={UserEdit} />
    <Resource name="events" list={EventList} show={EventShow} />
>>>>>>> c4021a26d233f4402a39aa45d4f80753989cb2a8
  </Admin>
);

export default App;
