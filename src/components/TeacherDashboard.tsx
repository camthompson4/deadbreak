import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  IconButton,
  Chip,
  Avatar,
  Button,
  Container,
  TextField,
  InputAdornment
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import {
  SkeletonLoader,
} from './shared/LoadingComponents';
import { MOCK_STUDENTS } from '../utils/mockData';

interface Student {
  name: string;
  email: string;
  progress: number;
  completionDate?: Date | null;
}

interface DashboardStats {
  totalStudents: number;
  averageProgress: number;
  completedStudents: number;
}

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: '#1a1a1a',
  '& .MuiTableHead-root': {
    '& .MuiTableCell-root': {
      backgroundColor: 'black',
      color: '#ff1a1a',
      borderBottom: '2px solid #ff1a1a',
      fontWeight: 600,
    }
  },
  '& .MuiTableBody-root': {
    '& .MuiTableRow-root': {
      '&:hover': {
        backgroundColor: 'rgba(255, 26, 26, 0.1)',
      },
      '& .MuiTableCell-root': {
        color: 'white',
        borderBottom: '1px solid #333333',
      }
    }
  }
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#1a1a1a',
  border: '1px solid #333333',
  transition: 'all 0.3s ease-in-out',
  color: 'white',
  '&:hover': {
    borderColor: '#ff1a1a',
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 20px rgba(255, 26, 26, 0.2)',
  },
}));

const LoadingCard = () => (
  <Box sx={{ p: 2 }}>
    <SkeletonLoader sx={{ width: '60%', mb: 1 }} />
    <SkeletonLoader sx={{ width: '40%' }} />
  </Box>
);

const LoadingTable = () => (
  <Box sx={{ p: 2 }}>
    <SkeletonLoader sx={{ height: '40px', mb: 2 }} />
    {[1, 2, 3].map((i) => (
      <SkeletonLoader key={i} sx={{ height: '60px', mb: 1 }} />
    ))}
  </Box>
);

export function TeacherDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    averageProgress: 0,
    completedStudents: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStudents(MOCK_STUDENTS);
      
      const total = MOCK_STUDENTS.length;
      const completed = MOCK_STUDENTS.filter(s => s.progress === 100).length;
      const avgProgress = MOCK_STUDENTS.reduce((acc, s) => acc + s.progress, 0) / total;
      
      setStats({
        totalStudents: total,
        averageProgress: avgProgress,
        completedStudents: completed
      });
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
          Teacher Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchStudents}
          sx={{
            bgcolor: '#ff1a1a',
            '&:hover': {
              bgcolor: '#cc0000',
            }
          }}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Paper>
                  <LoadingCard />
                </Paper>
              </Grid>
            ))}
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: '#ff1a1a' }}>
                    <PeopleIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" variant="subtitle2">
                      Total Students
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'white' }}>
                      {stats.totalStudents}
                    </Typography>
                  </Box>
                </Box>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" variant="subtitle2">
                      Average Progress
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'white' }}>
                      {stats.averageProgress.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <CheckCircleIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" variant="subtitle2">
                      Completed
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'white' }}>
                      {stats.completedStudents}
                    </Typography>
                  </Box>
                </Box>
              </StatCard>
            </Grid>
          </>
        )}
      </Grid>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search students..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          my: 3,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1a1a1a',
            color: 'white',
            '& fieldset': {
              borderColor: '#333333',
            },
            '&:hover fieldset': {
              borderColor: '#ff1a1a',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff1a1a',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#666666',
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#666666' }} />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Paper sx={{ mt: 3, bgcolor: '#1a1a1a', border: '1px solid #333333' }}>
          <LoadingTable />
        </Paper>
      ) : (
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.email}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ 
                        mr: 2, 
                        bgcolor: '#ff1a1a',
                        color: 'white' 
                      }}>
                        {student.name.charAt(0)}
                      </Avatar>
                      {student.name}
                    </Box>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '200px' }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={student.progress} 
                        sx={{ 
                          flexGrow: 1,
                          bgcolor: 'rgba(255, 26, 26, 0.2)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#ff1a1a',
                          }
                        }}
                      />
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        {student.progress}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={student.progress === 100 ? "Completed" : "In Progress"}
                      sx={{
                        bgcolor: student.progress === 100 ? '#1a472a' : '#ff1a1a',
                        color: 'white',
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      sx={{ 
                        color: '#ff1a1a',
                        '&:hover': {
                          bgcolor: 'rgba(255, 26, 26, 0.1)',
                        }
                      }}
                      size="small"
                    >
                      <EmailIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      )}
    </Container>
  );
} 