export enum Permission {
  // Companies
  COMPANIES_CREATE = 'companies:create',
  COMPANIES_READ = 'companies:read',
  COMPANIES_UPDATE = 'companies:update',
  COMPANIES_DELETE = 'companies:delete',

  // Accounts
  ACCOUNTS_CREATE = 'accounts:create',
  ACCOUNTS_READ = 'accounts:read',
  ACCOUNTS_UPDATE = 'accounts:update',
  ACCOUNTS_DELETE = 'accounts:delete',

  // Transactions
  TRANSACTIONS_CREATE = 'transactions:create',
  TRANSACTIONS_READ = 'transactions:read',
  TRANSACTIONS_UPDATE = 'transactions:update',
  TRANSACTIONS_DELETE = 'transactions:delete',

  // Categories
  CATEGORIES_CREATE = 'categories:create',
  CATEGORIES_READ = 'categories:read',
  CATEGORIES_UPDATE = 'categories:update',
  CATEGORIES_DELETE = 'categories:delete',

  // Users
  USERS_INVITE = 'users:invite',
  USERS_READ = 'users:read',
  USERS_UPDATE = 'users:update',
  USERS_REMOVE = 'users:remove',
  USERS_CHANGE_ROLE = 'users:changeRole',

  // Reports
  REPORTS_READ = 'reports:read',
  REPORTS_EXPORT = 'reports:export',

  // Settings
  SETTINGS_READ = 'settings:read',
  SETTINGS_UPDATE = 'settings:update',

  // Budget
  BUDGET_READ = 'budget:read',
  BUDGET_UPDATE = 'budget:update',

  // Recurring Transactions
  RECURRING_TRANSACTIONS_CREATE = 'recurring-transactions:create',
  RECURRING_TRANSACTIONS_READ = 'recurring-transactions:read',
  RECURRING_TRANSACTIONS_UPDATE = 'recurring-transactions:update',
  RECURRING_TRANSACTIONS_DELETE = 'recurring-transactions:delete',

  // Indebtedness
  INDEBTEDNESS_READ = 'indebtedness:read',
}

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  owner: [
    // Companies
    Permission.COMPANIES_CREATE,
    Permission.COMPANIES_READ,
    Permission.COMPANIES_UPDATE,
    Permission.COMPANIES_DELETE,
    // Accounts
    Permission.ACCOUNTS_CREATE,
    Permission.ACCOUNTS_READ,
    Permission.ACCOUNTS_UPDATE,
    Permission.ACCOUNTS_DELETE,
    // Transactions
    Permission.TRANSACTIONS_CREATE,
    Permission.TRANSACTIONS_READ,
    Permission.TRANSACTIONS_UPDATE,
    Permission.TRANSACTIONS_DELETE,
    // Categories
    Permission.CATEGORIES_CREATE,
    Permission.CATEGORIES_READ,
    Permission.CATEGORIES_UPDATE,
    Permission.CATEGORIES_DELETE,
    // Users
    Permission.USERS_INVITE,
    Permission.USERS_READ,
    Permission.USERS_UPDATE,
    Permission.USERS_REMOVE,
    Permission.USERS_CHANGE_ROLE,
    // Reports
    Permission.REPORTS_READ,
    Permission.REPORTS_EXPORT,
    // Settings
    Permission.SETTINGS_READ,
    Permission.SETTINGS_UPDATE,
    // Budget
    Permission.BUDGET_READ,
    Permission.BUDGET_UPDATE,
    // Recurring Transactions
    Permission.RECURRING_TRANSACTIONS_CREATE,
    Permission.RECURRING_TRANSACTIONS_READ,
    Permission.RECURRING_TRANSACTIONS_UPDATE,
    Permission.RECURRING_TRANSACTIONS_DELETE,
    // Indebtedness
    Permission.INDEBTEDNESS_READ,
  ],

  admin: [
    Permission.COMPANIES_READ,
    Permission.COMPANIES_UPDATE,
    Permission.ACCOUNTS_CREATE,
    Permission.ACCOUNTS_READ,
    Permission.ACCOUNTS_UPDATE,
    Permission.ACCOUNTS_DELETE,
    Permission.TRANSACTIONS_CREATE,
    Permission.TRANSACTIONS_READ,
    Permission.TRANSACTIONS_UPDATE,
    Permission.TRANSACTIONS_DELETE,
    Permission.CATEGORIES_CREATE,
    Permission.CATEGORIES_READ,
    Permission.CATEGORIES_UPDATE,
    Permission.CATEGORIES_DELETE,
    Permission.USERS_INVITE,
    Permission.USERS_READ,
    Permission.USERS_UPDATE,
    Permission.USERS_CHANGE_ROLE,
    Permission.REPORTS_READ,
    Permission.REPORTS_EXPORT,
    Permission.SETTINGS_READ,
    Permission.SETTINGS_UPDATE,
    Permission.BUDGET_READ,
    Permission.BUDGET_UPDATE,
    Permission.RECURRING_TRANSACTIONS_CREATE,
    Permission.RECURRING_TRANSACTIONS_READ,
    Permission.RECURRING_TRANSACTIONS_UPDATE,
    Permission.RECURRING_TRANSACTIONS_DELETE,
    Permission.INDEBTEDNESS_READ,
  ],

  editor: [
    Permission.COMPANIES_READ,
    Permission.ACCOUNTS_CREATE,
    Permission.ACCOUNTS_READ,
    Permission.ACCOUNTS_UPDATE,
    Permission.TRANSACTIONS_CREATE,
    Permission.TRANSACTIONS_READ,
    Permission.TRANSACTIONS_UPDATE,
    Permission.CATEGORIES_CREATE,
    Permission.CATEGORIES_READ,
    Permission.CATEGORIES_UPDATE,
    Permission.USERS_READ,
    Permission.REPORTS_READ,
    Permission.BUDGET_READ,
    Permission.RECURRING_TRANSACTIONS_CREATE,
    Permission.RECURRING_TRANSACTIONS_READ,
    Permission.RECURRING_TRANSACTIONS_UPDATE,
    Permission.INDEBTEDNESS_READ,
  ],

  viewer: [
    Permission.COMPANIES_READ,
    Permission.ACCOUNTS_READ,
    Permission.TRANSACTIONS_READ,
    Permission.CATEGORIES_READ,
    Permission.USERS_READ,
    Permission.REPORTS_READ,
    Permission.BUDGET_READ,
    Permission.RECURRING_TRANSACTIONS_READ,
    Permission.INDEBTEDNESS_READ,
  ],

  // God has everything implicitly, but we can map it too
  god: Object.values(Permission),
};
