export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COLLEGE_ADMIN = 'COLLEGE_ADMIN',
  FACULTY = 'FACULTY',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  LIBRARIAN = 'LIBRARIAN',
  ACCOUNTANT = 'ACCOUNTANT',
}

export const ALL_ROLES = Object.values(Role);

export const PUBLIC_REGISTER_ROLES: Role[] = [
  Role.COLLEGE_ADMIN,
  Role.FACULTY,
  Role.STUDENT,
  Role.PARENT,
  Role.LIBRARIAN,
  Role.ACCOUNTANT,
];

export const DASHBOARD_PATHS: Record<Role, string> = {
  [Role.SUPER_ADMIN]: '/dashboard/super-admin',
  [Role.COLLEGE_ADMIN]: '/dashboard/college-admin',
  [Role.FACULTY]: '/dashboard/faculty',
  [Role.STUDENT]: '/dashboard/student',
  [Role.PARENT]: '/dashboard/parent',
  [Role.LIBRARIAN]: '/dashboard/librarian',
  [Role.ACCOUNTANT]: '/dashboard/accountant',
};
