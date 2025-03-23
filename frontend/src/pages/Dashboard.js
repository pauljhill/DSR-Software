import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Box,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BuildIcon from '@mui/icons-material/Build';
import axios from 'axios';

const Dashboard = () => {
  const [shows, setShows] = useState([]);
  const [upcomingShows, setUpcomingShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalShows: 0,
    upcomingShows: 0,
    needUpdateShows: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/shows');
        
        setShows(response.data);
        
        // Calculate upcoming shows (shows with dates in the future)
        const now = new Date();
        const upcoming = response.data.filter(show => {
          const showDate = new Date(show.show_date);
          return showDate >= now;
        }).sort((a, b) => new Date(a.show_date) - new Date(b.show_date));
        
        setUpcomingShows(upcoming.slice(0, 5)); // Get the next 5 upcoming shows
        
        // Calculate stats
        setStats({
          totalShows: response.data.length,
          upcomingShows: upcoming.length,
          needUpdateShows: response.data.filter(show => show.needs_update === 'true').length
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom component="h1">
        Dashboard
      </Typography>

      {/* Stats overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'primary.light',
              color: 'white',
            }}
          >
            <EventIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography component="p" variant="h4">
              {stats.totalShows}
            </Typography>
            <Typography variant="h6">Total Shows</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'success.light',
              color: 'white',
            }}
          >
            <LocationOnIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography component="p" variant="h4">
              {stats.upcomingShows}
            </Typography>
            <Typography variant="h6">Upcoming Shows</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: stats.needUpdateShows > 0 ? 'warning.light' : 'success.light',
              color: 'white',
            }}
          >
            <BuildIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography component="p" variant="h4">
              {stats.needUpdateShows}
            </Typography>
            <Typography variant="h6">Need Updates</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Upcoming shows */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Upcoming Shows
      </Typography>
      
      {upcomingShows.length > 0 ? (
        <Grid container spacing={3}>
          {upcomingShows.map(show => (
            <Grid item xs={12} sm={6} md={4} key={show.show_id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {show.show_name}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {formatDate(show.show_date)}
                  </Typography>
                  <Typography variant="body2">
                    ID: {show.show_id}
                  </Typography>
                  {show.needs_update === 'true' && (
                    <Alert severity="warning" sx={{ mt: 1 }}>
                      Updates needed
                    </Alert>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to={`/shows/${show.show_id}`}>View Details</Button>
                  <Button size="small" component={Link} to={`/shows/${show.show_id}/edit`}>Edit</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info">No upcoming shows.</Alert>
      )}

      {/* Quick actions */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Quick Actions
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Button 
          variant="contained" 
          component={Link} 
          to="/shows/create"
          sx={{ mr: 2, mb: 2 }}
        >
          Create New Show
        </Button>
        <Button 
          variant="outlined" 
          component={Link} 
          to="/shows"
          sx={{ mr: 2, mb: 2 }}
        >
          View All Shows
        </Button>
        <Button 
          variant="outlined" 
          component={Link} 
          to="/venues"
          sx={{ mb: 2 }}
        >
          Manage Venues
        </Button>
      </Box>
    </>
  );
};

export default Dashboard;
