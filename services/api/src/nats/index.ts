import {JSONCodec, connect}from 'nats';

const jc =JSONCodec();
let natsConnection:any=null;

export async function getNats(){
    if (!natsConnection){
        try {
            natsConnection = await connect({
                servers: process.env.NATS_URL || 'nats://localhost:4222',
                name: 'oml-server',
                waitOnFirstConnect: false,
                reconnect: true,
                maxReconnectAttempts: -1,
            });
            console.log('Connected to NATS');
        } catch (err) {
            console.error('Failed to connect to NATS:', err.message);
            throw err;
        }
    }
    return {nc: natsConnection, jc};
}
