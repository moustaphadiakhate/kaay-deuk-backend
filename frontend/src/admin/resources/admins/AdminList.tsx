import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  NumberField,
  DeleteButton,
  EditButton,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  SearchInput,
  FunctionField,
} from 'react-admin';

const adminFilters = [
  <SearchInput source="q" alwaysOn placeholder="Rechercher un admin…" />,
];

const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton label="Nouvel admin" />
    <ExportButton />
  </TopToolbar>
);

export const AdminList = () => (
  <List
    title="Administrateurs"
    actions={<ListActions />}
    filters={adminFilters}
    sort={{ field: 'id', order: 'DESC' }}
  >
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <NumberField source="id" label="ID" />
      <TextField source="nom" label="Nom" />
      <EmailField source="email" label="Email" />
      <TextField source="telephone" label="Téléphone" />
      <TextField source="rib" label="RIB" />
      <FunctionField
        label="Logements"
        render={(record: any) => record.logements?.length ?? 0}
      />
      <DateField source="dateCreation" label="Créé le" showTime />
      <EditButton />
      <DeleteButton mutationMode="pessimistic" />
    </Datagrid>
  </List>
);
