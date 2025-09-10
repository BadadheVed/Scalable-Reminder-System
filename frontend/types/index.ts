export interface StudyBlock {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startTime: Date;
  duration: number; // minutes
  createdAt: Date;
  updatedAt: Date;
  emailReminderSent?: boolean;
  status: 'upcoming' | 'active' | 'completed' | 'missed';
}

export interface User {
  id: string;
  email: string;
  name?: string;
  timezone: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CreateStudyBlockRequest {
  title: string;
  description?: string;
  startTime: string;
  duration: number;
}

export interface UpdateStudyBlockRequest extends Partial<CreateStudyBlockRequest> {}

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthRegisterRequest {
  email: string;
  password: string;
  name: string;
}