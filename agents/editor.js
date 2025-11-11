import 'dotenv/config';
import { registerAgent, roles } from './tools';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

export const messages = [{
        role: "system",
        content: `
You are the editor.

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
    openai.chat.completions
}

registerAgent('editor', receive);
