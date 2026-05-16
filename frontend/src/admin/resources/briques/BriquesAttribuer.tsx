import {
  Create,
  SimpleForm,
  NumberInput,
  TextInput,
  SelectInput,
  required,
  minValue,
  useNotify,
  useRedirect,
  useGetList,
} from 'react-admin';
import { useMemo } from 'react';

export const BriquesAttribuer = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  // Charger la liste des utilisateurs pour le sélecteur
  const { data: utilisateurs = [], isLoading } = useGetList('utilisateurs', {
    pagination: { page: 1, perPage: 1000 },
  });

  // Construire les options pour le SelectInput : { id: chercheurId, name: "Nom (Téléphone)" }
  const phoneOptions = useMemo(() => {
    return utilisateurs
      .filter((u: any) => u.chercheur?.id) // Uniquement les utilisateurs avec un chercheur
      .map((u: any) => ({
        id: u.chercheur.id,
        name: `${u.nom} (${u.telephone})`,
      }))
      .sort((a: any, b: any) => a.name.localeCompare(b.name));
  }, [utilisateurs]);

  return (
    <Create
      title="Attribuer des Briques"
      resource="briques/attribuer-admin"
      redirect={false}
    >
      <SimpleForm
        onSubmit={async (data: any) => {
          const token = localStorage.getItem('kaaydeuk_auth_token');
          const res = await fetch('/api/briques/attribuer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              chercheurId: Number(data.chercheurId),
              montant: Number(data.montant),
              description: data.description || undefined,
            }),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            notify(err?.message || 'Erreur lors de l\'attribution', { type: 'error' });
            return;
          }
          const result = await res.json();
          notify(
            `✅ ${data.montant} briques attribuées. Nouveau solde : ${result?.data?.nouveauSolde ?? '?'} briques`,
            { type: 'success' }
          );
          redirect('/briques');
        }}
      >
        <SelectInput
          source="chercheurId"
          label="Sélectionner un utilisateur"
          choices={phoneOptions}
          validate={required()}
          disabled={isLoading}
          helperText="Cherchez par nom ou téléphone"
          fullWidth
        />
        <NumberInput
          source="montant"
          label="Nombre de Briques à attribuer"
          validate={[required(), minValue(1)]}
          helperText="1 Brique = 1 FCFA — Visite 3D = 200 Briques"
          fullWidth
        />
        <TextInput
          source="description"
          label="Motif / Description (optionnel)"
          fullWidth
          helperText="Ex : Bonus fidélité, Correction technique, etc."
        />
      </SimpleForm>
    </Create>
  );
};
