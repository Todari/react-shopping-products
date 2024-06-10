import { renderHook, waitFor } from '@testing-library/react';
import useCartItemList from './useCartItemList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { END_POINTS } from '../apis/config';

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useCartItemList', () => {
  describe('장바구니 목록 조회', () => {
    it('장바구니 아이템을 가져와야 한다', async () => {
      const { result } = renderHook(() => useCartItemList(), { wrapper });

      await waitFor(() => {
        expect(result.current.data?.content.length).toBeGreaterThan(0);
      });
    });

    it('상품 목록 조회 중 로딩 상태', () => {
      const { result } = renderHook(() => useCartItemList(), { wrapper });

      expect(result.current.isFetching).toBe(true);
    });

    it('상품 목록 조회 중 에러 상태', async () => {
      server.use(
        http.get(
          END_POINTS.PRODUCTS,
          () => new HttpResponse(null, { status: 500 }),
        ),
      );

      const { result } = renderHook(() => useCartItemList(), { wrapper });
      await waitFor(() => {
        expect(result.current.).toBe(true);
      });
    });
  });
});
