import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import {
  recordManualPaymentAction,
  verifyPaymentAction,
  splitPaymentAction,
} from '@/app/actions/payment.actions';
import type { ManualPaymentInput, VerifyPaymentInput, SplitPaymentInput } from '@/types';

export function useRecordManualPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ManualPaymentInput) => recordManualPaymentAction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: VerifyPaymentInput) => verifyPaymentAction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
}

export function useSplitPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SplitPaymentInput) => splitPaymentAction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
}
