// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { FileTreeData } from "vscode";
import { samples } from "./samples";
import { getFileTreeData } from "./fileHelper";

export async function sampleMatchHandler(args: string): Promise<[FileTreeData, any]> {
  const params = JSON.parse(args);
  const name = params.name;
  const owner = params.owner;
  const repo = params.repo;
  const sample = samples.find((s) => s.name === name && s.owner === owner && s.repo === repo);
  let tree: FileTreeData = {} as FileTreeData;
  if (sample) {
    tree = await getFileTreeData(sample);
  }
  return [tree, sample];
}
