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
  progress: ProgressData;
};

export type DashboardInfo = {
  User_Information: UserInfo;
  Quiz_Info?: {
    [category: string]: QuizInfo;
  };
  Game_Info?: {
    [category: string]: {
      [game: string]: GameInfo;
    };
  };
};

export type userReturnData = {
  uid: string;
  email: string;
  dateCreated: string;
  progress: ProgressData;
};

export type ProgressData = {
  [category: string]: {
    CurrentStars: number;
    ProgressName: string;
    TotalStars: number;
  };
};

export type DashboardData = {
  // headline
  totalUsers: number;
  activePlayers: number;
  engagementRate: number; // %
  totalQuizAttempts: number;

  // scoring
  averageQuizScore: number; // raw average out of maxScorePerQuiz
  avgScore: number; // alias for convenience
  successRate: number; // %
  scoreBuckets: ScoreBuckets;
  topPerformers: TopPerformer[];

  // time
  avgSecondsConsumed: number; // seconds
  avgTimeSpent: number; // seconds (alias of avgSecondsConsumed)
  medianSecondsConsumed: number; // seconds
  avgSecondsRemaining: number; // seconds
  avgTimePerQuestion: number; // seconds
  avgSecondsPerCorrectAnswer: number; // seconds
  fastExitRate: number; // %

  // trends (last 7 days)
  attemptsByDay: AttemptsByDay[];
  avgScoreByDay: AvgScoreByDay[];

  // stages
  mostCompletedStage: string;
  mostCompletedStageStars: number;
  leastCompletedStage: string;
  leastCompletedStageStars: number;
};

export type ScoreBuckets = {
  "0-5": number;
  "6-10": number;
  "11-15": number;
  "16-20": number;
};

export type TopPerformer = {
  name: string;
  email: string;
  score: number;
  secondsConsumed: number;
};

export type AttemptsByDay = { date: string; attempts: number };
export type AvgScoreByDay = { date: string; avgScore: number };

export type Quiz = {
  id: string;
  question: string;
  image: string;
  is_deleted: boolean;
  difficulty: string;
  choices: string[];
  correct_answer: number;
  quizLanguage: string;
  quiz_type: string;
};

export type CreateQuiz = {
  question: string;
  image: string;
  is_deleted: boolean;
  difficulty: string;
  choices: { value: string }[];
  correct_answer: number;
  quizLanguage: string;
  quiz_type: string;
};

export type CreateVideo = {
  name: string;
  lesson_type: string;
  video_url: string;
  lessonLanguage: string;
};

export type Video = {
  id: string;
  name: string;
  lesson_type: string;
  video_url: string;
  createdAt: string;
};
