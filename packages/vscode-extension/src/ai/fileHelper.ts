// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as vscode from "vscode";
import { FileTreeData, Progress, Uri } from "vscode";
import axios, { AxiosResponse } from "axios";
import { basename } from "path";
import { Sample } from "./samples";

function convertData(d: any[]): FileTreeData[] {
  const treeMap: { [path: string]: FileTreeData } = {};

  // Helper function to recursively build the tree
  function buildTree(path: string): FileTreeData | null {
    if (!treeMap[path]) {
      treeMap[path] = {
        label: path,
        uri: Uri.file(d.find((item) => item.path === path)?.path),
      };
    } else {
      return null;
    }

    const parent = treeMap[path];

    // Find all child paths that start with the parent path
    const childPaths = d
      .filter((item) => item.path.startsWith(path + "/"))
      .map((item) => item.path);

    for (const childPath of childPaths) {
      // Recursively build child nodes
      const childNode = buildTree(childPath);
      if (childNode) {
        parent.children ??= [];
        parent.children.push(childNode);
      }
    }

    return parent;
  }

  const root: FileTreeData[] = [];
  for (const item of d.filter((item) => !item.path.includes("/"))) {
    const rootNode = buildTree(item.path);
    if (rootNode) root.push(rootNode);
  }

  return root;
}

export async function getFileTreeData(sample: Sample): Promise<FileTreeData> {
  const treeData: FileTreeData = {
    label: sample.name,
    uri: Uri.file(""),
    children: [] as FileTreeData[],
  };

  const getTreeUrl =
    `https://api.github.com/repos/${sample.owner}/${sample.repo}/git/trees/${sample.sha}` +
    "?recursive=1";

  // fill up tree data
  const fileInfo = (
    await sendRequestWithRetry(async () => {
      return await axios.get(getTreeUrl);
    }, 2)
  ).data as any;

  treeData.children = convertData(fileInfo.tree);

  return treeData;
}

export async function sendRequestWithRetry<T>(
  requestFn: () => Promise<AxiosResponse<T>>,
  tryLimits: number
): Promise<AxiosResponse<T>> {
  const canTry = (status: number | undefined) => !status || (status >= 500 && status < 600);

  let status: number | undefined;
  let error: Error;

  for (let i = 0; i < tryLimits && canTry(status); i++) {
    try {
      const res = await requestFn();
      if (res.status === 200 || res.status === 201) {
        return res;
      } else {
        error = new Error(`HTTP Request failed: ${JSON.stringify(res)}`);
      }
      status = res.status;
    } catch (e: any) {
      error = e;
      status = e?.response?.status;
    }
  }

  error ??= new Error(`RequestWithRetry got bad tryLimits: ${tryLimits}`);
  throw error;
}

export async function writeProjectFilesToDisk(
  parentDirectory: Uri,
  treeData: FileTreeData[],
  sample: Sample
) {
  const fileUrlPrefix = `https://raw.githubusercontent.com/${sample.owner}/${sample.repo}/${sample.repoSHA}/${sample.name}`;
  for (const treeNode of treeData) {
    const diskUri = Uri.joinPath(parentDirectory, treeNode.uri.path);
    if (treeNode.children) {
      await writeProjectFilesToDisk(parentDirectory, treeNode.children, sample);
    } else {
      await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification },
        async (p: Progress<{ message?: string; increment?: number }>) => {
          p.report({ message: vscode.l10n.t("Creating file {0}", basename(diskUri.path)) });
          const file = (await sendRequestWithRetry(async () => {
            return await axios.get(fileUrlPrefix + treeNode.uri.path, {
              responseType: "arraybuffer",
            });
          }, 2)) as unknown as any;
          await vscode.workspace.fs.writeFile(diskUri, Buffer.from(file.data));
        }
      );
    }
  }
}
