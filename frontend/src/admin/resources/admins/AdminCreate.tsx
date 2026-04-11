import {
  Create,
  SimpleForm,
  TextInput,
  PasswordInput,
  required,
  email,
  minLength,
} from 'react-admin';

export const AdminCreate = () => (
  <Create title="Nouvel administrateur" redirect="list">
    <SimpleForm>
      <TextInput
        source="nom"
        label="Nom complet *"
        fullWidth
        validate={required()}
        helperText="Ex : Moussa Diallo"
      />
      <TextInput
        source="email"
        label="Email *"
        fullWidth
        type="email"
        validate={[required(), email()]}
      />
      <TextInput
        source="telephone"
        label="Téléphone *"
        validate={required()}
        helperText="Ex : +221771234567"
      />
      <PasswordInput
        source="motDePasse"
        label="Mot de passe *"
        fullWidth
        validate={[required(), minLength(8)]}
        helperText="Minimum 8 caractères"
      />
      <TextInput
        source="rib"
        label="RIB (optionnel)"
        fullWidth
        helperText="Numéro de compte bancaire"
      />
    </SimpleForm>
  </Create>
);
