import { User } from '@/types/user';

/**
 * Centralized authentication and onboarding redirect rules
 * 
 * Rules:
 * 1. After account creation: User must confirm email via link
 * 2. While email not verified: Email pending screen always appears
 * 3. After email confirmation: On first login, show onboarding
 * 4. With onboarding completed: On login, always go to dashboard
 */

export interface UserRedirectInfo {
  shouldRedirect: boolean;
  redirectTo: string;
  reason: string;
}

/**
 * Determines where a user should be redirected based on their authentication status
 * 
 * @param user - The current user object
 * @param currentPath - The current route path
 * @returns Redirect information or null if no redirect is needed
 */
export function getUserRedirectInfo(user: User | null | undefined, currentPath: string): UserRedirectInfo | null {
  // Rule 1: User not authenticated -> Login
  // Don't check email verification if user is not authenticated
  if (!user) {
    if (currentPath !== '/login' && !currentPath.startsWith('/register') && !currentPath.startsWith('/confirm')) {
      return {
        shouldRedirect: true,
        redirectTo: '/login',
        reason: 'User not authenticated',
      };
    }
    return null;
  }

  // Rule 2: Email not verified -> Email pending screen
  // This should always appear until email is verified (for authenticated users only)
  const isEmailVerified = user.emailVerified === true;
  if (!isEmailVerified) {
    // Allow access to email-pending page and public routes
    if (currentPath !== '/email-pending' && !currentPath.startsWith('/confirm')) {
      return {
        shouldRedirect: true,
        redirectTo: '/email-pending',
        reason: 'Email not verified',
      };
    }
    return null;
  }

  // Rule 3: Email verified but onboarding not completed -> Onboarding
  const onboardingNotCompleted = user.onboardingCompleted !== true;
  const needsOnboarding = isEmailVerified && onboardingNotCompleted;

  if (needsOnboarding) {
    if (!currentPath.startsWith('/onboarding')) {
      return {
        shouldRedirect: true,
        redirectTo: '/onboarding',
        reason: 'Onboarding not completed',
      };
    }
    return null;
  }

  // Rule 4: Onboarding completed but trying to access onboarding -> Dashboard
  if (!needsOnboarding && currentPath.startsWith('/onboarding')) {
    return {
      shouldRedirect: true,
      redirectTo: '/dashboard',
      reason: 'Onboarding already completed',
    };
  }

  // Rule 5: Email verified and onboarding completed -> Allow access to dashboard and other routes
  // No redirect needed
  return null;
}

/**
 * Checks if user needs to verify their email
 */
export function needsEmailVerification(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.emailVerified !== true;
}

/**
 * Checks if user needs onboarding
 */
export function needsOnboarding(user: User | null | undefined): boolean {
  if (!user) return false;
  const isEmailVerified = user.emailVerified === true;
  const onboardingNotCompleted = user.onboardingCompleted !== true;
  return isEmailVerified && onboardingNotCompleted;
}

/**
 * Checks if user has completed onboarding
 */
export function hasCompletedOnboarding(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.onboardingCompleted === true;
}

