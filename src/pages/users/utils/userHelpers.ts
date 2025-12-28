/**
 * Get badge color class for user role
 */
export function getRoleBadgeColor(role: 'admin' | 'user'): string {
  return role === 'admin'
    ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    : 'bg-blue-500/20 text-blue-400 border-blue-500/30';
}

/**
 * Get badge color class for user status
 */
export function getStatusBadgeColor(status: 'active' | 'inactive'): string {
  return status === 'active'
    ? 'bg-green-500/20 text-green-400 border-green-500/30'
    : 'bg-red-500/20 text-red-400 border-red-500/30';
}

