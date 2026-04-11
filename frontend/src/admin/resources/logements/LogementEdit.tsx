import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  SelectInput,
  required,
  minValue,
  maxLength,
  SaveButton,
  DeleteButton,
  Toolbar,
} from 'react-admin';

const TYPE_CHOICES = [
  { id: 1, name: 'Appartement' },
  { id: 2, name: 'Maison' },
  { id: 3, name: 'Studio' },
  { id: 4, name: 'Villa' },
  { id: 5, name: 'Chambre' },
];

const EditToolbar = () => (
  <Toolbar sx={{ justifyContent: 'space-between' }}>
    <SaveButton />
    <DeleteButton mutationMode="pessimistic" />
  </Toolbar>
);

export const LogementEdit = () => (
  <Edit title="Modifier le logement" redirect="list">
    <SimpleForm toolbar={<EditToolbar />}>
      {/* ── Informations de base ─────────────────────────────────────────── */}
      <TextInput
        source="titre"
        label="Titre de l'annonce *"
        fullWidth
        validate={[required(), maxLength(200)]}
      />
      <TextInput
        source="description"
        label="Description"
        fullWidth
        multiline
        rows={4}
        validate={maxLength(2000)}
      />

      {/* ── Localisation ─────────────────────────────────────────────────── */}
      <TextInput source="adresse" label="Adresse" fullWidth validate={required()} />
      <TextInput source="ville" label="Ville" validate={required()} />

      {/* ── Caractéristiques ─────────────────────────────────────────────── */}
      <SelectInput
        source="typeLogementId"
        label="Type de logement"
        choices={TYPE_CHOICES}
        validate={required()}
      />
      <NumberInput
        source="prix"
        label="Prix mensuel (FCFA)"
        validate={[required(), minValue(1)]}
      />
      <NumberInput source="caution" label="Caution (FCFA)" validate={minValue(0)} />
      <NumberInput source="superficie" label="Superficie (m²)" validate={[required(), minValue(1)]} />
      <NumberInput source="nombrePieces" label="Nombre de pièces" validate={[required(), minValue(1)]} />
      <BooleanInput source="disponible" label="Disponible à la location" />

      {/* ── Images ───────────────────────────────────────────────────────── */}
      <TextInput
        source="images"
        label="Images (JSON)"
        fullWidth
        multiline
        rows={4}
        format={(v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v ?? [], null, 2))}
        parse={(v: string) => {
          try { return JSON.parse(v); } catch { return []; }
        }}
        helperText='Tableau JSON : [{"url":"...","description":"...","ordreAffichage":0}]'
      />
      <TextInput
        source="images3D"
        label="Images 3D / 360° (JSON)"
        fullWidth
        multiline
        rows={4}
        format={(v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v ?? [], null, 2))}
        parse={(v: string) => {
          try { return JSON.parse(v); } catch { return []; }
        }}
        helperText='Tableau JSON : [{"url":"...","type":"360","ordreAffichage":0}]'
      />
    </SimpleForm>
  </Edit>
);
