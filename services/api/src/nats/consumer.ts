import { consumerOpts } from "nats";
import { getNats } from "./index";

export async function startLogsConsumer() {

    const {nc, jc} = await getNats();
    const js = nc.jetstream();
    const jsm = await nc.jetstreamManager();

    const durable = 'oml-log-worker';
    const subject = 'log.ingest';
    const streamName = 'OML_LOGS';

    const opts = consumerOpts();
    opts.durable(durable);
    opts.manualAck();
    opts.ackExplicit();
    opts.deliverTo('oml.logs.worker');
}