import Redis = require('ioredis');
import { Cluster as IORedisCluster, Redis as IORedisClient } from 'ioredis';
import { Store } from './store';
declare type Client = IORedisClient | IORedisCluster;

export class Cache extends Store {
  public static getInstance(conf: Redis.RedisOptions): Cache {
    return new Cache(conf);
  }

  constructor(conf: Redis.RedisOptions) {
    super(conf);
    this.con = new Redis(conf);
    this.con.on('ready', () => {
      console.info('IORedis ready');
    });
  }
}
