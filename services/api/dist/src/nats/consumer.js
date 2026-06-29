"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startLogsConsumer = startLogsConsumer;
const nats_1 = require("nats");
const index_1 = require("./index");
async function startLogsConsumer() {
    const { nc, jc } = await (0, index_1.getNats)();
    const js = nc.jetstream();
    const jsm = await nc.jetstreamManager();
    const durable = 'oml-log-worker';
    const subject = 'log.ingest';
    const streamName = 'OML_LOGS';
    const opts = (0, nats_1.consumerOpts)();
    opts.durable(durable);
    opts.manualAck();
    opts.ackExplicit();
    opts.deliverTo('oml.logs.worker');
}
//# sourceMappingURL=consumer.js.map