import { ToolLoopAgent } from "ai";
import { azure } from "@ai-sdk/azure";

export const planParserAgent = new ToolLoopAgent({
  id: "plan-parser-agent",
  model: azure("gpt-4.1-mini"),

  prepareCall: ({ options, ...settings }) => ({
    ...settings,

    tools: {},
  }),
});
