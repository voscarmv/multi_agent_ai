import { registerAgent, roles } from './tools.js';
import { runAI } from './gpt.js';
import { tools, functions, getTermination } from './tools.js';

export class Agent {
    constructor(name, prompt, agentTools=[], agentFunctions={}) {
        this.name = name;
        this.messages = [
            {
                role: 'system',
                content: `${prompt}\n\n${roles}`
            }
        ];
        this.tools = tools.concat(agentTools);
        this.functions = Object.assign({}, functions, agentFunctions);
        registerAgent(name, this.receive.bind(this));
    }
    async receive(from, content) {
        if(getTermination()){
            return;
        }
        this.messages.push({
            role: 'system',
            content: `The following message came from ${from}:`
        });

        this.messages.push({
            role: 'user',
            content
        });
        console.log(this.messages);
        const reply = await runAI(
            this.messages,
            this.tools,
            this.functions
        );
        console.log(this.name);
        console.log(reply);
        console.log('---');
        this.messages = reply;
        return reply;
    }
}