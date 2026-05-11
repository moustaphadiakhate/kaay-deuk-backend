import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  FunctionField,
} from 'react-admin';
import { Box, Card, CardContent, Typography } from '@mui/material';

export const Visite3DShow = () => (
  <Show title="Détails de la visite 3D">
    <SimpleShowLayout>
      <NumberField source="id" label="ID de la visite" />
      
      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C1A0E' }}>
          Chercheur
        </Typography>
      </Box>
      <FunctionField 
        label="Nom" 
        render={(r: any) => r.chercheur?.utilisateur?.nom ?? '—'} 
      />
      <TextField 
        source="chercheur.utilisateur.email" 
        label="Email" 
      />
      
      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C1A0E' }}>
          Logement
        </Typography>
      </Box>
      <FunctionField 
        label="Titre" 
        render={(r: any) => r.logement?.titre ?? '—'} 
      />
      <TextField source="logement.ville" label="Ville" />
      <NumberField 
        source="logement.prix" 
        label="Prix (FCFA/mois)" 
        options={{ maximumFractionDigits: 0 }} 
      />
      
      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C1A0E' }}>
          Informations de la visite
        </Typography>
      </Box>
      <DateField source="dateVisite" label="Date et heure" showTime />
      <NumberField 
        source="dureeVisite" 
        label="Durée (secondes)" 
        options={{ maximumFractionDigits: 0 }} 
      />
      <FunctionField 
        label="Durée formatée" 
        render={(r: any) => {
          const sec = r.dureeVisite || 0;
          const min = Math.floor(sec / 60);
          const s = sec % 60;
          return `${min}m ${s}s`;
        }} 
      />
    </SimpleShowLayout>
  </Show>
);
