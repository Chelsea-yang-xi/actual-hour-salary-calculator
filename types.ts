
export enum AppState {
  IDLE = 'IDLE',
  WORKING = 'WORKING',
  SLACKING = 'SLACKING',
  FINISHED = 'FINISHED'
}

export interface UserConfig {
  monthlySalary: number;
  standardHours: number;
}

export interface WorkSession {
  totalSeconds: number;
  slackSeconds: number;
  date: string;
}
