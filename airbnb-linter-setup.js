const exportPkg = 'export PKG=eslint-config-airbnb';
const addLinter = `npm info "$PKG" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs yarn add --dev "$PKG"`;
const exec = require('child_process').exec;

exec(exportPkg + addLinter, (error, stdout, stderr) => {
  if (error) console.log(error);
});
