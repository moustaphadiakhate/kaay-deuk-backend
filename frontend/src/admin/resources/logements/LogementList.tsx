import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  DateField,
  EditButton,
  ShowButton,
  DeleteButton,
  FilterButton,
  TextInput,
  NumberInput,
  BooleanInput,
  SelectInput,
  TopToolbar,
  CreateButton,
  ExportButton,
  useListContext,
  Pagination,
} from 'react-admin';

const logementFilters = [
  <TextInput key="ville" source="ville" label="Ville" alwaysOn />,
  <NumberInput key="prixMin" source="prixMin" label="Prix min (FCFA)" />,
  <NumberInput key="prixMax" source="prixMax" label="Prix max (FCFA)" />,
  <BooleanInput key="disponible" source="disponible" label="Disponible seulement" />,
];

const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton label="Nouveau logement" />
    <ExportButton />
  </TopToolbar>
);

const LogementPagination = () => (
  <Pagination rowsPerPageOptions={[5, 10, 25, 50]} />
);

// Petit composant pour afficher le statut de disponibilité avec couleur
const DispoField = ({ record }: { record?: { disponible?: boolean } }) => {
  if (!record) return null;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        background: record.disponible ? '#d1fae5' : '#fee2e2',
        color: record.disponible ? '#065f46' : '#991b1b',
      }}
    >
      {record.disponible ? '● Disponible' : '● Occupé'}
    </span>
  );
};

export const LogementList = () => (
  <List
    filters={logementFilters}
    actions={<ListActions />}
    pagination={<LogementPagination />}
    sort={{ field: 'dateCreation', order: 'DESC' }}
    perPage={10}
    title="Logements — KaayDeuk"
  >
    <Datagrid
      rowClick="show"
      sx={{
        '& .RaDatagrid-headerCell': {
          fontWeight: 700,
          fontSize: 13,
          background: '#FAF6EE',
        },
        '& .RaDatagrid-row:hover': { background: '#FFF8F0' },
      }}
    >
      <TextField source="id" label="ID" />
      <TextField source="titre" label="Titre" />
      <TextField source="ville" label="Ville" />
      <NumberField
        source="prix"
        label="Prix / mois"
        options={{ style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }}
      />
      <NumberField source="superficie" label="Superficie (m²)" />
      <NumberField source="nombrePieces" label="Pièces" />
      <TextField source="typeLogement.libelle" label="Type" />
      <BooleanField source="disponible" label="Dispo" />
      <DateField source="dateCreation" label="Créé le" showTime={false} />
      <EditButton label="" />
      <ShowButton label="" />
      <DeleteButton label="" />
    </Datagrid>
  </List>
);
