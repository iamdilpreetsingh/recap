export interface Caption {
  id: string;
  speaker: string;
  text: string;
  timestamp: number;
}

export interface MeetingSession {
  id: string;
  url: string;
  startedAt: number;
  captions: Caption[];
}
