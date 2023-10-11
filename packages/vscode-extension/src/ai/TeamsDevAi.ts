// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

"use strict";

import OpenAI from "openai";
import { Progress, SlashResponse, MarkdownString, FileTreeData } from "vscode";

const functions = [
  {
    name: "notify_sample_found",
    description: "When the best match sample found, this function will notify the event handler.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the sample, e.g. bot-sso, hello-world-tab-with-backend",
        },
        owner: {
          type: "string",
          description: "The owner of the sample.",
        },
        repo: {
          type: "string",
          description: "The github repo of the sample.",
        },
      },
      required: ["name", "owner", "repo"],
    },
  },
];

const prompt = `
- You are an advisor for Teams App developers.
- You want to help them to find the right sample code for their needs.
- You need to get all the samples from sample list.
- Analyze the samples from its description and keywords and find the best match for the user's needs.
- You must call notify_sample_found function to notify the event handler when the best match sample found.
- Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous.
`;

export class TeamsDevAI {
  openai: OpenAI;
  model: string;
  handler: (args: string) => Promise<[FileTreeData, any]>;
  constructor(
    apiKey: string,
    resource: string,
    deployment: string,
    apiVersion: string,
    handler: (args: string) => Promise<[FileTreeData, any]>
  ) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      baseURL: `https://${resource}.openai.azure.com/openai/deployments/${deployment}`,
      defaultQuery: { "api-version": apiVersion },
      defaultHeaders: { "api-key": apiKey },
    });
    this.model = deployment;
    this.handler = handler;
  }

  async matchSamples(
    input: string,
    samples: any[],
    progress: Progress<SlashResponse>
  ): Promise<[FileTreeData | "", any]> {
    const msg: any[] = [
      { role: "system", content: "sample list: " + JSON.stringify(samples) },
      { role: "system", content: prompt },
      { role: "user", content: "user input: " + input },
    ];

    const completion = await this.openai.chat.completions.create({
      messages: msg,
      model: this.model,
      functions: functions,
      temperature: 0.1,
    });
    console.log(JSON.stringify(completion.choices, null, 2));

    const replyMessage = completion.choices[0].message.content;

    if (replyMessage) {
      progress.report({ message: new MarkdownString(replyMessage) });
    }

    if (completion.choices[0].finish_reason != "function_call") {
      return ["", {}];
    }

    const functionCall = completion.choices[0].message.function_call;
    let treeData: FileTreeData | "" = "";
    let sample: any = {};
    if (functionCall?.name === "notify_sample_found") {
      [treeData, sample] = await this.handler(functionCall?.arguments);
    }

    msg.push({
      role: "function",
      name: "notify_sample_found",
      content: "",
    });

    const stream = await this.openai.chat.completions.create({
      model: this.model,
      messages: msg,
      stream: true,
    });

    for await (const part of stream) {
      progress.report({ message: new MarkdownString(part.choices[0]?.delta?.content ?? "") });
    }

    progress.report({
      message: new MarkdownString("Here's a proposed directory structure for your Teams project:"),
    });
    if (treeData != "") {
      progress.report({ message: { treeData: treeData } });
    }

    return [treeData, sample];
  }
}
