const createLimiter = require('./lib');

// Reporting function
const report = (...args) => console.log(...args);

// Create a limiter for 5 concurrent jobs
const limit = createLimiter(5);

// We will manually track running jobs here
let nrRunning = 0;

// Dummy async function to test our code
const myAsyncfunction = (value) => {
  // Add this process to running jobs
  nrRunning += 1;
  return new Promise((resolve, reject) =>
    setTimeout(
      () => {
        // Remove it from running jobs
        nrRunning -= 1;

        // Randomly resolve or reject the Promise
        // This way we get better test coverage
        if (Math.random() > 0.5) {
          resolve(value);
        } else {
          reject(value);
        }
      },

      // Randomise the delay to get better test coverage
      (Math.random() * 400) + 100
    ));
};

// Write out how many running jobs we have at an interval
const checkInterval = setInterval(
  () => report('   Currently running', nrRunning, 'jobs...'),
  100
);

// Clear the interval after all jobs should be finished
setTimeout(() => clearInterval(checkInterval), 3100);

// Start dummy jobs in a loop and write out their results
for (let i = 0; i < 30; i += 1) {
  limit(myAsyncfunction)(i).then(
    value => report(' ✓ Resolved', value),
    reason => report(' ✗ Rejected', reason)
  );
}
