// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import axios from "axios";
import { sendRequestWithRetry } from "./fileHelper";

export interface Sample {
  name: string;
  description: string;
  url: string;
  repoSHA: string;
  sha: string;
  owner: string;
  repo: string;
  keywords: string[];
}

export const samples: Sample[] = [
  {
    name: "bot-sso",
    description:
      "This is a sample chatbot application demonstrating Single Sign-on using botbuilder and Teams Framework that can respond to a show message.",
    url: "https://github.com/OfficeDev/TeamsFx-Samples/tree/d63c41b3a8ed971f2bdf19e30e2ac3a60b9e27d3/bot-sso",
    repoSHA: "d63c41b3a8ed971f2bdf19e30e2ac3a60b9e27d3",
    sha: "55c09e604c65acc6879b2e54df0e31bcb6ca4df4",
    owner: "OfficeDev",
    repo: "TeamsFx-Samples",
    keywords: ["bot", "sso", "chat bot", "chatbot", "typescript", "botbuilder", "teamsfx"],
  },
  {
    name: "command-bot-with-sso",
    description: `This is a simple command bot that implements single sign-on feature to retrieve profile and photo for currently signed-in user using Bot Framework SDK, TeamsFx SDK and Microsoft Graph API, and the commands can be found as below:

| command    | response                                          | sso command |
| ---------- | ------------------------------------------------- | ----------- |
| helloworld | helloworld adaptive card message                  | false       |
| profile    | user profile information from Microsoft Graph API | true        |
| photo      | user photo image from Microsoft Graph API         | true        |`,
    url: "https://github.com/OfficeDev/TeamsFx-Samples/tree/d63c41b3a8ed971f2bdf19e30e2ac3a60b9e27d3/command-bot-with-sso",
    repoSHA: "d63c41b3a8ed971f2bdf19e30e2ac3a60b9e27d3",
    sha: "86d3f7aa20230350988676bcfe322a902ab6272c",
    owner: "OfficeDev",
    repo: "TeamsFx-Samples",
    keywords: [
      "command bot",
      "sso",
      "typescript",
      "Bot Framework SDK",
      "teamsfx SDK",
      "Microsoft Graph API",
    ],
  },
  {
    name: "hello-world-tab-with-backend",
    description: `Microsoft Teams supports the ability to run web-based UI inside "custom tabs" that users can install either for just themselves (personal tabs) or within a team or group chat context.

Hello World Tab with Backend shows you how to build a tab app with an Azure Function as backend, how to get user login information with SSO and how to call Azure Function from frontend tab.`,
    url: "https://github.com/OfficeDev/TeamsFx-Samples/tree/d63c41b3a8ed971f2bdf19e30e2ac3a60b9e27d3/hello-world-tab-with-backend",
    repoSHA: "d63c41b3a8ed971f2bdf19e30e2ac3a60b9e27d3",
    sha: "29a058aef834f5fcfa022221c7c8ff06b51a5bfe",
    owner: "OfficeDev",
    repo: "TeamsFx-Samples",
    keywords: ["tab app", "sso", "typescript", "azure function", "TeamsFx SDK", "react"],
  },
  {
    name: "team-central-dashboard",
    description:
      "Team Central Dashboard shows you how to build a tab with data charts and content from Microsoft Graph to accelerate team collaboration and personal productivity.",
    url: "https://github.com/OfficeDev/TeamsFx-Samples/tree/d63c41b3a8ed971f2bdf19e30e2ac3a60b9e27d3/team-central-dashboard",
    repoSHA: "d63c41b3a8ed971f2bdf19e30e2ac3a60b9e27d3",
    sha: "1020f3ebd2ce50d1c6585adebdfe282cf399e843",
    owner: "OfficeDev",
    repo: "TeamsFx-Samples",
    keywords: ["tab app", "typescript", "react", "Microsoft Graph API", "TeamsFx SDK"],
  },
  {
    name: "todo-list-SPFx",
    description: `Todo List with SPFx is a Todo List Manage tool for a group of people. This app is installed in Teams Team or Channel and hosted on SharePoint, members in the Team/Channel can collaborate on the same Todo List, manipulate the same set of Todo items. There is no requirement asking for an Azure account to deploy Azure resources to run this sample app.`,
    url: "https://github.com/OfficeDev/TeamsFx-Samples/tree/d63c41b3a8ed971f2bdf19e30e2ac3a60b9e27d3/todo-list-SPFx",
    repoSHA: "d63c41b3a8ed971f2bdf19e30e2ac3a60b9e27d3",
    sha: "08ab8ed31699750f91afc2fefacb7155fe117213",
    owner: "OfficeDev",
    repo: "TeamsFx-Samples",
    keywords: [
      "tab app",
      "typescript",
      "react",
      "SPFx",
      "webpart",
      "sharepoint framework",
      "TODO list",
    ],
  },
  {
    name: "NPM-search-message-extension-codespaces",
    description: `Search based message extensions allow you to query your service and post that information in the form of a card, right into your message. This sample allows you to perform a quick search to NPM Registry for a package and insert package details into conversations for sharing with your co-workers.
    ## This sample illustrates
- How to use Teams Toolkit build a search based message extension.
- How to use [Codespaces](https://github.com/features/codespaces) to run and preview a message extension.`,
    url: "https://github.com/OfficeDev/TeamsFx-Samples/tree/d63c41b3a8ed971f2bdf19e30e2ac3a60b9e27d3/NPM-search-message-extension-codespaces",
    repoSHA: "d63c41b3a8ed971f2bdf19e30e2ac3a60b9e27d3",
    sha: "402eaf44e8d9e8d5ceee81d9e496ed737066df61",
    owner: "OfficeDev",
    repo: "TeamsFx-Samples",
    keywords: ["message extension", "typescript", "NPM Search", "codespaces"],
  },
];

export class TeamsFxSamplesConfig {
  owner: string;
  repo: string;
  tag: string;
  configPath: string;
  constructor(owner: string, repo: string, tag: string, configPath: string) {
    this.owner = owner;
    this.repo = repo;
    this.tag = tag;
    this.configPath = configPath;
  }

  // async loadSamplesFromConfigFile(): Promise<Sample[]> {
  //   const fileUrl = `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.tag}/${this.configPath}`;
  //   const config = (await sendRequestWithRetry(async () => {
  //     return await axios.get(fileUrl);
  //   }, 2)) as unknown as any;

  //   let samples: Sample[] = [];
  //   config.samples.forEach((sample: Sample) => {});
  // }
}
