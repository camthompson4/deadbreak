import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Slider,
  CircularProgress,
  Alert
} from '@mui/material';

interface Student {
  name: string;
  email: string;
  progress: number;
  completionDate: Date | null;
}

interface Props {
  student: Student | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (email: string, progress: number) => Promise<void>;
}

export default function StudentDetailsDialog({ student, open, onClose, onUpdate }: Props) {
  const [progress, setProgress] = useState(student?.progress || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdate = async () => {
    if (!student) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await onUpdate(student.email, progress);
      setSuccess('Progress updated successfully');
      setTimeout(onClose, 1500);
    } catch (error) {
      setError('Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  if (!student) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Student Details</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">Name</Typography>
          <Typography variant="body1">{student.name}</Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">Email</Typography>
          <Typography variant="body1">{student.email}</Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Progress
          </Typography>
          <Slider
            value={progress}
            onChange={(_, value) => setProgress(value as number)}
            valueLabelDisplay="auto"
            step={5}
            marks
            min={0}
            max={100}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">Completion Date</Typography>
          <Typography variant="body1">
            {student.completionDate 
              ? new Date(student.completionDate).toLocaleDateString()
              : 'Not completed'
            }
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleUpdate} 
          variant="contained" 
          disabled={loading || progress === student.progress}
        >
          {loading ? <CircularProgress size={24} /> : 'Update Progress'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 