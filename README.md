# crowd-control

Control promises in a queue with optional timeouts.

## How to Use

1.  `import` the package and create an object.

    ```js
    import Crowd from 'crowd-control';

    const crowd = new Crowd();
    ```

2.  Add functions that return promises to the queue using `control`.

    ```js
    import Crowd from 'crowd-control';

    const crowd = new Crowd();

    const newCrowdControlledPromise = crowd.control(async () => undefined)();
    ```

## API

### Class: `Crowd`

### `new Crowd()`

Construct a new crowd object with an internal queue.

#### `crowd.control(promiseCreatingFunction, [promiseCreatingFunction])([timeout])`

Add a promise to be queued with a function returning a promise.

*   `promiseCreatingFunction`: must be functions that return a promise; can be
    given as arguments, as arrays, or even as arguments as arrays.

Examples of `promiseCreatingFunction`s:

```js
const promiseCreatingFunction1 = () => new Promise(resolve => resolve());
const proimseCreatingFunction2 = async () => undefined;
```

Returns a curried function to pass an option `timeout`.

*   `timeout`: an amount of time to wait for the given promise before
    `reject`ing.

Returns a `promise`.
