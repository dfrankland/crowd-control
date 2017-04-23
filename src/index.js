// Makes "private" properties and methods.
const map = new WeakMap();
const internal = object => {
  if (!map.has(object)) map.set(object, {});
  return map.get(object);
};

// Adds promises to a queue.
const enqueue = object => (createNewPromise, timeout) => {
  const previousPromise = Promise.resolve(
    internal(object).queue.pop(),
  );

  const promise = new Promise(
    async (resolve, reject) => {
      let resolvedOrRejected = false;

      if (typeof timeout === 'number') {
        setTimeout(
          () => {
            if (!resolvedOrRejected) {
              resolvedOrRejected = true;
              reject(
                new Error(
                  `Promise took longer than timeout (${timeout}ms).`,
                ),
              );
            }
          },
          timeout,
        );
      }

      try {
        await previousPromise;
        const value = await createNewPromise();
        if (!resolvedOrRejected) resolve(value);
      } catch (err) {
        if (!resolvedOrRejected) reject(err);
      }

      resolvedOrRejected = true;
    },
  );

  internal(object).queue.push(promise);
  return promise;
};

// Make all arguments (whether they are arrays or not) into one big flat array.
const flattenArguments = (...args) => (
  [...args].reduce(
    (allArgs, nextArg) => [
      ...allArgs,
      ...(Array.isArray(nextArg) ? nextArg : [nextArg]),
    ],
    [],
  )
);

// Add promise creating functions with optional timeout.
const control = object => (...args) => timeout => {
  const promiseCreatingFunctions = flattenArguments(...args).map(
    promiseCreatingFunction => internal(object).enqueue(
      promiseCreatingFunction,
      timeout,
    ),
  );

  return promiseCreatingFunctions.length > 1 ?
    promiseCreatingFunctions :
    promiseCreatingFunctions[0];
};

export default class {
  constructor() {
    internal(this).queue = [];
    internal(this).enqueue = enqueue(this);
    this.control = control(this);
  }
}
