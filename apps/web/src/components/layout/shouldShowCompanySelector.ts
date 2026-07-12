interface ShouldShowCompanySelectorParams {
  readonly companyCount: number;
  readonly canCreateMultipleCompanies: boolean;
}

/**
 * Show the company combo when switching is useful (2+ companies)
 * or when the current plan allows multi-company profiles.
 */
export function shouldShowCompanySelector({
  companyCount,
  canCreateMultipleCompanies,
}: ShouldShowCompanySelectorParams): boolean {
  if (companyCount > 1) {
    return true;
  }

  return canCreateMultipleCompanies;
}
