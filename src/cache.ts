import Redis = require('ioredis');
import { Cluster as IORedisCluster, Redis as IORedisClient } from 'ioredis';
declare type Client = IORedisClient | IORedisCluster;

export class Cache {
  private con: Client;

  constructor(conf: Redis.RedisOptions) {
    this.con = new Redis(conf);
    this.con.on('ready', () => {
      console.info('IORedis ready');
    });
  }

  public async monitorEvent(topic: string, fun: (_: string) => Promise<boolean>) {
    const con = this.con.duplicate();
    while (true) {
      let res = null;
      try {
        // 调用方法；
        res = await con.blpop(topic, 60 * 10);
        console.log('收到消息', res);
        if (res.length >= 2) {
          const rs = await fun(res[1]);
          if (rs === false) {
            // 执行失败，放回队列
            con.lpush(topic, res[1]);
          }
        }
      } catch (err) {
        console.log('brpop 出错,重新brpop');
        continue;
      }
    }
  }

  // subscribe 订阅消息
  public subscribe(topic: string, fun: (_: string) => Promise<boolean>) {
    const con = this.con.duplicate();

    // tslint:disable-next-line:only-arrow-functions
    con.on('subscribe', function () {
      console.log(`${topic} open`);
    });
    con.on('message', async (_: any, message: string) => {
      console.log(message); // 'message'
      await fun(message);
    });
    con.subscribe(topic);
    return con;
  }

  public publish(topic: string, field: string) {
    return this.con.publish(topic, field);
  }

  public get(key: string) {
    return this.con.get(key);
  }

  public set(key: string, value: string) {
    return this.con.set(key,value);
  }


  public disconnect(){
    return this.con.disconnect();
  }

  public unsubscribe(key:string){
    return this.con.unsubscribe(key);
  }
}
