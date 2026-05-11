import { Card, CardContent, CardActionArea, Typography, Box } from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';

const sections = [
  {
    label: 'Logements',
    description: 'Gérer les annonces immobilières',
    icon: <HomeIcon sx={{ fontSize: 40, color: '#C8501A' }} />,
    path: '/logements',
  },
  {
    label: 'Administrateurs',
    description: 'Gérer les comptes administrateurs',
    icon: <PersonIcon sx={{ fontSize: 40, color: '#C8501A' }} />,
    path: '/admins',
  },
  {
    label: 'Réservations',
    description: 'Consulter toutes les réservations',
    icon: <BookOnlineIcon sx={{ fontSize: 40, color: '#C8501A' }} />,
    path: '/reservations',
  },
  {
    label: 'Utilisateurs',
    description: 'Consulter les comptes utilisateurs',
    icon: <PeopleIcon sx={{ fontSize: 40, color: '#C8501A' }} />,
    path: '/utilisateurs',
  },
  {
    label: 'Paiements',
    description: 'Consulter les paiements effectués',
    icon: <PaymentIcon sx={{ fontSize: 40, color: '#C8501A' }} />,
    path: '/paiements',
  },
  {
    label: 'Visites 3D',
    description: 'Consulter les visites 3D effectuées',
    icon: <ThreeDRotationIcon sx={{ fontSize: 40, color: '#C8501A' }} />,
    path: '/visites-3d',
  },
];

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1, color: '#2C1A0E' }}>
        Bienvenue sur KaayDeuk Admin
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
        Sélectionnez une section pour commencer.
      </Typography>

      <Grid container spacing={3}>
        {sections.map((s) => (
          <Grid item key={s.path} xs={12} sm={6} md={4}>
            <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
              <CardActionArea onClick={() => navigate(s.path)} sx={{ p: 2, height: '100%' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, textAlign: 'center' }}>
                  {s.icon}
                  <Typography variant="h6" fontWeight={600} sx={{ color: '#2C1A0E' }}>
                    {s.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {s.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
