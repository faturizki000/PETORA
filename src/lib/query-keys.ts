export const queryKeys = {
  settings: {
    all: ['settings'] as const,
    byCategory: (category: string) => [...queryKeys.settings.all, category] as const,
    key: (key: string) => [...queryKeys.settings.all, 'key', key] as const,
    public: [...queryKeys.settings.all, 'public'] as const,
  },
  payments: {
    all: ['payments'] as const,
    byInvoice: (invoiceId: string) => [...queryKeys.payments.all, invoiceId] as const,
    pending: [...queryKeys.payments.all, 'pending'] as const,
  },
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.customers.lists(), filters] as const,
    details: () => [...queryKeys.customers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.customers.details(), id] as const,
  },
  pets: {
    all: ['pets'] as const,
    lists: () => [...queryKeys.pets.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.pets.lists(), filters] as const,
    details: () => [...queryKeys.pets.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.pets.details(), id] as const,
    byCustomer: (customerId: string) => [...queryKeys.pets.all, 'byCustomer', customerId] as const,
    healthTimeline: (petId: string) => [...queryKeys.pets.all, 'healthTimeline', petId] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    lists: () => [...queryKeys.appointments.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.appointments.lists(), filters] as const,
    details: () => [...queryKeys.appointments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.appointments.details(), id] as const,
    byDate: (date: string) => [...queryKeys.appointments.all, 'byDate', date] as const,
    byDoctor: (doctorId: string, date: string) =>
      [...queryKeys.appointments.all, 'byDoctor', doctorId, date] as const,
  },
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    lowStock: (branchId?: string) => [...queryKeys.products.all, 'lowStock', branchId] as const,
    expiringSoon: (days: number, branchId?: string) =>
      [...queryKeys.products.all, 'expiringSoon', days, branchId] as const,
  },
  invoices: {
    all: ['invoices'] as const,
    lists: () => [...queryKeys.invoices.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.invoices.lists(), filters] as const,
    details: () => [...queryKeys.invoices.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.invoices.details(), id] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    unread: [...queryKeys.notifications.all, 'unread'] as const,
  },
  branches: {
    all: ['branches'] as const,
    current: [...queryKeys.branches.all, 'current'] as const,
  },
};
