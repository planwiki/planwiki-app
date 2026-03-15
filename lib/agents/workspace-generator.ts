import { Output, ToolLoopAgent } from "ai";

import { azure } from "../llm-provider.config";
import {
  createWorkspaceGeneratorContext,
  workspaceGeneratorContextSchema,
  generatedWorkspaceSchema,
  defaultWorkspaceGeneratorContext,
  type WorkspaceGeneratorContext,
} from "./context";
import { systemPromptBuilder } from "./prompts/system-prompt-builder";
import type { WorkspaceWidget } from "@/lib/widgets/widget-registry";

export const WORKSPACE_GENERATOR_MODEL = "gpt-4.1-mini";

export const workspaceGeneratorAgent = new ToolLoopAgent({
  id: "workspace-generator-agent",
  model: azure(WORKSPACE_GENERATOR_MODEL),
  output: Output.object({
    schema: generatedWorkspaceSchema,
    description:
      "A JSON object representing a PlanWiki workspace, adhering to the output contract specified in the system prompt.",
  }),
  callOptionsSchema: workspaceGeneratorContextSchema,
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    instructions: systemPromptBuilder(
      options ?? defaultWorkspaceGeneratorContext,
    ),
  }),
});

export const generateWorkspaceWithAgent = async ({
  prompt,
  context = createWorkspaceGeneratorContext(),
}: {
  prompt: string;
  context?: WorkspaceGeneratorContext;
}) => {
  const { output } = await workspaceGeneratorAgent.generate({
    prompt,
    options: context,
  });

  return { output };
};

export { createWorkspaceGeneratorContext };

export const formatWorkspaceMessageHistory = (
  history: Array<{
    role: string;
    content: unknown;
    metadata: unknown;
    createdAt: string;
  }>,
) =>
  history
    .map(
      (message, index) =>
        `${index + 1}. ${message.role}\ncontent: ${JSON.stringify(message.content)}\nmetadata: ${JSON.stringify(message.metadata)}\ncreatedAt: ${message.createdAt}`,
    )
    .join("\n\n");

export const buildGenerateNewWorkspacePrompt = (text: string) => `
Create a new PlanWiki workspace from the pasted plan below.

Source plan:
"""${text}"""
`.trim();

export const buildUpdateWorkspacePrompt = ({
  text,
  currentWidgets,
  messageHistory,
}: {
  text: string;
  currentWidgets: WorkspaceWidget[];
  messageHistory: string;
}) => `
Update the existing PlanWiki workspace using the latest user instruction.

Latest user instruction:
"""${text}"""

Current widgets:
${JSON.stringify(currentWidgets, null, 2)}

Message history:
${messageHistory}
`.trim();
