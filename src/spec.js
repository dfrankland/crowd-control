import { equal } from 'assert';
import Crowd from './index';

const QUEUE_LENGTH = 5;
const TIMEOUT = 1000;

const crowd = new Crowd();

let count = 0;
const asyncIncrementer = index => (
  new Promise(
    resolve => {
      setTimeout(
        () => {
          resolve(count);
          count += 1;
        },
        QUEUE_LENGTH - index,
      );
    },
  )
);

(async () => {
  const queue = new Array(QUEUE_LENGTH).fill(0).map(
    (value, index) => crowd.control(() => asyncIncrementer(index))(),
  );

  const values = await Promise.all(queue);

  for (let i = 0; i < queue.length; i += 1) {
    equal(values[i], i);
  }

  try {
    await crowd.control(
      () => new Promise(resolve => setTimeout(resolve, TIMEOUT * 2)),
    )(TIMEOUT);
    console.error('Timeout didn\'t work...'); // eslint-disable-line no-console
    process.exit(1);
  } catch (err) {
    equal(err.message, 'Promise took longer than timeout (1000ms).');
  }
})().catch(
  err => {
    console.error(err); // eslint-disable-line no-console
    process.exit(1);
  },
);
