import { Admin, Resource } from 'react-admin';
import { BrowserRouter } from 'react-router-dom';
import { authProvider } from './admin/authProvider';
import { dataProvider } from './admin/dataProvider';
import { LogementList } from './admin/resources/logements/LogementList';
import { LogementCreate } from './admin/resources/logements/LogementCreate';
import { LogementEdit } from './admin/resources/logements/LogementEdit';
import { LogementShow } from './admin/resources/logements/LogementShow';

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
      </Admin>
    </BrowserRouter>
  );
}
