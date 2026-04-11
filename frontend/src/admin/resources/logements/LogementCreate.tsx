import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  required,
  minValue,
  maxLength,
} from 'react-admin';
import { ImageUploaderInput } from '../../components/ImageUploaderInput';

// Valeurs pour la liste déroulante des types (ID statiques correspondant au seed)
const TYPE_CHOICES = [
  { id: 1, name: 'Appartement' },
  { id: 2, name: 'Maison' },
  { id: 3, name: 'Studio' },
  { id: 4, name: 'Villa' },
  { id: 5, name: 'Chambre' },
];

const TYPE_3D_CHOICES = [
  { id: '360', name: 'Vue 360°' },
  { id: 'panorama', name: 'Panorama' },
  { id: 'matterport', name: 'Matterport' },
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
        images3DType: '360',
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

      {/* ── Photos du logement ───────────────────────────────────────────── */}
      <ImageUploaderInput source="images" label="Uploader des photos" />
      <ArrayInput source="images" label="Photos du logement">
        <SimpleFormIterator disableReordering>
          <TextInput source="url" label="URL" fullWidth validate={required()} />
          <TextInput source="description" label="Description" fullWidth />
          <NumberInput source="ordreAffichage" label="Ordre d'affichage" validate={minValue(0)} defaultValue={0} />
        </SimpleFormIterator>
      </ArrayInput>

      {/* ── Images 3D / 360° ─────────────────────────────────────────────── */}
      <SelectInput
        source="images3DType"
        label="Type de visite 3D par défaut"
        choices={TYPE_3D_CHOICES}
        defaultValue="360"
        helperText="Appliqué aux images 3D uploadées ci-dessous"
      />
      <ImageUploaderInput source="images3D" label="Uploader des images 3D / 360°" type3DSource="images3DType" />
      <ArrayInput source="images3D" label="Images 3D / 360°">
        <SimpleFormIterator disableReordering>
          <TextInput source="url" label="URL" fullWidth validate={required()} />
          <SelectInput
            source="type"
            label="Type"
            choices={TYPE_3D_CHOICES}
            defaultValue="360"
          />
          <TextInput source="description" label="Description" fullWidth />
          <NumberInput source="ordreAffichage" label="Ordre d'affichage" validate={minValue(0)} defaultValue={0} />
        </SimpleFormIterator>
      </ArrayInput>

      {/* Champ caché — administrateurId */}
      <NumberInput source="administrateurId" label="ID Administrateur" defaultValue={1} />
    </SimpleForm>
  </Create>
);
