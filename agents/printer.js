import 'dotenv/config';
import { registerPeer, roles } from './tools';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

export const messages = [{
        role: "system",
        content: `
You are the printer.

${roles}
`
}];

function receive(from, content){
    messages.push({
        role: 'system',
        content: `The following message came from ${from}`
    });
    messages.push({
        role: 'user',
        content 
    });
}

registerPeer('printer', receive);