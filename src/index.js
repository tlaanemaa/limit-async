// @flow

type InputFunction = (...args: any) => Promise<any>
type WrapperFunction = (inputFunction: InputFunction) => InputFunction
type Jobs = {
  running: number,
  queue: Array<() => void>
}

export default (limit: number): WrapperFunction => {
  // Internal state to keep track of running and queued jobs
  const jobs: Jobs = {
    running: 0,
    queue: []
  };

  // Return a wrapper function
  return (inputFunction: InputFunction): InputFunction =>
    // ...that returns a wrapped version of the function
    (...args: any) =>
      // ...that returns a wrapper promise
      new Promise((resolve) => {
        // Wrapper function to run this job
        const runJob = () => {
          jobs.running += 1;

          // Run the given input function with given arguments
          inputFunction(...args).then((result) => {
            jobs.running -= 1;

            // Resolve with given result
            resolve(result);

            // Run next job if there is one
            if (jobs.queue.length > 0) {
              jobs.queue.shift()();
            }
          });
        };

        // Either run the job right away or queue it if needed
        if (jobs.running < limit) {
          runJob();
        } else {
          jobs.queue.push(runJob);
        }
      });
};
