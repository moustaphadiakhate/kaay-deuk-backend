import { Admin, Resource } from 'react-admin';
import { BrowserRouter } from 'react-router-dom';
import { authProvider } from './admin/authProvider';
import { dataProvider } from './admin/dataProvider';
import { Dashboard } from './admin/Dashboard';
import { LogementList } from './admin/resources/logements/LogementList';
import { LogementCreate } from './admin/resources/logements/LogementCreate';
import { LogementEdit } from './admin/resources/logements/LogementEdit';
import { LogementShow } from './admin/resources/logements/LogementShow';
import { AdminList } from './admin/resources/admins/AdminList';
import { AdminCreate } from './admin/resources/admins/AdminCreate';
import { AdminEdit } from './admin/resources/admins/AdminEdit';
import { AdminShow } from './admin/resources/admins/AdminShow';
import { ReservationList } from './admin/resources/reservations/ReservationList';
import { ReservationShow } from './admin/resources/reservations/ReservationShow';
import { ReservationCreate } from './admin/resources/reservations/ReservationCreate';
import { UtilisateurList } from './admin/resources/utilisateurs/UtilisateurList';
import { UtilisateurShow } from './admin/resources/utilisateurs/UtilisateurShow';
import { PaiementList } from './admin/resources/paiements/PaiementList';
import { PaiementShow } from './admin/resources/paiements/PaiementShow';
import { Visite3DList } from './admin/resources/visites-3d/Visite3DList';
import { Visite3DShow } from './admin/resources/visites-3d/Visite3DShow';
import { BriquesList } from './admin/resources/briques/BriquesList';
import { BriquesAttribuer } from './admin/resources/briques/BriquesAttribuer';

const theme = {
  palette: {
    primary: { main: '#2C1A0E' },
    secondary: { main: '#C8501A' },
    background: { default: '#FAF6EE', paper: '#FFFFFF' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
  },
};

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <Admin
        title="KaayDeuk — Administration"
        authProvider={authProvider}
        dataProvider={dataProvider}
        dashboard={Dashboard}
        // @ts-ignore — theme prop accepted at runtime
        theme={theme}
      >
        <Resource
          name="logements"
          list={LogementList}
          create={LogementCreate}
          edit={LogementEdit}
          show={LogementShow}
          options={{ label: 'Logements' }}
        />
        <Resource
          name="admins"
          list={AdminList}
          create={AdminCreate}
          edit={AdminEdit}
          show={AdminShow}
          options={{ label: 'Administrateurs' }}
        />
        <Resource
          name="reservations"
          list={ReservationList}
          create={ReservationCreate}
          show={ReservationShow}
          options={{ label: 'Réservations' }}
        />
        <Resource
          name="utilisateurs"
          list={UtilisateurList}
          show={UtilisateurShow}
          options={{ label: 'Utilisateurs' }}
        />
        <Resource
          name="paiements"
          list={PaiementList}
          show={PaiementShow}
          options={{ label: 'Paiements' }}
        />
        <Resource
          name="visites-3d"
          list={Visite3DList}
          show={Visite3DShow}
          options={{ label: 'Visites 3D' }}
        />
        <Resource
          name="briques"
          list={BriquesList}
          create={BriquesAttribuer}
          options={{ label: '🧱 Briques' }}
        />
      </Admin>
    </BrowserRouter>
  );
}
