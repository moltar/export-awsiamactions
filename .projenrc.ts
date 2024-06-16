import { javascript, typescript } from 'projen';
import { JobPermission, JobStep } from 'projen/lib/github/workflows-model';

const pnpmVersion = '9.3.0';

/**
 * The file where the scraped actions will be saved to.
 */
const AWS_IAM_ACTIONS_FILENAME = 'awsiamactions.json';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'export-awsiamactions',
  packageManager: javascript.NodePackageManager.PNPM,
  projenrcTs: true,
  pnpmVersion,
  buildWorkflowOptions: {
    mutableBuild: false,
    permissions: {
      contents: JobPermission.WRITE,
      pullRequests: JobPermission.WRITE,
    },
  },
  deps: [
    'json-stable-stringify',
    'playwright',
    'tsx',
  ],
  devDeps: [
    '@types/json-stable-stringify',
  ],
});

project.package.addField('packageManager', `pnpm@${pnpmVersion}`);

for (const task of [project.package.installTask, project.package.installCiTask]) {
  task.exec('npx playwright install --with-deps chromium');
}

const scrapeTask = project.addTask('scrape', {
  exec: `tsx ${project.srcdir}/index.ts ${AWS_IAM_ACTIONS_FILENAME}`,
});

const verifyChangedFiles: JobStep = {
  uses: 'tj-actions/verify-changed-files@v20',
  id: 'verify-changed-files',
  with: {
    files: AWS_IAM_ACTIONS_FILENAME,
  },
};

const createPullRequest: JobStep = {
  uses: 'peter-evans/create-pull-request@v6',
  with: {
    'add-paths': AWS_IAM_ACTIONS_FILENAME,
    'commit-message': 'chore: updates awsiamactions.json',
    'title': 'chore: updates awsiamactions.json',
    'body': 'Updates `awsiamactions.json`.',
  },
};

const $ = (exp: string) => ['${{', exp, '}}'].join(' ');

project.buildWorkflow?.addPostBuildSteps(
  {
    name: 'Scrape',
    run: project.runTaskCommand(scrapeTask),
  },
  verifyChangedFiles,
  {
    ...createPullRequest,
    if: $(`steps.${verifyChangedFiles.id}.outputs.files_changed == 'true'`),
  },
);

project.synth();
