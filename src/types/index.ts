export interface Course {
  id: string;
  slug: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  durationKey: string;
  lessonsCountKey: string;
  studentsCountKey: string;
  ratingKey: string;
  priceKey: string;
  category: 'quran-adults' | 'quran-kids' | 'arabic' | 'islamic';
  teacherId: string;
}

export interface Teacher {
  id: string;
  name: string;
  image: string;
  title: string;
  bio: string;
  experience: number;
  studentsCount: number;
  rating: number;
  languages: string[];
  specializations: string[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  views: number;
  category: 'quran' | 'tajweed' | 'arabic' | 'islamic';
  teacherId: string;
}

export interface Testimonial {
  id: string;
  name: string;
  image: string;
  role: string;
  content: string;
  rating: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  lessonsPerWeek: number;
  features: string[];
  popular: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  timezone?: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  createdAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  teacherId: string;
  studentId: string;
  date: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Progress {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  lastAccessed: Date;
  status: 'not-started' | 'in-progress' | 'completed';
}
