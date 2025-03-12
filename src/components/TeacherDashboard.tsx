import React from 'react';
import { Box } from '@mui/material';
import { StudentProgressTable } from './StudentProgressTable';
import { CourseManagement } from './CourseManagement';
import { StudentLogin } from './StudentLogin';

interface TeacherDashboardProps {
  teacherId: string;
}

export function TeacherDashboard({ teacherId }: TeacherDashboardProps) {
  return (
    <Box>
      <StudentProgressTable />
      <CourseManagement />
      <StudentLogin />
    </Box>
  );
} 