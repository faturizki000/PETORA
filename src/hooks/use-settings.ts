import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { SettingsService } from '@/lib/services/settings.service';
import {
  updateStoreSettingsAction,
  updatePaymentSettingsAction,
  updateSettingsBatchAction,
} from '@/app/actions/settings.actions';
import type { StoreSettingsInput, PaymentSettingsInput } from '@/types';

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings.all,
    queryFn: () => SettingsService.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSettingsByCategory(category: string) {
  return useQuery({
    queryKey: queryKeys.settings.byCategory(category),
    queryFn: () => SettingsService.getByCategory(category),
  });
}

export function useSetting<T>(key: string) {
  return useQuery({
    queryKey: queryKeys.settings.key(key),
    queryFn: () => SettingsService.getValue<T>(key),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicSettings() {
  return useQuery({
    queryKey: queryKeys.settings.public,
    queryFn: () => SettingsService.getPublicSettings(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useUpdateStoreSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: StoreSettingsInput) => updateStoreSettingsAction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
    },
  });
}

export function useUpdatePaymentSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PaymentSettingsInput) => updatePaymentSettingsAction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
    },
  });
}

export function useUpdateSettingsBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Array<{ key: string; value: any }>) =>
      updateSettingsBatchAction({ updates }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
    },
  });
}
