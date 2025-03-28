// Types
export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  completionRate: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  videoUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  isUnlocked: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  completionDate: Date | null;
  enrolledCourses: string[];
  achievements: string[];
  lastActive: Date;
  streak: number;
}

// Mock Data
export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Fundamentals of Breaking',
    description: 'Learn the essential foundations of breaking, including basic toprock, footwork, and freezes.',
    level: 'Beginner',
    duration: '8 weeks',
    completionRate: 85
  },
  {
    id: 'c2',
    title: 'Power Moves Basics',
    description: 'Introduction to basic power moves including windmills, swipes, and head spins.',
    level: 'Intermediate',
    duration: '12 weeks',
    completionRate: 65
  },
  {
    id: 'c3',
    title: 'Advanced Style Development',
    description: 'Develop your unique style and learn advanced combinations.',
    level: 'Advanced',
    duration: '10 weeks',
    completionRate: 45
  }
];

export const MOCK_LESSONS: Lesson[] = [
  {
    id: 'l1',
    courseId: 'c1',
    title: 'Introduction to Breaking',
    description: 'Learn about breaking history and basic terminology.',
    duration: '45 min',
    completed: true,
    videoUrl: 'https://example.com/video1'
  },
  {
    id: 'l2',
    courseId: 'c1',
    title: 'Basic Toprock Steps',
    description: 'Master the fundamental toprock steps.',
    duration: '60 min',
    completed: true,
    videoUrl: 'https://example.com/video2'
  },
  {
    id: 'l3',
    courseId: 'c1',
    title: 'Footwork Fundamentals',
    description: 'Learn basic 6-step and 3-step variations.',
    duration: '55 min',
    completed: false,
    videoUrl: 'https://example.com/video3'
  },
  {
    id: 'l4',
    courseId: 'c2',
    title: 'Basic Freezes',
    description: 'Learn baby freeze and chair freeze.',
    duration: '50 min',
    completed: false,
    videoUrl: 'https://example.com/video4'
  },
  {
    id: 'l5',
    courseId: 'c2',
    title: 'Power Moves Introduction',
    description: 'Introduction to basic power moves.',
    duration: '65 min',
    completed: false,
    videoUrl: 'https://example.com/video5'
  }
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    unlockedAt: new Date('2024-03-01'),
    isUnlocked: true
  },
  {
    id: 'a2',
    title: 'Consistent Learner',
    description: 'Complete 5 lessons in a row',
    icon: '🔥',
    unlockedAt: new Date('2024-03-10'),
    isUnlocked: true
  },
  {
    id: 'a3',
    title: 'Power Moves Master',
    description: 'Complete the Power Moves course',
    icon: '💪',
    isUnlocked: false
  }
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'John Doe',
    email: 'john@example.com',
    progress: 75,
    completionDate: null,
    enrolledCourses: ['c1', 'c2'],
    achievements: ['a1', 'a2'],
    lastActive: new Date('2024-03-15'),
    streak: 5
  },
  {
    id: 's2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    progress: 100,
    completionDate: new Date('2024-03-15'),
    enrolledCourses: ['c1', 'c2', 'c3'],
    achievements: ['a1', 'a2', 'a3'],
    lastActive: new Date('2024-03-16'),
    streak: 12
  },
  {
    id: 's3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    progress: 30,
    completionDate: null,
    enrolledCourses: ['c1'],
    achievements: ['a1'],
    lastActive: new Date('2024-03-14'),
    streak: 2
  },
  {
    id: 's4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    progress: 90,
    completionDate: null,
    enrolledCourses: ['c1', 'c2'],
    achievements: ['a1', 'a2'],
    lastActive: new Date('2024-03-16'),
    streak: 8
  },
  {
    id: 's5',
    name: 'Alex Brown',
    email: 'alex@example.com',
    progress: 100,
    completionDate: new Date('2024-03-10'),
    enrolledCourses: ['c1', 'c2', 'c3'],
    achievements: ['a1', 'a2', 'a3'],
    lastActive: new Date('2024-03-16'),
    streak: 15
  }
];

// Helper functions
export function getStudentProgress(studentId: string): number {
  const student = MOCK_STUDENTS.find(s => s.id === studentId);
  return student?.progress || 0;
}

export function getStudentAchievements(studentId: string): Achievement[] {
  const student = MOCK_STUDENTS.find(s => s.id === studentId);
  if (!student) return [];
  return MOCK_ACHIEVEMENTS.filter(a => student.achievements.includes(a.id));
}

export function getStudentCourses(studentId: string): Course[] {
  const student = MOCK_STUDENTS.find(s => s.id === studentId);
  if (!student) return [];
  return MOCK_COURSES.filter(c => student.enrolledCourses.includes(c.id));
}

export function getCourseLessons(courseId: string): Lesson[] {
  return MOCK_LESSONS.filter(l => l.courseId === courseId);
}

// Additional helper functions
export function getStudentStreak(studentId: string): number {
  const student = MOCK_STUDENTS.find(s => s.id === studentId);
  return student?.streak || 0;
}

export function getNextLesson(studentId: string): Lesson | null {
  const student = MOCK_STUDENTS.find(s => s.id === studentId);
  if (!student) return null;
  
  const enrolledLessons = student.enrolledCourses.flatMap(courseId => 
    MOCK_LESSONS.filter(lesson => lesson.courseId === courseId)
  );
  
  return enrolledLessons.find(lesson => !lesson.completed) || null;
}

export function getCompletedLessonsCount(studentId: string): number {
  const student = MOCK_STUDENTS.find(s => s.id === studentId);
  if (!student) return 0;
  
  const enrolledLessons = student.enrolledCourses.flatMap(courseId => 
    MOCK_LESSONS.filter(lesson => lesson.courseId === courseId)
  );
  
  return enrolledLessons.filter(lesson => lesson.completed).length;
}

export function getRecentAchievements(studentId: string): Achievement[] {
  const student = MOCK_STUDENTS.find(s => s.id === studentId);
  if (!student) return [];
  
  return MOCK_ACHIEVEMENTS
    .filter(a => student.achievements.includes(a.id) && a.unlockedAt)
    .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
    .slice(0, 3);
}

export function getCourseProgress(studentId: string, courseId: string): number {
  const courseLessons = MOCK_LESSONS.filter(lesson => lesson.courseId === courseId);
  const completedLessons = courseLessons.filter(lesson => lesson.completed);
  
  return courseLessons.length > 0 
    ? (completedLessons.length / courseLessons.length) * 100 
    : 0;
} 