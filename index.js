import 'dotenv/config';
import { Agent } from './agents/Agent.js';
import { editorTools, editorFunctions, getTermination } from './agents/tools.js';

const editor = new Agent(
    'editor',
    'You are the editor.',
    editorTools,
    editorFunctions
);
const writer = new Agent(
    'writer',
    'You are the writer.'
);
const printer = new Agent(
    'printer',
    'You are the printer'
);

editor.receive('system', 'Begin the process now.');

