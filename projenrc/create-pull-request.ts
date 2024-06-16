import { Component } from 'projen';
import { JobStep } from 'projen/lib/github/workflows-model';
import { TypeScriptProject } from 'projen/lib/typescript';

export interface VerifyChangedFilesOptions {
  /**
   * A list of file paths to commit. Paths should follow git's
   * [pathspec](https://git-scm.com/docs/gitglossary#Documentation/gitglossary.txt-aiddefpathspecapathspec)
   * syntax.
   *
   * If no paths are specified, all new and modified files are added. See Add specific paths.
   */
  readonly addPaths?: string[];

  /**
   * The message to use when committing changes.
   */
  readonly commitMessage?: string;

  /**
   * The title of the pull request.
   */
  readonly title?: string;

  /**
   * The body of the pull request.
   */
  readonly body?: string;
}

export class CreatePullRequest extends Component implements JobStep {
  public readonly id: string;
  public readonly uses = 'peter-evans/create-pull-request@v6';
  public readonly with: Record<string, string | undefined>;

  /**
   * The pull request number.
   */
  public readonly pullRequestNumber: string;

  /**
   * The URL of the pull request.
   */
  public readonly pullRequestUrl: string;

  /**
   * The pull request operation performed by the action, `created`, `updated` or `closed`.
   */
  public readonly pullRequestOperation: string;

  /**
   * The commit SHA of the pull request branch.
   */
  public readonly pullRequestHeadSha: string;

  constructor (project: TypeScriptProject, options: VerifyChangedFilesOptions) {
    super(project);

    this.id = this.node.addr;
    this.with = {
      'add-paths': options.addPaths?.join('\n'),
      'commit-message': options.commitMessage,
      'title': options.title,
      'body': options.body,
    };

    this.pullRequestNumber = `steps.${this.id}.outputs.pull-request-number`;
    this.pullRequestUrl = `steps.${this.id}.outputs.pull-request-url`;
    this.pullRequestOperation = `steps.${this.id}.outputs.pull-request-operation`;
    this.pullRequestHeadSha = `steps.${this.id}.outputs.pull-request-head-sha`;
  }
}
