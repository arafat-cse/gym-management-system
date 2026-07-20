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
  phone: string | null;
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

export type Attendance = {
  id: number;
  member_id: number;
  branch_id: number | null;
  date: string;
  check_in: string;
  check_out: string | null;
  member: Member;
  branch: Branch | null;
};

export type LeadInquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  membership_plan_id: number | null;
  message: string | null;
  status: "new" | "contacted" | "converted" | "closed";
  notes: string | null;
  created_at: string;
  membership_plan: MembershipPlan | null;
};

export type Coupon = {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  discount: string;
  min_order: string | null;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  status: "active" | "inactive";
};

export type Discount = {
  id: number;
  coupon_id: number;
  member_registration_id: number;
  payment_id: number | null;
  amount: string;
  used_at: string;
  coupon: Coupon;
  member_registration: MemberRegistration;
};

export type DietMeal = {
  id: number;
  diet_plan_id: number;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  name: string;
  calories: number | null;
  protein: string | null;
  carbs: string | null;
  fats: string | null;
};

export type DietPlan = {
  id: number;
  name: string;
  description: string | null;
  duration_in_days: number;
  type: "weight_loss" | "muscle_gain" | "maintenance" | "general";
  calories: number | null;
  status: "active" | "inactive";
  meals?: DietMeal[];
  meals_count?: number;
};

export type MemberDiet = {
  id: number;
  member_id: number;
  diet_plan_id: number;
  start_date: string;
  end_date: string | null;
  status: "active" | "completed" | "cancelled";
  member: Member;
  diet_plan: DietPlan;
};

export type DietProgress = {
  id: number;
  member_diet_id: number;
  weight: string;
  date: string;
  notes: string | null;
  member_diet: MemberDiet;
};

export type Exercise = {
  id: number;
  name: string;
  category: "cardio" | "strength" | "flexibility" | "balance";
  muscle_group: string | null;
  equipment_needed: string | null;
  description: string | null;
  video_url: string | null;
};

export type WorkoutExercise = {
  id: number;
  member_workout_id: number;
  exercise_id: number;
  sets: number | null;
  reps: number | null;
  weight: string | null;
  exercise: Exercise;
};

export type MemberWorkout = {
  id: number;
  member_id: number;
  trainer_id: number | null;
  date: string;
  duration_minutes: number | null;
  type: "personal" | "group" | "cardio" | "strength" | "mixed";
  intensity: "low" | "medium" | "high";
  calories_burned: number | null;
  status: "scheduled" | "completed" | "cancelled";
  notes: string | null;
  member: Member;
  trainer: Trainer | null;
  exercises: WorkoutExercise[];
};

export type HealthInfo = {
  id: number;
  member_id: number;
  height: string | null;
  weight: string | null;
  bmi: string | null;
  blood_type: string | null;
  allergies: string | null;
  conditions: string | null;
  medications: string | null;
  emergency_contact: string | null;
  member: Member;
};

export type Review = {
  id: number;
  member_id: number;
  trainer_id: number;
  rating: number;
  comment: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  member: Member;
  trainer: Trainer;
};

export type Equipment = {
  id: number;
  name: string;
  type: string | null;
  branch_id: number | null;
  status: "operational" | "maintenance" | "out_of_service";
  purchase_date: string | null;
  cost: string | null;
  branch: Branch | null;
  maintenance_records?: EquipmentMaintenance[];
};

export type EquipmentMaintenance = {
  id: number;
  equipment_id: number;
  date: string;
  cost: string | null;
  technician: string | null;
  notes: string | null;
};

export type Locker = {
  id: number;
  branch_id: number | null;
  number: string;
  size: "small" | "medium" | "large";
  status: "available" | "occupied" | "maintenance";
  branch: Branch | null;
  member_locker?: MemberLocker | null;
};

export type MemberLocker = {
  id: number;
  member_id: number;
  locker_id: number;
  assigned_at: string;
  status: "active" | "released";
  member: Member;
  locker: Locker;
};

export type LeaveRequest = {
  id: number;
  staff_id: number;
  leave_type: "sick" | "casual" | "annual" | "other";
  start_date: string;
  end_date: string;
  reason: string | null;
  status: "pending" | "approved" | "rejected";
  approved_by: number | null;
  staff: Staff;
};

export type Expense = {
  id: number;
  branch_id: number | null;
  category: "rent" | "utilities" | "salary" | "equipment" | "maintenance" | "marketing" | "other";
  amount: string;
  date: string;
  description: string | null;
  approved_by: number | null;
  branch: Branch | null;
};
