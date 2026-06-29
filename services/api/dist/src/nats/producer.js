"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishLogBatch = publishLogBatch;
const index_1 = require("./index");
async function publishLogBatch(keyId, logs, serverReceivedAt) {
    const { nc, jc } = await (0, index_1.getNats)();
    const js = nc.jetstream();
    await js.publish('log.ingest', jc.encode({
        keyId,
        serverReceivedAt,
        timestamp: Date.now(),
        logs,
    }));
}
//# sourceMappingURL=producer.js.map