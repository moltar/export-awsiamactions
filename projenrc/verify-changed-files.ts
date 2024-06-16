import { Component } from 'projen';
import { JobStep } from 'projen/lib/github/workflows-model';
import { TypeScriptProject } from 'projen/lib/typescript';

export interface VerifyChangedFilesOptions {
  /**
   * File/Directory names to check for  uncommited changes.
   */
  readonly files: string[];
}

export class VerifyChangedFiles extends Component implements JobStep {
  public readonly id: string;
  public readonly uses = 'tj-actions/verify-changed-files@v20';
  public readonly with: Record<string, string>;

  /**
   * List of changed files.
   */
  public readonly changedFiles: string;

  /**
   * Boolean indicating that files have changed.
   */
  public readonly filesChanged: string;

  constructor (project: TypeScriptProject, options: VerifyChangedFilesOptions) {
    super(project);

    this.id = this.node.addr;
    this.with = {
      files: options.files.join('\n'),
    };

    this.changedFiles = `steps.${this.id}.outputs.changed_files`;
    this.filesChanged = `steps.${this.id}.outputs.files_changed`;
  }
}
