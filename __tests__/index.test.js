const limiter = require('../lib');

// TODO; This test is completely broken for some reason

let nrRunning = 0;

const testFunc = () => {
  nrRunning += 1;
  return new Promise(resolve => setTimeout(() => {
    nrRunning -= 1;
    resolve();
  }, 1000));
};

test('creates only up to 10 jobs', (done) => {
  const limit = limiter(100);
  for (let i = 0; i < 30; i += 1) {
    limit(testFunc)();
  }

  // Sample the number of running processes
  setTimeout(() => expect(nrRunning).toEqual(10), 10);
  setTimeout(() => expect(nrRunning).toEqual(10), 900);
  setTimeout(() => expect(nrRunning).toEqual(10), 1900);
  setTimeout(() => expect(nrRunning).toEqual(10), 2900);
  setTimeout(() => {
    expect(nrRunning).toEqual(0);
    done();
  }, 3500);
});
