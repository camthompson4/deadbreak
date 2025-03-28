import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Lock as LockIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  icon: string;
}

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchStudentData();
  }, [user, router]);

  const fetchStudentData = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };

      // Fetch student progress
      const progressResponse = await fetch('/api/student/progress', { headers });
      const progressData = await progressResponse.json();
      setProgress(progressData.progress);

      // Fetch lessons
      const lessonsResponse = await fetch('/api/student/lessons', { headers });
      const lessonsData = await lessonsResponse.json();
      setLessons(lessonsData);

      // Find next lesson
      const nextIncomplete = lessonsData.find(
        (lesson: Lesson) => !lesson.isCompleted && !lesson.isLocked
      );
      setNextLesson(nextIncomplete || null);

      // Fetch achievements
      const achievementsResponse = await fetch('/api/student/achievements', { headers });
      const achievementsData = await achievementsResponse.json();
      setAchievements(achievementsData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Failed to load student data');
      setLoading(false);
    }
  };

  const handleLessonComplete = async (lessonId: string) => {
    try {
      const response = await fetch('/api/student/update-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          lessonId,
          completed: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      // Refresh data
      fetchStudentData();
    } catch (error) {
      console.error('Error updating progress:', error);
      setError('Failed to update progress');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Progress Overview */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Your Progress
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="h6" color="primary">
                {progress}%
              </Typography>
            </Box>
            {nextLesson && (
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={() => router.push(`/lesson/${nextLesson.id}`)}
              >
                Continue Learning
              </Button>
            )}
          </Paper>
        </Grid>

        {/* Lessons List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Your Lessons
            </Typography>
            <List>
              {lessons.map((lesson) => (
                <ListItem
                  key={lesson.id}
                  sx={{
                    mb: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider'
                  }}
                >
                  <ListItemIcon>
                    {lesson.isCompleted ? (
                      <CheckCircleIcon color="success" />
                    ) : lesson.isLocked ? (
                      <LockIcon color="disabled" />
                    ) : (
                      <PlayArrowIcon color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={lesson.title}
                    secondary={
                      <>
                        {lesson.description}
                        <Box component="span" sx={{ display: 'block', mt: 1 }}>
                          <TimerIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                          {lesson.duration}
                        </Box>
                      </>
                    }
                  />
                  <Button
                    variant={lesson.isCompleted ? "outlined" : "contained"}
                    disabled={lesson.isLocked}
                    onClick={() => {
                      if (lesson.isCompleted) {
                        router.push(`/lesson/${lesson.id}`);
                      } else {
                        handleLessonComplete(lesson.id);
                      }
                    }}
                  >
                    {lesson.isCompleted ? 'Review' : 'Start'}
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Achievements
            </Typography>
            <Grid container spacing={2}>
              {achievements.map((achievement) => (
                <Grid item xs={12} key={achievement.id}>
                  <Card
                    sx={{
                      opacity: achievement.isUnlocked ? 1 : 0.6,
                      transition: 'opacity 0.3s'
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <TrophyIcon
                          color={achievement.isUnlocked ? "primary" : "disabled"}
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="h6">
                          {achievement.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 