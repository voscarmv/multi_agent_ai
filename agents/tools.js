
const agents = {};

export const roles = `
The goal of the team is to produce a short and original children's tale and generate a printable output beautified with md5.

Editor: Directs the whole operation. Gives orders to the writer and the printer. Checks the work of the others and suggest changes until the work is satisfactory. It terminates the conversation once the task is done.
Writer: Comes up with the story based on the Editor's guidelines.
Printer: Decorates the manuscript produced by the writer with md formatting, creating the final product.
`;

export function registerAgent(agent, send) {
    agents[agent] = {
        send
    }
}

export const tools = [
    {
        type: 'function',
        function: {
            name: 'sendMessage',
            description: 'Send a message to a peer.',
            parameters: {
                type: 'object',
                properties: {
                    from: {
                        type: 'string',
                        description: 'The sender of the message. Editor: The director of this project. Writer: The one who will write the tale. Printer: The one who will add format and decoration to the finished product.',
                        enum: [
                            'editor',
                            'printer',
                            'writer'
                        ]
                    },
                    to: {
                        type: 'string',
                        description: 'Which peer to send the message to. Editor: The director of this project. Writer: The one who will write the tale. Printer: The one who will add format and decoration to the finished product.',
                        enum: [
                            'editor',
                            'printer',
                            'writer'
                        ]
                    },
                    message: {
                        type: 'string',
                        description: 'The message to be sent',
                    }
                },
                required: ['from', 'to', 'message']
            }
        }
    }
];

let terminate = false;
export function getTermination() {
    return terminate;
}

export const functions = {
    sendMessage: async (params) => {
        const { from, to, message } = params;
        agents[to]['send'](from, message);
    }
};

export const editorTools = [
    {
        type: 'function',
        function: {
            name: 'terminate',
            description: 'Terminate the conversation among all agents once the task has been completed.',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            }
        }
    }
];

export const editorFunctions = {
    terminate: async (params) => {
        terminate = true;
    }
};