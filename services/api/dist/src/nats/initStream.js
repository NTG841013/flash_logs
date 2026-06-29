"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initNatsStream = initNatsStream;
const index_1 = require("./index");
async function initNatsStream() {
    const { nc } = await (0, index_1.getNats)();
    const jsm = await nc.jetstreamManager();
    await jsm.streams.add({
        name: "OML_LOGS",
        subjects: ["logs.ingest"],
        retention: "workqueue",
        storage: "file",
        max_age: 0,
        max_msgs: -1,
    });
    console.log('Jetstream stream OML_LOGS initialized');
}
//# sourceMappingURL=initStream.js.map