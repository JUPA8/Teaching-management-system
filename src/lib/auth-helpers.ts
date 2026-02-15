import { auth } from './auth';
import { UserRole } from '@prisma/client';

/**
 * Get the current authenticated session
 */
export async function getSession() {
  return await auth();
}

/**
 * Get current user from session
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session?.user;
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: UserRole) {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Check if user is admin
 */
export async function isAdmin() {
  return await hasRole(UserRole.ADMIN);
}

/**
 * Check if user is teacher
 */
export async function isTeacher() {
  return await hasRole(UserRole.TEACHER);
}

/**
 * Check if user is student
 */
export async function isStudent() {
  return await hasRole(UserRole.STUDENT);
}

/**
 * Require authentication, throw error if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized: Authentication required');
  }
  return user;
}

/**
 * Require specific role, throw error if user doesn't have role
 */
export async function requireRole(role: UserRole) {
  const user = await requireAuth();
  if (user.role !== role) {
    throw new Error(`Unauthorized: ${role} role required`);
  }
  return user;
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  return await requireRole(UserRole.ADMIN);
}

/**
 * Require teacher role
 */
export async function requireTeacher() {
  return await requireRole(UserRole.TEACHER);
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(roles: UserRole[]) {
  const user = await getCurrentUser();
  return user ? roles.includes(user.role) : false;
}

/**
 * Require user to have any of the specified roles
 */
export async function requireAnyRole(roles: UserRole[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new Error(`Unauthorized: One of [${roles.join(', ')}] roles required`);
  }
  return user;
}
