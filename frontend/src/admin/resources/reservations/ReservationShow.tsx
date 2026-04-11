import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  FunctionField,
  ArrayField,
  Datagrid,
  EditButton,
  TopToolbar,
  SelectInput,
  useUpdate,
  useRefresh,
  useNotify,
  useRecordContext,
  Button,
} from 'react-admin';

const STATUT_CHOICES = [
  { id: 'EN_ATTENTE', name: 'En attente' },
  { id: 'CONFIRMEE',  name: 'Confirmée' },
  { id: 'ANNULEE',    name: 'Annulée' },
  { id: 'TERMINEE',   name: 'Terminée' },
];

const STATUT_COLORS: Record<string, { bg: string; color: string }> = {
  EN_ATTENTE: { bg: '#fef9c3', color: '#854d0e' },
  CONFIRMEE:  { bg: '#d1fae5', color: '#065f46' },
  ANNULEE:    { bg: '#fee2e2', color: '#991b1b' },
  TERMINEE:   { bg: '#e0e7ff', color: '#3730a3' },
};

const ShowActions = () => <TopToolbar />;

export const ReservationShow = () => (
  <Show title="Détail réservation" actions={<ShowActions />}>
    <SimpleShowLayout>
      <NumberField source="id" label="ID" />

      <FunctionField
        label="Statut"
        render={(r: any) => {
          const s = STATUT_COLORS[r.statut] ?? { bg: '#f3f4f6', color: '#374151' };
          return (
            <span style={{
              display: 'inline-block', padding: '4px 12px', borderRadius: 20,
              fontSize: 13, fontWeight: 600, background: s.bg, color: s.color,
            }}>
              {r.statut}
            </span>
          );
        }}
      />

      {/* Logement */}
      <FunctionField label="Logement" render={(r: any) =>
        r.logement ? `#${r.logement.id} — ${r.logement.titre} (${r.logement.ville})` : '—'
      } />
      <NumberField source="logement.prix" label="Prix logement (FCFA)" options={{ maximumFractionDigits: 0 }} />

      {/* Locataire */}
      <FunctionField label="Locataire" render={(r: any) =>
        r.chercheur?.utilisateur
          ? `${r.chercheur.utilisateur.nom} — ${r.chercheur.utilisateur.email}`
          : '—'
      } />
      <FunctionField label="Téléphone" render={(r: any) => r.chercheur?.utilisateur?.telephone ?? '—'} />

      {/* Dates */}
      <DateField source="dateDebut" label="Date de début" />
      <DateField source="dateFin" label="Date de fin" />
      <DateField source="dateReservation" label="Réservé le" showTime />

      {/* Montants */}
      <NumberField source="montantTotal" label="Montant total (FCFA)" options={{ maximumFractionDigits: 0 }} />
      <NumberField source="acompte" label="Acompte (FCFA)" options={{ maximumFractionDigits: 0 }} />

      {/* Paiements liés */}
      <ArrayField source="paiements">
        <Datagrid bulkActionButtons={false}>
          <NumberField source="id" label="ID" />
          <NumberField source="montant" label="Montant" options={{ maximumFractionDigits: 0 }} />
          <TextField source="methode" label="Méthode" />
          <TextField source="statut" label="Statut" />
          <DateField source="datePaiement" label="Date" showTime />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);
