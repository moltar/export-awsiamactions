import { javascript, typescript } from 'projen';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'export-awsiamactions',
  packageManager: javascript.NodePackageManager.PNPM,
  projenrcTs: true,
  pnpmVersion: '9.3.0',
});

project.synth();
