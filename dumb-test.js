const createLimiter = require('./lib');

const limit = createLimiter(10); // Will limit to 10 concurrent jobs
let nrRunning = 0;

const myAsyncfunction = (value) => {
  nrRunning += 1;
  return new Promise(resolve =>
    setTimeout(
      () => {
        nrRunning -= 1;
        resolve(value);
      },
      Math.random() * 1000
    ));
};

const checkInterval = setInterval(() => console.log('Currently running', nrRunning, 'jobs...'), 100);
setTimeout(() => clearInterval(checkInterval), 4000);
for (let i = 0; i < 30; i += 1) {
  limit(myAsyncfunction)(i).then(value => console.log('Resolved', value));
}
