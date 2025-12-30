/**
 * Get badge color class for user role
 */
export function getRoleBadgeColor(role: 'god' | 'admin' | 'user' | 'sys_admin' | 'operator' | 'owner' | 'editor' | 'viewer'): string {
  switch (role) {
    case 'god':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'sys_admin':
      return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
    case 'admin':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'operator':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'user':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'owner':
      return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    case 'editor':
        return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
    case 'viewer':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

/**
 * Get badge color class for user status
 */
export function getStatusBadgeColor(status: 'active' | 'inactive'): string {
  return status === 'active'
    ? 'bg-green-500/20 text-green-400 border-green-500/30'
    : 'bg-red-500/20 text-red-400 border-red-500/30';
}

/**
 * Get badge color class for email verified status
 */
export function getEmailVerifiedBadgeColor(emailVerified: boolean | undefined): string {
  return emailVerified === true
    ? 'bg-green-500/20 text-green-400 border-green-500/30'
    : 'bg-red-500/20 text-red-400 border-red-500/30';
}

/**
 * Get badge color class for onboarding completed status
 */
export function getOnboardingCompletedBadgeColor(onboardingCompleted: boolean | undefined): string {
  return onboardingCompleted === true
    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
}
