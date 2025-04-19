export type User = {
  id: string;
  email: string;
  name: string;
  rtime: string;
  [key: string]: string;
};

export type AdminUser = {
  uid: string;
  email: string;
  disabled: boolean;
  admin: boolean;
  isVerified: boolean;
  dateCreated: string;
};

export type AccountHistory = {
  id: string;
  date: string;
  type: string;
  actionBy: string;
  actionReceivedBy: string;
};

export type UserInfo = {
  name: string;
  email: string;
  rtime: string;
  id: string;
};

export type QuizInfo = {
  correct_answers: number;
  wrong_answers: number;
  total_questions: number;
  duration: string;
  score: number;
  start_time: string;
  end_time: string;
};

export type GameInfo = {
  duration: string;
  start_time: string;
  end_time: string;
  status: string;
};

export type UserData = {
  User_Information: UserInfo;
  Quiz_Info?: QuizInfo;
  Game_Info?: {
    [category: string]: {
      [game: string]: GameInfo;
    };
  };
};

export type userReturnData = {
  id: string;
  name: string;
  email: string;
  rtime: string;
  correctAnswers?: number;
  wrongAnswers?: number;
  totalQuestions?: number;
  duration?: string;
  score?: number;
  startTime?: string;
  endTime?: string;
  gameCarInfo?: number;
  gameMotorcycleInfo?: number;
};

export type DashboardData = {
  totalUsers: number;
  activePlayers: number;
  totalQuizAttempts: number;
  successRate: number;
  averageQuizScore: number;
  mostCompletedStage: string;
  leastCompletedStage: string;
  averageTimeSpent: number;
};
