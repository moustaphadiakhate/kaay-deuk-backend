import {
  List,
  Datagrid,
  NumberField,
  TextField,
  DateField,
  FunctionField,
  ExportButton,
  TopToolbar,
  Pagination,
  useRecordContext,
  CreateButton,
  useNotify,
  Button,
} from 'react-admin';
import { useState } from 'react';

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  ACHAT:             { bg: '#d1fae5', color: '#065f46' },
  ACHAT_EN_ATTENTE:  { bg: '#fef9c3', color: '#854d0e' },
  UTILISATION:       { bg: '#fee2e2', color: '#991b1b' },
  ATTRIBUTION:       { bg: '#e0e7ff', color: '#3730a3' },
};

const TypeBadge = () => {
  const record = useRecordContext();
  if (!record) return null;
  const style = TYPE_COLORS[record.type] ?? { bg: '#f3f4f6', color: '#374151' };
  const labels: Record<string, string> = {
    ACHAT: 'Achat validé',
    ACHAT_EN_ATTENTE: 'Achat en attente',
    UTILISATION: 'Utilisation',
    ATTRIBUTION: 'Attribution admin',
  };
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 600, background: style.bg, color: style.color,
    }}>
      {labels[record.type] ?? record.type}
    </span>
  );
};

// ─ Bouton de validation d'achat ─
const ValiderAchatButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const [loading, setLoading] = useState(false);

  if (record?.type !== 'ACHAT_EN_ATTENTE') {
    return null;
  }

  const handleValidate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('kaaydeuk_auth_token');
      const res = await fetch(`/api/briques/valider/${record.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        notify(err?.message || 'Erreur lors de la validation', { type: 'error' });
        return;
      }
      notify('✅ Achat validé avec succès', { type: 'success' });
      // Recharger la page
      window.location.reload();
    } catch (error: any) {
      notify(error.message || 'Erreur réseau', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      label="Valider"
      onClick={handleValidate}
      disabled={loading}
      sx={{ fontSize: 12, padding: '4px 8px' }}
    />
  );
};

const ListActions = () => (
  <TopToolbar>
    <CreateButton label="Attribuer des Briques" />
    <ExportButton />
  </TopToolbar>
);

export const BriquesList = () => (
  <List
    title="Transactions Briques"
    actions={<ListActions />}
    sort={{ field: 'dateCreation', order: 'DESC' }}
    pagination={<Pagination rowsPerPageOptions={[10, 25, 50]} />}
  >
    <Datagrid bulkActionButtons={false}>
      <NumberField source="id" label="ID" />
      <FunctionField label="Utilisateur" render={(r: any) =>
        r.chercheur?.utilisateur?.nom ?? `Chercheur #${r.chercheurId}`
      } />
      <FunctionField label="Email" render={(r: any) =>
        r.chercheur?.utilisateur?.email ?? '—'
      } />
      <FunctionField label="Type" render={() => <TypeBadge />} />
      <NumberField source="montant" label="Briques" />
      <TextField source="description" label="Description" />
      <TextField source="reference" label="Référence" />
      <DateField source="dateCreation" label="Date" showTime />
      <FunctionField label="Actions" render={() => <ValiderAchatButton />} />
    </Datagrid>
  </List>
);
