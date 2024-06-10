import { renderHook, act, waitFor } from '@testing-library/react';
import useDeleteCartItem from './useDeleteCartItem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../store/ToastProvider';

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ToastProvider>{children}</ToastProvider>
  </QueryClientProvider>
);

describe('useDeleteCartItem', () => {
  it('장바구니 아이템을 제거해야 한다', async () => {
    const { result } = renderHook(() => useDeleteCartItem(), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({ cartItemId: 1 });
    });

    await waitFor(() => {
      expect(result.current.error).toBeUndefined();
    });
  });
});
