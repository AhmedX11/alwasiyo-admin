export type Role = "admin" | "staff";
export type StudentStatus = "active" | "alumni" | "left";
export type TeacherStatus = "active" | "inactive";
export type AttendanceStatus = "present" | "absent" | "late" | "excused";
export type Gender = "female" | "male";

export type User = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  created_at: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type Student = {
  id: string;
  code: string;
  full_name: string;
  gender: Gender;
  date_of_birth: string;
  guardian_name: string;
  guardian_phone: string;
  class_id: string | null;
  status: StudentStatus;
  enrollment_date: string;
  address: string;
  notes: string;
};

export type Teacher = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  status: TeacherStatus;
  joined_at: string;
};

export type SchoolClass = {
  id: string;
  name: string;
  grade: string;
  teacher_id: string | null;
  room: string;
  schedule: string;
};

export type AttendanceRecord = {
  student_id: string;
  status: AttendanceStatus;
};

export type AttendanceSheet = {
  id: string;
  class_id: string;
  date: string;
  records: AttendanceRecord[];
  updated_at: string;
};

export type PasswordReset = {
  token: string;
  user_id: string;
  expires_at: string;
};

export type Database = {
  users: User[];
  students: Student[];
  teachers: Teacher[];
  classes: SchoolClass[];
  attendance: AttendanceSheet[];
  password_resets: PasswordReset[];
};
