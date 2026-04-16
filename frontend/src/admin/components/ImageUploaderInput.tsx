import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNotify } from 'react-admin';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

const TOKEN_KEY = 'kaaydeuk_auth_token';

interface Props {
  /** Source du champ de tableau dans le formulaire, ex: "images" ou "images3D" */
  source: string;
  label?: string;
  /** Source du champ type3D (uniquement pour images3D) */
  type3DSource?: string;
}

/**
 * Bouton d'upload : envoie les fichiers vers POST /api/uploads,
 * puis injecte les objets { url, description, ordreAffichage[, type] }
 * directement dans le champ `source` (ArrayInput) du formulaire.
 */
export const ImageUploaderInput = ({ source, label, type3DSource }: Props) => {
  const { getValues, setValue } = useFormContext();
  const notify = useNotify();
  const [uploading, setUploading] = useState(false);

  const handleFiles = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (!files.length) return;

      setUploading(true);
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        const formData = new FormData();
        files.forEach((f) => formData.append('files', f));

        const res = await fetch('/api/uploads', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.message ?? 'Upload échoué');
        }

        const body = await res.json();
        const uploaded: { url: string }[] = body?.data ?? body;

        const existing: unknown[] = Array.isArray(getValues(source)) ? getValues(source) : [];
        const type3D = type3DSource ? (getValues(type3DSource) ?? '360') : undefined;

        const newItems = uploaded.map((u, i) => ({
          url: u.url,
          titre: '', // À remplir par l'admin
          lieu: '', // À remplir par l'admin
          description: '',
          ordreAffichage: existing.length + i,
          ...(type3D !== undefined ? { type: type3D } : {}),
        }));

        setValue(source, [...existing, ...newItems], { shouldDirty: true });
        notify(`${uploaded.length} image(s) ajoutée(s)`, { type: 'success' });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erreur lors de l'upload";
        notify(msg, { type: 'error' });
      } finally {
        setUploading(false);
        // reset input pour permettre re-sélection du même fichier
        e.target.value = '';
      }
    },
    [source, type3DSource, getValues, setValue, notify],
  );

  return (
    <Box sx={{ mb: 1, mt: 0.5 }}>
      {label && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
      )}
      <Button
        component="label"
        variant="outlined"
        size="small"
        disabled={uploading}
        startIcon={uploading ? <CircularProgress size={14} /> : undefined}
        sx={{ textTransform: 'none' }}
      >
        {uploading ? 'Upload en cours…' : '⬆ Choisir des fichiers'}
        <input type="file" hidden multiple accept="image/*" onChange={handleFiles} />
      </Button>
    </Box>
  );
};
