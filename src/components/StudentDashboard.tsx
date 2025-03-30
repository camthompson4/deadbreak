import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Avatar,
  Paper,
  Chip,
  Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useAuth } from '../contexts/AuthContext';
import { styled } from '@mui/material/styles';
import {
  MOCK_STUDENTS,
  getStudentProgress,
  getStudentAchievements,
  getStudentCourses,
  getCourseLessons,
  getStudentStreak,
  getNextLesson,
  getRecentAchievements,
  getCourseProgress,
  type Course,
  type Lesson,
  type Achievement
} from '../utils/mockData';
import {
  LoadingOverlay,
  LoadingSpinner,
  SkeletonLoader,
} from './shared/LoadingComponents';

interface LessonStatus {
  id: number;
  title: string;
  completed: boolean;
}

const ProgressCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#1a1a1a',
  border: '1px solid #333333',
  '& .MuiLinearProgress-root': {
    backgroundColor: 'rgba(255, 26, 26, 0.2)',
    '& .MuiLinearProgress-bar': {
      backgroundColor: theme.palette.primary.main,
    }
  }
}));

const LessonItem = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: '#1a1a1a',
  border: '1px solid #333333',
  borderRadius: theme.spacing(1),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'translateX(8px)',
  }
}));

interface AchievementCardProps {
  isUnlocked: boolean;
}

const AchievementCard = styled(Card)<AchievementCardProps>(({ theme, isUnlocked }) => ({
  opacity: isUnlocked ? 1 : 0.6,
  backgroundColor: '#1a1a1a',
  border: '1px solid #333333',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    borderColor: isUnlocked ? theme.palette.primary.main : '#333333',
  }
}));

export function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentStudent, setCurrentStudent] = useState(MOCK_STUDENTS[0]); // For demo
  const [courses, setCourses] = useState<Course[]>([]);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const studentCourses = getStudentCourses(currentStudent.id);
        const next = getNextLesson(currentStudent.id);
        const recent = getRecentAchievements(currentStudent.id);
        
        setCourses(studentCourses);
        setNextLesson(next);
        setRecentAchievements(recent);
      } catch (error) {
        console.error('Error loading student data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, [currentStudent.id]);

  if (loading) {
    return (
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper>
              <Box sx={{ p: 3 }}>
                <SkeletonLoader sx={{ width: '70%', height: '30px', mb: 2 }} />
                <SkeletonLoader sx={{ width: '50%', height: '20px' }} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper>
              <Box sx={{ p: 3 }}>
                <SkeletonLoader sx={{ width: '40%', height: '24px', mb: 3 }} />
                {[1, 2, 3].map((i) => (
                  <SkeletonLoader 
                    key={i} 
                    sx={{ height: '60px', mb: 2 }} 
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper>
              <Box sx={{ p: 3 }}>
                <SkeletonLoader sx={{ width: '60%', height: '24px', mb: 3 }} />
                {[1, 2].map((i) => (
                  <SkeletonLoader 
                    key={i} 
                    sx={{ height: '40px', mb: 2 }} 
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Progress Overview */}
        <Grid item xs={12}>
          <ProgressCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    bgcolor: 'primary.main',
                    mr: 2 
                  }}
                >
                  {currentStudent.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
                    Welcome back, {currentStudent.name}!
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip
                      icon={<LocalFireDepartmentIcon />}
                      label={`${currentStudent.streak} Day Streak`}
                      sx={{
                        bgcolor: 'rgba(255, 26, 26, 0.2)',
                        color: '#ff1a1a',
                      }}
                    />
                    <Typography color="textSecondary">
                      Last active: {new Date(currentStudent.lastActive).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Overall Progress
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <LinearProgress 
                    variant="determinate" 
                    value={currentStudent.progress} 
                    sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="h6">
                    {currentStudent.progress}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </ProgressCard>
        </Grid>

        {/* Courses and Lessons */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, backgroundColor: '#1a1a1a' }}>
            <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
              Your Courses
            </Typography>
            <Grid container spacing={2}>
              {courses.map((course) => (
                <Grid item xs={12} key={course.id}>
                  <Card sx={{ 
                    bgcolor: '#262626',
                    '&:hover': { borderColor: '#ff1a1a' }
                  }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {course.description}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2} mt={2}>
                        <LinearProgress 
                          variant="determinate" 
                          value={getCourseProgress(currentStudent.id, course.id)}
                          sx={{ flexGrow: 1 }}
                        />
                        <Typography variant="body2">
                          {getCourseProgress(currentStudent.id, course.id).toFixed(0)}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {nextLesson && (
              <Box mt={4}>
                <Typography variant="h6" gutterBottom sx={{ color: '#ff1a1a' }}>
                  Next Lesson
                </Typography>
                <Card sx={{ bgcolor: '#262626' }}>
                  <CardContent>
                    <Typography variant="h6">{nextLesson.title}</Typography>
                    <Typography color="textSecondary">{nextLesson.description}</Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                      <Typography variant="body2">Duration: {nextLesson.duration}</Typography>
                      <Button variant="contained" color="primary">
                        Continue Learning
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, backgroundColor: '#1a1a1a' }}>
            <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
              Recent Achievements
            </Typography>
            <List>
              {recentAchievements.map((achievement) => (
                <ListItem key={achievement.id}>
                  <ListItemIcon>
                    <Typography variant="h4" component="span">
                      {achievement.icon}
                    </Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary={achievement.title}
                    secondary={achievement.description}
                    primaryTypographyProps={{ color: 'white' }}
                    secondaryTypographyProps={{ color: 'textSecondary' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 