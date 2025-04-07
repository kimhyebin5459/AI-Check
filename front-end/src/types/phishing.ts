export interface PhishingStats {
  totalCountAverage: number;
  urlCount: number;
  voiceCount: number;
  familyCount: number;
}

export interface PhishingAlert {
  id: number;
  displayName: string;
  type: string;
  url: string | null;
  phoneNumber: string | null;
  score: number;
  createdAt: string;
}
