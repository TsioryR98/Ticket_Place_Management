import { Admin, Resource } from "react-admin";
import { authProvider } from "./provider/AuthProvider";
import { dataProvider } from "./provider/CombinedProvider";
import { userList } from "./resource/UserResource";
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
    <Resource name="users" list={userList} />
    <Resource 
      name="tickets" 
      list={ticketList}
      edit={ticketEdit}
      create={ticketCreate}
    />
    {/* Ajoutez d'autres ressources si nécessaire */}
  </Admin>
);

export default App;
