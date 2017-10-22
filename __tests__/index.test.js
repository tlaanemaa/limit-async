const createLimiter = require('../lib');

// Test function for resolving promises
const testResolvedFunction = value => new Promise(resolve => setTimeout(
  () => resolve(value),
  10
));

// Test functions for rejecting promises
const testRejectedFunction = value => new Promise((resolve, reject) => setTimeout(
  () => reject(value),
  10
));

test('should work on import', () => {
  expect(typeof createLimiter).toBe('function');
});

test('should create a limiter function', () => {
  const limit = createLimiter(10);
  expect(typeof limit).toBe('function');
});

test('should work with resolved promises', () => {
  const limit = createLimiter(1);
  return Promise.all([
    limit(testResolvedFunction)(3).then(result => expect(result).toBe(3)),
    limit(testResolvedFunction)(4).then(result => expect(result).toBe(4))
  ]);
});

test('should work with rejected promises', () => {
  const limit = createLimiter(10);
  return Promise.all([
    limit(testRejectedFunction)(5).catch(reason => expect(reason).toBe(5)),
    limit(testRejectedFunction)(6).catch(reason => expect(reason).toBe(6))
  ]);
});
