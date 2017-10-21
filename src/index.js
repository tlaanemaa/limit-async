
export default (limit) => {
  let running = [];

  // Return a wrapper function
  return (inputFunction) => {
    const callWrapper = (...args) => new Promise((resolve) => {
      if (running.length < limit) {
        // If we are under the limit, run this job right away
        const currentPromise = inputFunction(...args).then((result) => {
          // Remove this job from the list on completion
          running = running.filter(item => item !== currentPromise);
          resolve(result);
        });
        running.push(currentPromise);
      } else {
        // Run this function again when the first job completes to see if we can run now
        Promise.race(running).then(() => {
          callWrapper(...args);
        });
      }
    });

    return callWrapper;
  };
};
