import { Cache, Locker } from '../index';

test('Test locker', async () => {
  const locker = new Locker({ host: 'localhost', port: 6379, password: '123456' });
  const lock = await locker.getLocker(['aaa'], 66);
  await lock.release();
  locker.disconnect();
});

test('Test cache', async () => {
  const cache = new Cache({ host: 'localhost', port: 6379, password: '123456' });
  await cache.set('test','test')
  expect(await cache.get('test')).toBe('test');
  cache.disconnect();
});
