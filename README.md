# async-limit
An asynchronous process rate limiter that works with promises

One of the core principles when creating this was to give you as much freedom when using it as possible. Thus it is implemented as a higher order function that will wrap your function and it's promise as transparently as possible. Also, by defining the limit separately, it allows you to apply the same limit to multiple different functions, for example to all HTTP requests.

<h4>Usage</h4>

```javascript
const createLimiter = require('async-limiter')

const limit = createLimiter(10); // Will limit to 10 concurrent jobs

const myAsyncfunction = value =>
  new Promise(resolve =>
    setTimeout(
      () => resolve(value),
      1000
    ));

for (let i = 0; i < 30; i += 1) {
  // This will print out 0 to 29, 10 values at a time
  limit(myAsyncfunction)(i).then(console.log);
}
```
