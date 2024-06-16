import { javascript, typescript } from 'projen';
import { VerifyChangedFiles } from './projenrc/verify-changed-files';

const pnpmVersion = '9.3.0';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'export-awsiamactions',
  packageManager: javascript.NodePackageManager.PNPM,
  projenrcTs: true,
  pnpmVersion,
  buildWorkflowOptions: {
    mutableBuild: false,
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
  exec: `tsx ${project.srcdir}/index.ts`,
});

project.buildWorkflow?.addPostBuildSteps(
  {
    name: 'Scrape',
    run: project.runTaskCommand(scrapeTask),
  },
  new VerifyChangedFiles(project, {
    files: ['awsiamactions.json'],
  }),
);

project.synth();
