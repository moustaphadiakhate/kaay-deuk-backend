import {
  Edit,
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
  SaveButton,
  DeleteButton,
  Toolbar,
} from 'react-admin';
import { ImageUploaderInput } from '../../components/ImageUploaderInput';

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

      {/* ── Photos du logement ───────────────────────────────────────────── */}
      <ImageUploaderInput source="images" label="Uploader de nouvelles photos" />
      <ArrayInput source="images" label="Photos du logement">
        <SimpleFormIterator disableReordering>
          <TextInput source="url" label="URL" fullWidth validate={required()} />
          <TextInput source="description" label="Description" fullWidth />
          <NumberInput source="ordreAffichage" label="Ordre d'affichage" validate={minValue(0)} />
        </SimpleFormIterator>
      </ArrayInput>

      {/* ── Images 3D / 360° ─────────────────────────────────────────────── */}
      <SelectInput
        source="images3DType"
        label="Type par défaut pour nouvelles images 3D"
        choices={TYPE_3D_CHOICES}
        defaultValue="360"
      />
      <ImageUploaderInput source="images3D" label="Uploader de nouvelles images 3D / 360°" type3DSource="images3DType" />
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
          <NumberInput source="ordreAffichage" label="Ordre d'affichage" validate={minValue(0)} />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);
