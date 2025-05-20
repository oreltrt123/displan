export interface Design {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  content: any;
  created_at: string;
  updated_at: string;
}

export interface CreateDesignFormData {
  name: string;
  description: string;
}
