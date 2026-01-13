import { useAuth } from '@/hooks/useAuth';
import { User } from '@/services/userService';

/**
 * Hook to check if current user can delete a specific user
 * Rules:
 * - Only admin or god roles can delete
 * - Cannot delete yourself
 * - Must share at least one company (same group)
 */
export const useCanDeleteUser = () => {
  const { user: currentUser } = useAuth();

  const canDeleteUser = (user: User): boolean => {
    if (!currentUser) return false;

    // Only admin or god can delete
    if (currentUser.role !== 'admin' && currentUser.role !== 'god') {
      return false;
    }

    // Cannot delete yourself
    if (user.id === currentUser.id) {
      return false;
    }

    // Must share at least one company (same group)
    const currentUserCompanyIds = currentUser.companyIds || [];
    const targetUserCompanyIds = user.companyIds || [];
    const sharedCompanies = currentUserCompanyIds.filter((companyId) =>
      targetUserCompanyIds.includes(companyId),
    );

    return sharedCompanies.length > 0;
  };

  return { canDeleteUser };
};
