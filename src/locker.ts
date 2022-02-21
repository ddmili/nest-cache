import Redis = require('ioredis');
import { Cluster as IORedisCluster, Redis as IORedisClient } from 'ioredis';
declare type Client = IORedisClient | IORedisCluster;
import Redlock from 'redlock';

export class Locker {
  private con: Client;
  private locker: Redlock;
  constructor(conf: Redis.RedisOptions) {
    this.con = new Redis(conf);
    this.con.on('ready', () => {
      console.log('Locker IORedis ready');
    });
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

  public disconnect() {
    this.con.disconnect();
  }
}
