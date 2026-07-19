export type Paginated<T> = {
  current_page: number;
  data: T[];
  last_page: number;
  total: number;
  per_page: number;
};

export type Branch = {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  status: "active" | "inactive";
  created_at: string;
};

export type UserProfile = {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  gender: "male" | "female" | "other" | null;
  blood_group: string | null;
  religion: string | null;
  nid_number: string | null;
  birth_certificate_number: string | null;
  emergency_contact_number: string | null;
  date_of_birth: string | null;
  joining_date: string | null;
};

export type Member = {
  id: number;
  user_id: number;
  branch_id: number | null;
  phone: string | null;
  address: string | null;
  user: UserProfile;
  branch: Branch | null;
};

export type Staff = {
  id: number;
  user_id: number;
  branch_id: number | null;
  designation: string | null;
  status: "active" | "inactive" | "on_leave";
  user: UserProfile;
  branch: Branch | null;
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

export type Trainer = {
  id: number;
  user_id: number;
  branch_id: number | null;
  employee_id: string | null;
  specialization: string | null;
  certifications: string[] | null;
  experience_years: number;
  hourly_rate: string | null;
  session_rate: string | null;
  bio: string | null;
  rating_avg: string | null;
  total_sessions: number;
  status: "active" | "on_leave" | "inactive";
  join_date: string | null;
  user: UserProfile;
  branch: Branch | null;
};

export type TrainerSchedule = {
  id: number;
  trainer_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  max_sessions: number;
  notes: string | null;
};

export type TrainerSpecialization = {
  id: number;
  trainer_id: number;
  specialization_name: string;
  certification_level: "beginner" | "intermediate" | "advanced" | "expert" | null;
  certification_date: string | null;
  expiry_date: string | null;
  issuing_authority: string | null;
};

export type MemberRegistration = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  branch_id: number | null;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  created_at: string;
  branch: Branch | null;
};

export type TrainingSession = {
  id: number;
  trainer_id: number;
  member_id: number;
  branch_id: number | null;
  session_date: string;
  start_time: string;
  end_time: string;
  session_type: "personal" | "group" | "online";
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  fee: string | null;
  payment_status: "paid" | "pending" | "refunded";
  notes: string | null;
  member_rating: number | null;
  trainer_notes: string | null;
  trainer: Trainer;
  member: Member;
};

export type PaymentNumber = {
  id: number;
  method: "bkash" | "nagad";
  number: string;
  label: string | null;
  is_active: boolean;
};

export type Payment = {
  id: number;
  member_registration_id: number;
  membership_plan_id: number;
  method: "bkash" | "nagad";
  sender_number: string;
  transaction_id: string;
  amount: string;
  screenshot_path: string | null;
  screenshot_url: string | null;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  approved_at: string | null;
  created_at: string;
  member_registration: MemberRegistration;
  membership_plan: MembershipPlan;
};

export type Subscription = {
  id: number;
  member_id: number;
  membership_plan_id: number;
  price_paid: string;
  start_date: string;
  end_date: string;
  status: "pending" | "active" | "expired" | "cancelled";
  notes: string | null;
  member: Member;
  membership_plan: MembershipPlan;
};
