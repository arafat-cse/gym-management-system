export type Branch = {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  status: "active" | "inactive";
};

export type MembershipPlan = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  duration_in_days: number;
  features: string[] | null;
  status: "active" | "inactive";
};

export type TrainerSpecialization = {
  id: number;
  specialization_name: string;
  certification_level: "beginner" | "intermediate" | "advanced" | "expert" | null;
  issuing_authority: string | null;
};

export type TrainerUser = {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
};

export type PaymentNumber = {
  id: number;
  method: "bkash" | "nagad";
  number: string;
  label: string | null;
};

export type Trainer = {
  id: number;
  specialization: string | null;
  experience_years: number;
  bio: string | null;
  rating_avg: string | null;
  total_sessions: number;
  status: "active" | "on_leave" | "inactive";
  user: TrainerUser;
  branch: Branch | null;
  specializations: TrainerSpecialization[];
};
