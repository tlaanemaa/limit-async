const createLimiter = require('./lib');

const limit = createLimiter(10); // Will limit to 10 concurrent jobs
let nrRunning = 0;

const myAsyncfunction = (value) => {
  nrRunning += 1;
  return new Promise((resolve, reject) =>
    setTimeout(
      () => {
        nrRunning -= 1;
        if (Math.random() > 0.5) {
          resolve(value);
        } else {
          reject(value);
        }
      },
      (Math.random() * 900) + 100
    ));
};

const checkInterval = setInterval(
  () => console.log('   Currently running', nrRunning, 'jobs...')
  , 100
);

setTimeout(() => clearInterval(checkInterval), 3100);
for (let i = 0; i < 30; i += 1) {
  limit(myAsyncfunction)(i).then(
    value => console.log(' ✓ Resolved', value),
    reason => console.log(' ✗ Rejected', reason)
  );
}
