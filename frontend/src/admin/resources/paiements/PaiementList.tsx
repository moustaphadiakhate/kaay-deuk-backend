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
  Pagination,
  useRecordContext,
} from 'react-admin';

const STATUT_COLORS: Record<string, { bg: string; color: string }> = {
  EN_ATTENTE: { bg: '#fef9c3', color: '#854d0e' },
  PAYE:       { bg: '#d1fae5', color: '#065f46' },
  ECHOUE:     { bg: '#fee2e2', color: '#991b1b' },
  REMBOURSE:  { bg: '#e0e7ff', color: '#3730a3' },
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
  <SelectInput key="statut" source="statut" label="Statut" alwaysOn choices={[
    { id: 'EN_ATTENTE', name: 'En attente' },
    { id: 'PAYE',       name: 'Payé' },
    { id: 'ECHOUE',     name: 'Échoué' },
    { id: 'REMBOURSE',  name: 'Remboursé' },
  ]} />,
  <SelectInput key="methode" source="methode" label="Méthode" choices={[
    { id: 'WAVE',         name: 'Wave' },
    { id: 'ORANGE_MONEY', name: 'Orange Money' },
    { id: 'CARTE',        name: 'Carte bancaire' },
    { id: 'ESPECES',      name: 'Espèces' },
  ]} />,
];

const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton />
  </TopToolbar>
);

export const PaiementList = () => (
  <List
    title="Paiements"
    actions={<ListActions />}
    filters={filters}
    sort={{ field: 'dateCreation', order: 'DESC' }}
    pagination={<Pagination rowsPerPageOptions={[10, 25, 50]} />}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <NumberField source="id" label="ID" />
      <FunctionField label="Locataire" render={(r: any) =>
        r.locataire?.chercheur?.utilisateur?.nom ?? '—'
      } />
      <NumberField source="montant" label="Montant (FCFA)" options={{ maximumFractionDigits: 0 }} />
      <TextField source="methode" label="Méthode" />
      <FunctionField label="Statut" render={() => <StatutBadge />} />
      <FunctionField label="Réservation" render={(r: any) =>
        r.reservation ? `#${r.reservation.id} — ${r.reservation.logement?.titre ?? ''}` : '—'
      } />
      <TextField source="referenceTransaction" label="Référence" />
      <DateField source="datePaiement" label="Date paiement" showTime />
      <DateField source="dateCreation" label="Créé le" showTime />
      <ShowButton />
    </Datagrid>
  </List>
);
