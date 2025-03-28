import { Box, Paper, Grid, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface Student {
  name: string;
  email: string;
  progress: number;
  completionDate: Date | null;
}

interface Props {
  students: Student[];
}

export default function StudentStatistics({ students }: Props) {
  const totalStudents = students.length;
  const completedStudents = students.filter(s => s.progress === 100).length;
  const averageProgress = students.length 
    ? Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)
    : 0;
  const inProgressStudents = students.filter(s => s.progress > 0 && s.progress < 100).length;

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center">
            <PeopleIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
              Total Students
            </Typography>
          </Box>
          <Typography variant="h4" component="div" sx={{ mt: 2 }}>
            {totalStudents}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center">
            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
              Completed
            </Typography>
          </Box>
          <Typography variant="h4" component="div" sx={{ mt: 2 }}>
            {completedStudents}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center">
            <TrendingUpIcon color="info" sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
              Average Progress
            </Typography>
          </Box>
          <Typography variant="h4" component="div" sx={{ mt: 2 }}>
            {averageProgress}%
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center">
            <AccessTimeIcon color="warning" sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
              In Progress
            </Typography>
          </Box>
          <Typography variant="h4" component="div" sx={{ mt: 2 }}>
            {inProgressStudents}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
} 