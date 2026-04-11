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
  SelectInput,
  SearchInput,
  Pagination,
  useRecordContext,
} from 'react-admin';

const STATUT_COLORS: Record<string, { bg: string; color: string }> = {
  EN_ATTENTE: { bg: '#fef9c3', color: '#854d0e' },
  CONFIRMEE:  { bg: '#d1fae5', color: '#065f46' },
  ANNULEE:    { bg: '#fee2e2', color: '#991b1b' },
  TERMINEE:   { bg: '#e0e7ff', color: '#3730a3' },
};

const StatutBadge = () => {
  const record = useRecordContext();
  if (!record) return null;
  const style = STATUT_COLORS[record.statut] ?? { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 600, background: style.bg, color: style.color,
    }}>
      {record.statut}
    </span>
  );
};

const filters = [
  <SearchInput key="q" source="q" alwaysOn placeholder="Rechercher…" />,
  <SelectInput key="statut" source="statut" label="Statut" choices={[
    { id: 'EN_ATTENTE', name: 'En attente' },
    { id: 'CONFIRMEE',  name: 'Confirmée' },
    { id: 'ANNULEE',    name: 'Annulée' },
    { id: 'TERMINEE',   name: 'Terminée' },
  ]} />,
];

const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton />
  </TopToolbar>
);

export const ReservationList = () => (
  <List
    title="Réservations"
    actions={<ListActions />}
    filters={filters}
    sort={{ field: 'dateReservation', order: 'DESC' }}
    pagination={<Pagination rowsPerPageOptions={[10, 25, 50]} />}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <NumberField source="id" label="ID" />
      <FunctionField label="Logement" render={(r: any) => r.logement?.titre ?? '—'} />
      <FunctionField label="Locataire" render={(r: any) => r.chercheur?.utilisateur?.nom ?? '—'} />
      <DateField source="dateDebut" label="Début" />
      <DateField source="dateFin" label="Fin" />
      <NumberField source="montantTotal" label="Montant (FCFA)" options={{ maximumFractionDigits: 0 }} />
      <FunctionField label="Statut" render={() => <StatutBadge />} />
      <DateField source="dateReservation" label="Réservé le" showTime />
      <ShowButton />
    </Datagrid>
  </List>
);
