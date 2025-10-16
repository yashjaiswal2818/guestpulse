export interface Event {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    date: string;
    location: string | null;
    capacity: number;
    organizer_email: string | null;
    created_at: string;
  }
  
  export interface Registration {
    id: string;
    event_id: string;
    name: string;
    email: string;
    attendance: 'yes' | 'no' | 'maybe';
    meal_preference: string | null;
    dietary_restrictions: string | null;
    team_name: string | null;
    qr_code: string;
    checked_in: boolean;
    checked_in_at: string | null;
    created_at: string;
  }
  
  export interface CommitmentScore {
    email: string;
    total_registered: number;
    total_checked_in: number;
    score: number;
    tier: 'green' | 'yellow' | 'red';
  }