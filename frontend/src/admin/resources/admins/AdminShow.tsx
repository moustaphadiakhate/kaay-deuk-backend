import {
  Show,
  SimpleShowLayout,
  TextField,
  EmailField,
  DateField,
  ArrayField,
  Datagrid,
  NumberField,
} from 'react-admin';

export const AdminShow = () => (
  <Show title="Détail administrateur">
    <SimpleShowLayout>
      <NumberField source="id" label="ID" />
      <TextField source="nom" label="Nom" />
      <EmailField source="email" label="Email" />
      <TextField source="telephone" label="Téléphone" />
      <TextField source="rib" label="RIB" />
      <TextField source="typeUtilisateur" label="Type" />
      <DateField source="dateCreation" label="Créé le" showTime />
      <ArrayField source="logements">
        <Datagrid bulkActionButtons={false}>
          <NumberField source="id" label="ID" />
          <TextField source="titre" label="Titre" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);
