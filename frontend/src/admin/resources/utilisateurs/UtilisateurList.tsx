import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  NumberField,
  FunctionField,
  ShowButton,
  FilterButton,
  ExportButton,
  TopToolbar,
  SelectInput,
  SearchInput,
  Pagination,
  useRecordContext,
} from 'react-admin';

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  ADMIN:     { bg: '#ede9fe', color: '#5b21b6' },
  CHERCHEUR: { bg: '#dbeafe', color: '#1e40af' },
};

const TypeBadge = () => {
  const record = useRecordContext();
  if (!record) return null;
  const style = TYPE_COLORS[record.typeUtilisateur] ?? { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 600, background: style.bg, color: style.color,
    }}>
      {record.typeUtilisateur}
    </span>
  );
};

const filters = [
  <SearchInput key="q" source="q" alwaysOn placeholder="Nom, email, téléphone…" />,
  <SelectInput key="typeUtilisateur" source="typeUtilisateur" label="Type" choices={[
    { id: 'ADMIN',     name: 'Administrateur' },
    { id: 'CHERCHEUR', name: 'Chercheur' },
  ]} />,
];

const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton />
  </TopToolbar>
);

export const UtilisateurList = () => (
  <List
    title="Utilisateurs"
    actions={<ListActions />}
    filters={filters}
    sort={{ field: 'dateCreation', order: 'DESC' }}
    pagination={<Pagination rowsPerPageOptions={[10, 25, 50]} />}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <NumberField source="id" label="ID" />
      <TextField source="nom" label="Nom" />
      <EmailField source="email" label="Email" />
      <TextField source="telephone" label="Téléphone" />
      <FunctionField label="Type" render={() => <TypeBadge />} />
      <FunctionField
        label="Réservations"
        render={(r: any) => r.chercheur?.reservations?.length ?? '—'}
      />
      <DateField source="dateCreation" label="Inscrit le" showTime />
      <ShowButton />
    </Datagrid>
  </List>
);
