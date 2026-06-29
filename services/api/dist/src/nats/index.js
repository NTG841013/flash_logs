"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNats = getNats;
const nats_1 = require("nats");
const jc = (0, nats_1.JSONCodec)();
let natsConnection = null;
async function getNats() {
    if (!natsConnection) {
        try {
            natsConnection = await (0, nats_1.connect)({
                servers: process.env.NATS_URL || 'nats://localhost:4222',
                name: 'oml-server',
                waitOnFirstConnect: false,
                reconnect: true,
                maxReconnectAttempts: -1,
            });
            console.log('Connected to NATS');
        }
        catch (err) {
            console.error('Failed to connect to NATS:', err.message);
            throw err;
        }
    }
    return { nc: natsConnection, jc };
}
//# sourceMappingURL=index.js.map