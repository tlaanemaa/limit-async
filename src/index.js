// @flow

type InputFunction = (...args: any) => Promise<any>
type WrapperFunction = (inputFunction: InputFunction) => InputFunction

export default (limit: number): WrapperFunction => {
  // Array of currently running jobs
  let runningJobs: Array<Promise<any>> = [];

  // Return a wrapper function
  return (inputFunction: InputFunction): InputFunction =>
    // ...that returns a wrapped version of the function
    (...args: any) =>
      // ...that returns a wrapper promise
      new Promise((resolve) => {
        // Define the cheking part as a function so we can call it recursively
        const checkQueue = () => {
          if (runningJobs.length < limit) {
            // If we are under the limit, run this job right away
            const currentPromise = inputFunction(...args).then((result) => {
              // Remove this job from the list on completion
              runningJobs = runningJobs.filter(item => item !== currentPromise);

              // Resolve the wrapper promise with correct result
              resolve(result);
            });
            runningJobs.push(currentPromise);
          } else {
            // Run this function again whenever a job completes to check if our job can be started
            Promise.race(runningJobs).then(() => {
              checkQueue();
            });
          }
        };

        // Call the checker function
        checkQueue();
      });
};
