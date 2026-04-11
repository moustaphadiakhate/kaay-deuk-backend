import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  FunctionField,
  TopToolbar,
} from 'react-admin';

const ShowActions = () => <TopToolbar />;

const STATUT_COLORS: Record<string, { bg: string; color: string }> = {
  EN_ATTENTE: { bg: '#fef9c3', color: '#854d0e' },
  PAYE:       { bg: '#d1fae5', color: '#065f46' },
  ECHOUE:     { bg: '#fee2e2', color: '#991b1b' },
  REMBOURSE:  { bg: '#e0e7ff', color: '#3730a3' },
};

export const PaiementShow = () => (
  <Show title="Détail paiement" actions={<ShowActions />}>
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

      <NumberField source="montant" label="Montant (FCFA)" options={{ maximumFractionDigits: 0 }} />
      <TextField source="methode" label="Méthode de paiement" />
      <TextField source="referenceTransaction" label="Référence transaction" />

      {/* Locataire */}
      <FunctionField label="Locataire" render={(r: any) => {
        const u = r.locataire?.chercheur?.utilisateur;
        return u ? `${u.nom} — ${u.email} — ${u.telephone}` : '—';
      }} />
      <FunctionField label="Caution locataire (FCFA)" render={(r: any) =>
        r.locataire?.caution != null
          ? r.locataire.caution.toLocaleString('fr-FR') + ' FCFA'
          : '—'
      } />

      {/* Réservation liée */}
      <FunctionField label="Réservation" render={(r: any) =>
        r.reservation
          ? `#${r.reservation.id} — ${r.reservation.logement?.titre ?? ''} (${r.reservation.statut})`
          : '—'
      } />
      <FunctionField label="Logement" render={(r: any) =>
        r.reservation?.logement
          ? `${r.reservation.logement.titre}, ${r.reservation.logement.ville}`
          : '—'
      } />
      <FunctionField label="Période" render={(r: any) => {
        const res = r.reservation;
        if (!res) return '—';
        const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR');
        return `${fmt(res.dateDebut)} → ${fmt(res.dateFin)}`;
      }} />

      <DateField source="datePaiement" label="Date de paiement" showTime />
      <DateField source="dateCreation" label="Créé le" showTime />
    </SimpleShowLayout>
  </Show>
);
