import { registerAgent, roles } from './tools.js';
import { runAI } from './gpt.js';
import { tools, functions } from './tools.js';

export class Agent {
    constructor(name, prompt, agentTools=[], agentFunctions={}) {
        this.name = name;
        this.messages = [
            {
                role: 'system',
                content: `${prompt}\n\n${roles}`
            }
        ];
        registerAgent(this.name, this.receive);
    }
    async receive(from, content) {
        this.messages.push({
            role: 'system',
            content: `The following message was from ${from}:`
        });

        this.messages.push({
            role: 'user',
            content
        });

        const reply = await runAI(
            this.messages,
            tools.concat(agentTools),
            Object.assign({}, functions, agentFunctions)
        );
        this.messages = reply;
        return reply;
    }
}