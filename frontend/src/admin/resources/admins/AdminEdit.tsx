import {
  Edit,
  SimpleForm,
  TextInput,
  PasswordInput,
  email,
  minLength,
  SaveButton,
  DeleteButton,
  Toolbar,
} from 'react-admin';

const EditToolbar = () => (
  <Toolbar sx={{ justifyContent: 'space-between' }}>
    <SaveButton />
    <DeleteButton mutationMode="pessimistic" />
  </Toolbar>
);

export const AdminEdit = () => (
  <Edit title="Modifier l'administrateur" redirect="list">
    <SimpleForm toolbar={<EditToolbar />}>
      <TextInput source="nom" label="Nom complet" fullWidth />
      <TextInput
        source="email"
        label="Email"
        fullWidth
        type="email"
        validate={email()}
      />
      <TextInput source="telephone" label="Téléphone" />
      <PasswordInput
        source="motDePasse"
        label="Nouveau mot de passe"
        fullWidth
        validate={minLength(8)}
        helperText="Laisser vide pour ne pas changer"
      />
      <TextInput source="rib" label="RIB" fullWidth />
    </SimpleForm>
  </Edit>
);
