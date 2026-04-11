import {
  Show,
  SimpleShowLayout,
  TextField,
  EmailField,
  DateField,
  NumberField,
  FunctionField,
  ArrayField,
  Datagrid,
  TopToolbar,
} from 'react-admin';

const ShowActions = () => <TopToolbar />;

export const UtilisateurShow = () => (
  <Show title="Détail utilisateur" actions={<ShowActions />}>
    <SimpleShowLayout>
      <NumberField source="id" label="ID" />
      <TextField source="nom" label="Nom" />
      <EmailField source="email" label="Email" />
      <TextField source="telephone" label="Téléphone" />
      <TextField source="typeUtilisateur" label="Type" />
      <DateField source="dateCreation" label="Inscrit le" showTime />

      {/* Infos chercheur */}
      <FunctionField
        label="Locataire"
        render={(r: any) =>
          r.chercheur?.locataire
            ? `Oui — depuis ${r.chercheur.locataire.dateDebutContrat ? new Date(r.chercheur.locataire.dateDebutContrat).toLocaleDateString('fr-FR') : 'N/A'}`
            : 'Non'
        }
      />
      <FunctionField
        label="Favoris"
        render={(r: any) => r.chercheur?.favoris?.length ?? '—'}
      />

      {/* Réservations */}
      <ArrayField source="chercheur.reservations">
        <Datagrid bulkActionButtons={false}>
          <NumberField source="id" label="ID" />
          <TextField source="statut" label="Statut" />
        </Datagrid>
      </ArrayField>

      {/* Logements (admin) */}
      <ArrayField source="administrateur.logements">
        <Datagrid bulkActionButtons={false}>
          <NumberField source="id" label="ID" />
          <TextField source="titre" label="Titre" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);
