import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  BooleanField,
  DateField,
  EditButton,
  DeleteButton,
  TopToolbar,
  FunctionField,
} from 'react-admin';

const ShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton mutationMode="pessimistic" />
  </TopToolbar>
);

// Affiche les images JSON sous forme de galerie
const ImagesGallery = ({ record, source }: { record?: Record<string, any>; source: string }) => {
  const images = record?.[source] ?? [];
  if (!Array.isArray(images) || images.length === 0) {
    return <span style={{ color: '#9A7A5A', fontSize: 13 }}>Aucune image</span>;
  }
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {images.map((img: { url: string; description?: string }, i: number) => (
        <div key={i} style={{ textAlign: 'center' }}>
          <img
            src={img.url}
            alt={img.description ?? `Image ${i + 1}`}
            style={{
              width: 160,
              height: 110,
              objectFit: 'cover',
              borderRadius: 10,
              border: '1px solid #EDE0CC',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {img.description && (
            <div style={{ fontSize: 11, color: '#5A3A1A', marginTop: 4 }}>{img.description}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export const LogementShow = () => (
  <Show title="Détail du logement" actions={<ShowActions />}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="titre" label="Titre" />
      <TextField source="description" label="Description" emptyText="—" />
      <TextField source="adresse" label="Adresse" />
      <TextField source="ville" label="Ville" />
      <TextField source="typeLogement.libelle" label="Type" />
      <NumberField
        source="prix"
        label="Prix mensuel"
        options={{ style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }}
      />
      <NumberField
        source="caution"
        label="Caution"
        options={{ style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }}
        emptyText="—"
      />
      <NumberField source="superficie" label="Superficie (m²)" />
      <NumberField source="nombrePieces" label="Nombre de pièces" />
      <BooleanField source="disponible" label="Disponible" />
      <DateField source="dateCreation" label="Date de création" showTime />

      {/* Images */}
      <FunctionField
        label="Photos"
        render={(record: Record<string, any>) => <ImagesGallery record={record} source="images" />}
      />
      <FunctionField
        label="Visites 3D / 360°"
        render={(record: Record<string, any>) => (
          <ImagesGallery record={record} source="images3D" />
        )}
      />

      {/* Admin info */}
      <TextField source="administrateur.utilisateur.nom" label="Administrateur" emptyText="—" />
      <TextField source="administrateur.utilisateur.telephone" label="Téléphone admin" emptyText="—" />
    </SimpleShowLayout>
  </Show>
);
