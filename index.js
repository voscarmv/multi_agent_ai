import 'dotenv/config';
import Agent from 'agents/Agent';
import { editorTools, editorFunctions } from './agents/tools';

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