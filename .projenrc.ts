import { javascript, typescript } from 'projen';

const pnpmVersion = '9.3.0';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'export-awsiamactions',
  packageManager: javascript.NodePackageManager.PNPM,
  projenrcTs: true,
  pnpmVersion,
  deps: [
    'playwright',
    'tsx',
  ],
});

project.package.addField('packageManager', `pnpm@${pnpmVersion}`);

project.synth();
