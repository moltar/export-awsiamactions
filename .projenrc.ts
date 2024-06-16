import { TextFile, javascript, typescript } from 'projen';
import { JobPermission, JobStep } from 'projen/lib/github/workflows-model';

const pnpmVersion = '9.3.0';
const minNodeVersion = '20.14.0';

/**
 * The file where the scraped actions will be saved to.
 */
const AWS_IAM_ACTIONS_FILENAME = 'awsiamactions.json';

const PLAYWRIGHT_INSTALL_COMMAND =
  'npx playwright install --with-deps chromium';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'export-awsiamactions',
  packageManager: javascript.NodePackageManager.PNPM,
  projenrcTs: true,
  jest: false,
  package: false,
  depsUpgrade: false,
  pnpmVersion,
  minNodeVersion,
  prettier: true,
  prettierOptions: {
    settings: {
      singleQuote: true,
    },
  },
  buildWorkflowOptions: {
    mutableBuild: false,
    permissions: {
      contents: JobPermission.WRITE,
      pullRequests: JobPermission.WRITE,
    },
  },
  tsconfig: {
    compilerOptions: {
      lib: ['ES2023', 'DOM'],
      target: 'ES2022',
    },
  },
  deps: [
    'json-stable-stringify', //
    'playwright',
    'tsx',
  ],
  devDeps: [
    '@types/json-stable-stringify', //
  ],
});

project.package.addField('packageManager', `pnpm@${pnpmVersion}`);

for (const filename of ['.node-version', '.nvmrc']) {
  new TextFile(project, filename, {
    lines: [minNodeVersion],
  });
}

for (const task of [
  project.package.installTask,
  project.package.installCiTask,
]) {
  task.exec(PLAYWRIGHT_INSTALL_COMMAND);
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
    title: 'chore: updates awsiamactions.json',
    body: 'Updates `awsiamactions.json`.',
  },
};

const $ = (exp: string) => ['${{', exp, '}}'].join(' ');

project.buildWorkflow?.addPostBuildSteps(
  {
    name: 'Install Playwright dependencies',
    run: PLAYWRIGHT_INSTALL_COMMAND,
  },
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
