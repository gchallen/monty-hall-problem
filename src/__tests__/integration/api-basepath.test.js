/**
 * Test API routing with and without basePath
 */

// Mock the request and response handling logic from server.js
describe('API BasePath Routing', () => {
  const mockPathname = (url, basePath = '') => {
    // Simulate the server logic for pathname normalization
    const pathname = new URL(url, 'http://localhost').pathname;
    const normalizedPathname = basePath && (pathname === basePath || pathname.startsWith(basePath + '/'))
      ? pathname.slice(basePath.length) 
      : pathname;
    return normalizedPathname;
  };

  describe('without basePath', () => {
    it('should route /api/stats correctly', () => {
      const normalized = mockPathname('/api/stats', '');
      expect(normalized).toBe('/api/stats');
    });

    it('should route /api/game-result correctly', () => {
      const normalized = mockPathname('/api/game-result', '');
      expect(normalized).toBe('/api/game-result');
    });

    it('should route root correctly', () => {
      const normalized = mockPathname('/', '');
      expect(normalized).toBe('/');
    });
  });

  describe('with basePath /monty-hall-problem', () => {
    const basePath = '/monty-hall-problem';

    it('should route /monty-hall-problem/api/stats to /api/stats', () => {
      const normalized = mockPathname('/monty-hall-problem/api/stats', basePath);
      expect(normalized).toBe('/api/stats');
    });

    it('should route /monty-hall-problem/api/game-result to /api/game-result', () => {
      const normalized = mockPathname('/monty-hall-problem/api/game-result', basePath);
      expect(normalized).toBe('/api/game-result');
    });

    it('should route /monty-hall-problem/ to /', () => {
      const normalized = mockPathname('/monty-hall-problem/', basePath);
      expect(normalized).toBe('/');
    });

    it('should route /monty-hall-problem to empty string', () => {
      const normalized = mockPathname('/monty-hall-problem', basePath);
      expect(normalized).toBe('');
    });

    it('should handle URLs without basePath (fallback)', () => {
      const normalized = mockPathname('/api/stats', basePath);
      expect(normalized).toBe('/api/stats'); // Should not strip basePath if it doesn't start with it
    });
  });

  describe('edge cases', () => {
    it('should handle empty basePath', () => {
      const normalized = mockPathname('/api/stats', '');
      expect(normalized).toBe('/api/stats');
    });

    it('should handle similar but different paths', () => {
      const basePath = '/monty-hall-problem';
      const normalized = mockPathname('/monty-hall-problems/api/stats', basePath);
      expect(normalized).toBe('/monty-hall-problems/api/stats'); // Should not strip if not exact match
    });
  });
});