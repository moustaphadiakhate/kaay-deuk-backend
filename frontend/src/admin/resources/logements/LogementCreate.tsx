import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  SelectInput,
  required,
  minValue,
  maxLength,
} from 'react-admin';

// Valeurs pour la liste déroulante des types (ID statiques correspondant au seed)
const TYPE_CHOICES = [
  { id: 1, name: 'Appartement' },
  { id: 2, name: 'Maison' },
  { id: 3, name: 'Studio' },
  { id: 4, name: 'Villa' },
  { id: 5, name: 'Chambre' },
];

// L'admin ID est celui du super admin créé par le seed (id=1)
export const LogementCreate = () => (
  <Create
    title="Nouveau logement"
    redirect="list"
  >
    <SimpleForm
      defaultValues={{
        disponible: true,
        images: [],
        images3D: [],
        administrateurId: 1,
      }}
    >
      {/* ── Informations de base ─────────────────────────────────────────── */}
      <TextInput
        source="titre"
        label="Titre de l'annonce *"
        fullWidth
        validate={[required(), maxLength(200)]}
        helperText="Ex : Appartement moderne Centre-Ville"
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
      <TextInput
        source="adresse"
        label="Adresse *"
        fullWidth
        validate={required()}
        helperText="Nom de la rue, quartier"
      />
      <TextInput
        source="ville"
        label="Ville *"
        validate={required()}
        defaultValue="Thiès"
      />

      {/* ── Caractéristiques ─────────────────────────────────────────────── */}
      <SelectInput
        source="typeLogementId"
        label="Type de logement *"
        choices={TYPE_CHOICES}
        validate={required()}
      />
      <NumberInput
        source="prix"
        label="Prix mensuel (FCFA) *"
        validate={[required(), minValue(1)]}
        helperText="Loyer mensuel en FCFA"
      />
      <NumberInput
        source="caution"
        label="Caution (FCFA)"
        validate={minValue(0)}
        helperText="Dépôt de garantie"
      />
      <NumberInput
        source="superficie"
        label="Superficie (m²) *"
        validate={[required(), minValue(1)]}
      />
      <NumberInput
        source="nombrePieces"
        label="Nombre de pièces *"
        validate={[required(), minValue(1)]}
      />
      <BooleanInput source="disponible" label="Disponible à la location" defaultValue={true} />

      {/* ── Images (JSON brut) ───────────────────────────────────────────── */}
      <TextInput
        source="images"
        label="Images (JSON)"
        fullWidth
        multiline
        rows={3}
        format={(v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v ?? [], null, 2))}
        parse={(v: string) => {
          try { return JSON.parse(v); } catch { return []; }
        }}
        helperText='Format : [{"url":"https://...","description":"...","ordreAffichage":0}]'
      />
      <TextInput
        source="images3D"
        label="Images 3D / 360° (JSON)"
        fullWidth
        multiline
        rows={3}
        format={(v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v ?? [], null, 2))}
        parse={(v: string) => {
          try { return JSON.parse(v); } catch { return []; }
        }}
        helperText='Format : [{"url":"https://...","type":"360","ordreAffichage":0}]'
      />

      {/* Champ caché — administrateurId */}
      <NumberInput source="administrateurId" label="ID Administrateur" defaultValue={1} />
    </SimpleForm>
  </Create>
);
