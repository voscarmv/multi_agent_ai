import { registerAgent, roles } from './tools.js';
import { runAI } from './gpt.js';
import { tools, functions, getTermination } from './tools.js';

export class Agent {
    constructor(name, prompt, agentTools = [], agentFunctions = {}) {
        this.name = name;
        this.queue = [];
        this.isBusy = false;
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
    receive(from, content) {
        if (getTermination()) {
            return;
        }
        this.queue.push({
            role: 'system',
            content: `The following message came from ${from}:`
        });
        this.queue.push({
            role: 'user',
            content
        });
        if (!this.isBusy) this.#processMessages();
    }
    async #processMessages() {
        this.isBusy = true;
        while (this.queue.length > 0) {
            this.messages.concat(this.queue);
            this.queue.length = 0;
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
        }
        this.isBusy = false;
        return;
    }
}