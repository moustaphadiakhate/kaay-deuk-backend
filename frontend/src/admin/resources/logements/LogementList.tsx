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
  useRefresh,
} from 'react-admin';
import { useEffect } from 'react';

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

// Composant interne pour refetch les données au montage
const LogementListContent = () => {
  const refresh = useRefresh();
  
  // Refetch automatiquement quand on accède à la page
  useEffect(() => {
    refresh();
  }, [refresh]);
  
  return (
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
    <LogementListContent />
  </List>
);
