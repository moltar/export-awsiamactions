import { javascript, typescript } from 'projen';
const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'export-awsiamactions',
  packageManager: javascript.NodePackageManager.PNPM,
  projenrcTs: true,
});
project.synth();