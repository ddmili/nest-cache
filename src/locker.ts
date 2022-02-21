import Redis = require('ioredis');
import { Cluster as IORedisCluster, Redis as IORedisClient } from 'ioredis';
declare type Client = IORedisClient | IORedisCluster;
import Redlock from 'redlock';
import { Store } from './store';

export class Locker extends Store {

  public static getInstance(conf: Redis.RedisOptions): Locker {
    return new Locker(conf);
  }

  private locker: Redlock;

  constructor(conf: Redis.RedisOptions) {
    super(conf);
    this.locker = new Redlock([this.con], {
      automaticExtensionThreshold: 500, // time in ms
      driftFactor: 0.01, // multiplied by lock ttl to determine drift time
      retryCount: 10,
      retryDelay: 200, // time in ms
      retryJitter: 200, // time in ms
    });
  }

  public getLocker(resources: string[], duration: number) {
    return this.locker.acquire(resources, duration);
  }

}
