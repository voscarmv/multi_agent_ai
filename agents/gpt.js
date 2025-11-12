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

export async function runAI(name, messages, tools, functions, additionalArgs = {}) {
  // console.log(JSON.stringify(messages));
  let reply = await gpt(messages, tools);
  // Add assistant message
  const message = {
    role: 'assistant',
    content: reply.message?.content || '',
    ...(reply.tool_calls?.length ? { tool_calls: reply.tool_calls } : {})
  };
  messages.push(message);
  // If the AI requested tools, process them all
  // console.log(`These tool calls come from ${name}\n${JSON.stringify(reply.tool_calls)}`);
  if (reply.tool_calls) {
    for (let i = 0; i < reply.tool_calls.length; i++) {
      const result = await callTool(reply.tool_calls[i], additionalArgs, functions);
      messages.push({
        role: 'tool',
        tool_call_id: result.tool_call_id,
        content: result.content || ''
      });
      // console.log(JSON.stringify(messages)); // This will not work because agents will start sending messages to themselves. Find a workaround for when you need to call several tools in a row and generate output based on the returns
    }
    // return runAI(name, messages, tools, functions, additionalArgs);
  }

  // const reply2 = await gpt(messages, tools);
  // const message2 = {
  //   role: 'assistant',
  //   content: reply2.message?.content || '',
  //   ...(reply2.tool_calls?.length ? { tool_calls: reply2.tool_calls } : {})
  // };
  // messages.push(message2);
  // console.log(JSON.stringify(messages));

  // // If there were tool calls, rerun the AI — recursively
  // if (reply2.tool_calls.length > 0) {
  //   return runAI(messages, tools, functions, additionalArgs);
  // }

  // No more tools — return the final conversation state
  return messages;
}
