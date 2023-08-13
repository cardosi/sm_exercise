import { renderHook } from '@testing-library/react-hooks'
import { useFetchAll } from '../useFetchAll';

describe('useFetchAll', () => {
  const fetchSpy = vi.spyOn(global, 'fetch');

  it('should set isLoading to true when fetchAll is called', () => {
    const { result } = renderHook(() => useFetchAll('pizzas'));
    expect(result.current.isLoading).toBe(false);
    result.current.fetchAll();
    expect(result.current.isLoading).toBe(true);
  });

  it('should set isLoading to false when fetchAll is called and the fetch is complete', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFetchAll('pizzas'));
    expect(result.current.isLoading).toBe(false);
    result.current.fetchAll();
    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
  });

  describe('when the fetch succeeds', () => {
    beforeEach(() => {
      const mockResolveValue = {
        ok: true,
        json: () => new Promise((resolve) => resolve(
          [
            { id: 1, name: 'Pizza 1' },
            { id: 2, name: 'Pizza 2' },
          ]
        ))
      };

      fetchSpy.mockReturnValueOnce(mockResolveValue as unknown as Promise<Response>);
    });

    it('should set data to the response when fetchAll is called and the fetch is complete', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useFetchAll('pizzas'));
      expect(result.current.data).toEqual([]);
      result.current.fetchAll();
      await waitForNextUpdate();
      expect(result.current.data).toEqual([{ id: 1, name: 'Pizza 1' }, { id: 2, name: 'Pizza 2' }]);
    });

    it('should set error to null when fetchAll is called and the fetch succeeds', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useFetchAll('pizzas'));
      expect(result.current.error).toBe(null);
      result.current.fetchAll();
      await waitForNextUpdate();
      expect(result.current.error).toBe(null);
    });
  });

  describe('when the fetch fails', () => {
    beforeAll(() => {
      fetchSpy.mockReturnValueOnce(new Promise((_, reject) => reject('Error!')));
    });

    it('should set error to the error message when fetchAll is called and the fetch fails', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useFetchAll('pizzas'));
      expect(result.current.error).toBe(null);
      result.current.fetchAll();
      await waitForNextUpdate();
      expect(result.current.error).toBe('Error fetching pizzas: Error!');
    });

    it('should set isLoading to false when fetchAll is called and the fetch fails', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useFetchAll('pizzas'));
      expect(result.current.isLoading).toBe(false);
      result.current.fetchAll();
      await waitForNextUpdate();
      expect(result.current.isLoading).toBe(false);
    });
  });
});