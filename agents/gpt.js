import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

export async function gpt(messages, tools) {
  const completion = await openai.chat.completions.create({
    messages,
    tools,
    model: 'gpt-4.1-mini'
  });
  const message = completion?.choices?.[0]?.message;
  return {
    message,
    tool_calls: message?.tool_calls || []
  };
}

export async function callTool(tool_call, additionalArgs, functions) {
  const tool_call_id = tool_call?.id;
  const functionName = tool_call?.function?.name;
  const functionArgs = JSON.parse(tool_call?.function?.arguments || '{}');

  const fn = functions[functionName];
  if (!fn) throw new Error(`Function "${functionName}" not found.`);

  const content = await fn(functionArgs, additionalArgs);

  return {
    tool_call_id,
    content
  };
}

export async function runAI(messages, tools, functions, additionalArgs = {}) {
  const reply = await gpt(messages, tools);
  // Add assistant message
  const message = {
    role: 'assistant',
    content: reply.message?.content || '',
    ...(reply.tool_calls.length ? { tool_calls: reply.tool_calls } : {})
  };
  messages.push(message);

  // If the AI requested tools, process them all
  for (const tool_call of reply.tool_calls) {
    const result = await callTool(tool_call, additionalArgs, functions);
    messages.push({
      role: 'tool',
      tool_call_id: result.tool_call_id,
      content: result.content || ''
    });
  }

  // If there were tool calls, rerun the AI — recursively
  if (reply.tool_calls.length > 0) {
    return runAI(messages, tools, functions, additionalArgs);
  }

  // No more tools — return the final conversation state
  return messages;
}
