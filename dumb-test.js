const limiter = require('../lib');

let nrRunning = 0;
const testFunc = () => {
  nrRunning += 1;
  console.log(nrRunning);
  return new Promise(resolve => setTimeout(() => {
    console.log(nrRunning);
    nrRunning -= 1;
    resolve();
  }, Math.random() * 1000));
};


const limit = limiter(10);
for (let i = 0; i < 100; i += 1) {
  limit(testFunc)(i);
}
