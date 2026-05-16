import {
  Create,
  SimpleForm,
  NumberInput,
  DateTimeInput,
  SelectInput,
  required,
  minValue,
} from 'react-admin';

const STATUT_CHOICES = [
  { id: 'EN_ATTENTE', name: 'En attente' },
  { id: 'CONFIRMEE',  name: 'Confirmée' },
  { id: 'ANNULEE',    name: 'Annulée' },
  { id: 'TERMINEE',   name: 'Terminée' },
];

export const ReservationCreate = () => (
  <Create title="Nouvelle Réservation" redirect="list">
    <SimpleForm
      defaultValues={{ statut: 'EN_ATTENTE' }}
    >
      <NumberInput
        source="chercheurId"
        label="ID du Chercheur (locataire)"
        validate={[required(), minValue(1)]}
        helperText="L'ID numérique du chercheur (visible dans Utilisateurs)"
        fullWidth
      />
      <NumberInput
        source="logementId"
        label="ID du Logement"
        validate={[required(), minValue(1)]}
        helperText="L'ID numérique du logement (visible dans Logements)"
        fullWidth
      />
      <DateTimeInput
        source="dateDebut"
        label="Date de début"
        validate={required()}
        fullWidth
      />
      <DateTimeInput
        source="dateFin"
        label="Date de fin"
        validate={required()}
        fullWidth
      />
      <NumberInput
        source="montantTotal"
        label="Montant total (FCFA)"
        validate={[required(), minValue(0)]}
        fullWidth
      />
      <NumberInput
        source="acompte"
        label="Acompte (FCFA) — optionnel"
        fullWidth
      />
      <SelectInput
        source="statut"
        label="Statut initial"
        choices={STATUT_CHOICES}
        validate={required()}
        fullWidth
      />
    </SimpleForm>
  </Create>
);
