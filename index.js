const fs = require('fs');
const {spawn} = require('child_process');
const ArgumentParser = require('argparse').ArgumentParser;
const schemas = require('./schemas.js');

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

const {
    xsd,
    jsonschema
} = args;

/**
 * This function will create an action file with given type name and located under filename
 * @param name
 * @param filename
 */
function createAction(name, filename) {
    const content = `module.exports.process = function() {
    // name === ${name}
};
  `;
    fs.writeFileSync(filename, content);
}

/**
 * This method should generate a schema for given type into given filename
 *
 * @param type
 * @param filename
 */
function createSchema(type, filename, generatedSchema) {
    const content = {
        type: 'object',
        title: 'Item'
    };
    content.properties = schemas(type, generatedSchema);

    fs.writeFileSync(filename, JSON.stringify(content, null, '  '));
}

(async () => {
    await new Promise(resolve => {
        const child = spawn('java', [
            '--add-modules=java.xml.bind,java.activation',
            '-jar',
            'node_modules/jsonix-schema-compiler/lib/jsonix-schema-compiler-full.jar',
            '-generateJsonSchema',
            '-p',
            jsonschema,
            xsd
        ]);

        child.on('close', resolve);
    });

    const generatedSchema = require(`./${jsonschema}.js`)[jsonschema];

    fs.unlinkSync(`./${jsonschema}.js`);
    fs.unlinkSync(`./${jsonschema}.jsonschema`);

    const propertyInfos = generatedSchema.typeInfos.reduce((pInfos, typeInfo) => {
        return [
            ...pInfos,
            ...typeInfo.propertyInfos
        ];
    }, []);

    const propertyTypes = propertyInfos.map((t) => t.name);

    const result = require('./component.template.json');

    const actions = result.actions = {};

    propertyTypes.forEach(name => {
        const capName = name.charAt(0).toUpperCase() + name.slice(1);
        const title = `Create ${capName}`;
        const main = `./generated/actions/create${capName}.js`;
        const schema = `./generated/schemas/${name}.in.json`;
        actions[name] = {
            title,
            main,
            metadata: {
                in: schema,
                out: {
                    type: 'object',
                    properties: {
                        result: {
                            type: 'boolean',
                            required: 'true'
                        }
                    }
                }
            }
        };
        createSchema(name, schema, generatedSchema);
        createAction(name, main);
    });

    fs.writeFileSync('./component.json', JSON.stringify(result, null, '  '));
})().then(process.exit, console.error);
