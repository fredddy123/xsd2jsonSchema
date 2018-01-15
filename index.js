const fs = require('fs');
const ArgumentParser = require('argparse').ArgumentParser;
const spawn = require('child_process').spawn;

const parser = new ArgumentParser({
  version: '0.0.1',
  addHelp:true,
  description: 'Argparse example'
});
parser.addArgument(
  [ '-x', '--xsd' ],
  {
    help: 'Path to the xsd file'
  }
);
parser.addArgument(
  [ '-j', '--jsonschema' ],
  {
    help: 'Name of generated JSONSchema file'
  }
);

const args = parser.parseArgs();
console.dir(args);

const {
    xsd,
    jsonschema
} = args;

// const xsdFileData = fs.readFileSync(xsd).toString();
// java --add-modules=java.xml.bind,java.activation -jar node_modules/jsonix-schema-compiler/lib/jsonix-schema-compiler-full.jar -generateJsonSchema -p PO sample.xsd
const child = spawn('java', [
    '--add-modules=java.xml.bind,java.activation',
    '-jar',
    'node_modules/jsonix-schema-compiler/lib/jsonix-schema-compiler-full.jar',
    '-generateJsonSchema',
    '-p',
    jsonschema,
    xsd
]);
