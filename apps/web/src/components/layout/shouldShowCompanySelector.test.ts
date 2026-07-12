import { shouldShowCompanySelector } from './shouldShowCompanySelector';

describe('shouldShowCompanySelector', () => {
  it('shows the selector when the user already has more than one company', () => {
    expect(
      shouldShowCompanySelector({
        companyCount: 3,
        canCreateMultipleCompanies: false,
      }),
    ).toBe(true);
  });

  it('shows the selector when the plan allows multiple companies', () => {
    expect(
      shouldShowCompanySelector({
        companyCount: 1,
        canCreateMultipleCompanies: true,
      }),
    ).toBe(true);
  });

  it('hides the selector for a single-company plan with at most one company', () => {
    expect(
      shouldShowCompanySelector({
        companyCount: 1,
        canCreateMultipleCompanies: false,
      }),
    ).toBe(false);
    expect(
      shouldShowCompanySelector({
        companyCount: 0,
        canCreateMultipleCompanies: false,
      }),
    ).toBe(false);
  });
});
