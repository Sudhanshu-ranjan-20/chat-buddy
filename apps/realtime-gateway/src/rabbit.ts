import amqp, { Channel, ChannelModel, ConsumeMessage } from "amqplib";

export type TRabbitConfig = {
  url: string;
  exchange: string;
  instanceId: string;
};

export type TRabbitClient = {
  publish: (routingKey: string, payload: unknown) => void;
  bindAndConsume: (
    bindings: string[],
    onMessage: (routingKey: string, payload: any) => Promise<void>
  ) => Promise<void>;
  close: () => Promise<void>;
};

export const createRabbitClient = async (
  cfg: TRabbitConfig
): Promise<TRabbitClient> => {
  const conn: ChannelModel = await amqp.connect(cfg.url);
  const ch: Channel = await conn.createChannel();

  await ch.assertExchange(cfg.exchange, "topic", { durable: true });

  const q = await ch.assertQueue(`q.gateway.${cfg.instanceId}`, {
    durable: false,
    exclusive: true,
    autoDelete: true,
  });

  async function bindAndConsume(
    bindings: string[],
    onMessage: (routingKey: string, payload: any) => Promise<void>
  ) {
    for (const key of bindings) {
      await ch.bindQueue(q.queue, cfg.exchange, key);
    }

    await ch.consume(
      q.queue,
      async (msg: ConsumeMessage | null) => {
        if (!msg) return;
        try {
          const routingKey = msg.fields.routingKey;
          const body = msg.content.toString("utf8");
          const payload = body ? JSON.parse(body) : null;

          await onMessage(routingKey, payload);
          ch.ack(msg);
        } catch (error) {
          ch.nack(msg, false, false);
        }
      },
      { noAck: false }
    );
  }

  function publish(routingKey: string, payload: unknown) {
    const buf = Buffer.from(JSON.stringify(payload));
    ch.publish(cfg.exchange, routingKey, buf, {
      contentType: "application/json",
      deliveryMode: 2,
    });
  }

  async function close() {
    await ch.close();
    await conn.close();
  }

  return { publish, bindAndConsume, close };
};
