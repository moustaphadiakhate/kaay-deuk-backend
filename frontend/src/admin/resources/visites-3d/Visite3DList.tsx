import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  FunctionField,
  ShowButton,
  FilterButton,
  ExportButton,
  TopToolbar,
  SearchInput,
  Pagination,
  useRecordContext,
} from 'react-admin';

const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton />
  </TopToolbar>
);

const filters = [
  <SearchInput key="q" source="q" alwaysOn placeholder="Rechercher par chercheur ou logement…" />,
];

export const Visite3DList = () => (
  <List
    title="Visites 3D"
    actions={<ListActions />}
    filters={filters}
    sort={{ field: 'dateVisite', order: 'DESC' }}
    pagination={<Pagination rowsPerPageOptions={[10, 25, 50]} />}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <NumberField source="id" label="ID" />
      <FunctionField label="Chercheur" render={(r: any) => r.chercheur?.utilisateur?.nom ?? '—'} />
      <TextField source="chercheur.utilisateur.email" label="Email" />
      <FunctionField label="Logement" render={(r: any) => r.logement?.titre ?? '—'} />
      <TextField source="logement.ville" label="Ville" />
      <NumberField source="dureeVisite" label="Durée (s)" options={{ maximumFractionDigits: 0 }} />
      <DateField source="dateVisite" label="Date" showTime />
      <ShowButton />
    </Datagrid>
  </List>
);
