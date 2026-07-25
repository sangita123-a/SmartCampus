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
  Role.STUDENT,
  Role.PARENT,
  Role.FACULTY,
  Role.COLLEGE_ADMIN,
  Role.LIBRARIAN,
  Role.ACCOUNTANT,
];

export const ROLE_LABELS: Record<Role, string> = {
  [Role.SUPER_ADMIN]: 'Super Admin',
  [Role.COLLEGE_ADMIN]: 'College Admin',
  [Role.FACULTY]: 'Faculty',
  [Role.STUDENT]: 'Student',
  [Role.PARENT]: 'Parent',
  [Role.LIBRARIAN]: 'Librarian',
  [Role.ACCOUNTANT]: 'Accountant',
};

export const DASHBOARD_PATHS: Record<Role, string> = {
  [Role.SUPER_ADMIN]: '/dashboard/super-admin',
  [Role.COLLEGE_ADMIN]: '/dashboard/college-admin',
  [Role.FACULTY]: '/dashboard/faculty',
  [Role.STUDENT]: '/dashboard/student',
  [Role.PARENT]: '/dashboard/parent',
  [Role.LIBRARIAN]: '/dashboard/librarian',
  [Role.ACCOUNTANT]: '/dashboard/accountant',
};

export function getDashboardPath(role: Role | string): string {
  if (role in DASHBOARD_PATHS) {
    return DASHBOARD_PATHS[role as Role];
  }
  return '/dashboard';
}

export function isRole(value: string): value is Role {
  return ALL_ROLES.includes(value as Role);
}
