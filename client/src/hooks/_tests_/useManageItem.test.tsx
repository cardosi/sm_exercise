import { renderHook } from "@testing-library/react-hooks";
import { useManageItem } from "../useManageItem";

describe('useManageItem', () => {
  const API_URL = import.meta.env.VITE_API_URL
  const fetchSpy = vi.spyOn(global, 'fetch');

  beforeEach(() => {
    fetchSpy.mockReset();
  });

  describe('create item', () => {
    it('should set isLoading to true when createItem is called', () => {
      const { result } = renderHook(() => useManageItem('pizzas'));
      expect(result.current.isLoading).toBe(false);
      result.current.createItem({});
      expect(result.current.isLoading).toBe(true);
    });

    it('should set isLoading to false when createItem is complete', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useManageItem('pizzas'));
      expect(result.current.isLoading).toBe(false);
      result.current.createItem({});
      expect(result.current.isLoading).toBe(true);
      await waitForNextUpdate();
      expect(result.current.isLoading).toBe(false);
    });

    it('should make a POST request to the correct endpoint when createItem is called', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useManageItem('pizzas'));
      result.current.createItem({ name: 'Pizza 1' });
      await waitForNextUpdate();
      expect(fetchSpy).not.toBeUndefined()
      if (fetchSpy.mock.calls[0][1]) {
        expect(fetchSpy.mock.calls[0][0]).toBe(API_URL + '/pizzas')
        expect(fetchSpy.mock.calls[0][1].method).toBe('POST')
        expect(fetchSpy.mock.calls[0][1].headers).toEqual({ 'Content-Type': 'application/json' })
        expect(fetchSpy.mock.calls[0][1].body).toContain('"name":"Pizza 1"')
        expect(fetchSpy.mock.calls[0][1].body).toContain('"id":')
      } else {
        expect(fetchSpy).toHaveBeenCalled();
      }
    });

    it('should set the error message when createItem is called and the request fails', async () => {
      fetchSpy.mockReturnValueOnce(new Promise((_, reject) => reject('Error!')));
      const { result, waitForNextUpdate } = renderHook(() => useManageItem('pizzas'));
      expect(result.current.error).toBe(null);
      result.current.createItem({});
      await waitForNextUpdate();
      expect(result.current.error).toBe('Error creating new pizzas: Error!');
    });
  });

  describe('update item', () => {
    it('should set isLoading to true when updateItem is called', () => {
      const { result } = renderHook(() => useManageItem('pizzas'));
      expect(result.current.isLoading).toBe(false);
      result.current.updateItem(1, 'test');
      expect(result.current.isLoading).toBe(true);
    });

    it('should set isLoading to false when updateItem is complete', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useManageItem('pizzas'));
      expect(result.current.isLoading).toBe(false);
      result.current.updateItem(1, 'test');
      expect(result.current.isLoading).toBe(true);
      await waitForNextUpdate();
      expect(result.current.isLoading).toBe(false);
    });

    it('should make a PUT request to the correct endpoint when updateItem is called', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useManageItem('pizzas'));
      result.current.updateItem(1, 'Pizza 1');
      await waitForNextUpdate();
      expect(fetchSpy).toHaveBeenCalledWith(API_URL + '/pizzas/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Pizza 1' })
      });
    });

    it('should set the error message when updateItem is called and the request fails', async () => {
      fetchSpy.mockReturnValueOnce(new Promise((_, reject) => reject('Error!')));
      const { result, waitForNextUpdate } = renderHook(() => useManageItem('pizzas'));
      expect(result.current.error).toBe(null);
      result.current.updateItem(1, 'test_name');
      await waitForNextUpdate();
      expect(result.current.error).toBe('Error updating pizzas: Error!');
    });
  });

  describe('delete item', () => {
    it('should set isLoading to true when deleteItem is called', () => {
      const { result } = renderHook(() => useManageItem('pizzas'));
      expect(result.current.isLoading).toBe(false);
      result.current.deleteItem(1, []);
      expect(result.current.isLoading).toBe(true);
    });

    it('should set isLoading to false when deleteItem is complete', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useManageItem('pizzas'));
      expect(result.current.isLoading).toBe(false);
      result.current.deleteItem(1, []);
      expect(result.current.isLoading).toBe(true);
      await waitForNextUpdate();
      expect(result.current.isLoading).toBe(false);
    });

    it('should make a DELETE request to the correct endpoint when deleteItem is called', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useManageItem('pizzas'));
      result.current.deleteItem(1, [1, 2, 3]);
      await waitForNextUpdate();
      expect(fetchSpy).toHaveBeenCalledWith(API_URL + '/pizzas/1', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pizza_topping_ids: [1, 2, 3] })
      });
    });

    it('should set the error message when deleteItem is called and the request fails', async () => {
      fetchSpy.mockReturnValueOnce(new Promise((_, reject) => reject('Error!')));
      const { result, waitForNextUpdate } = renderHook(() => useManageItem('pizzas'));
      expect(result.current.error).toBe(null);
      result.current.deleteItem(1, []);
      await waitForNextUpdate();
      expect(result.current.error).toBe('Error deleting pizzas: Error!');
    });
  });
});