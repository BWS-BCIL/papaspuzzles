export interface Donation {
    id: string;
    name: string;
    pieces: number;
    difficulty: 'easy' | 'medium' | 'hard';
    theme: string;
    condition: 'new' | 'good' | 'fair';
    email: string;
    image_url: string | null;
    status: 'available' | 'pending_admin_review' | 'traded';
    created_at: string;
    uid?: string;
}

export interface TradeRecord {
    id: string;
    user_name: string;
    user_email: string;
    uid?: string;
    given_donation_ids: string[];
    given_donation_names: string[];
    received_donation_id: string;
    received_donation_name: string;
    dropoff_datetime: string | null;
    status: 'pending' | 'completed';
    created_at: string;
    completed_at?: string;
}

export interface PuzzleRequest {
    id: string;
    type: string;
    pieces: string;
    difficulty: string;
    email: string;
    status: 'pending' | 'confirmed';
    created_at: string;
}
