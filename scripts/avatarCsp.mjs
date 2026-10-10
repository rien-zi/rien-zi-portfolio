import { runInNewContext } from 'node:vm';
import Ajv2020 from 'ajv/dist/2020.js';
import standaloneCode from 'ajv/dist/standalone/index.js';

// The pinned renderer compiles its validator at module initialization. Compile
// the same schema during the build so browsers do not need unsafe-eval.
export function avatarCsp() {
  const virtualId = '\0portfolio-avatar-validator';
  let validator;
  return {
    name: 'portfolio-avatar-csp',
    resolveId(id) { if (id === 'portfolio-avatar-validator') return virtualId; },
    load(id) { if (id === virtualId) return validator; },
    transform(source, id) {
      if (!id.replaceAll('\\', '/').endsWith('/@bible-strong/avatar-core/dist/index.js')) return;
      const schema = source.match(/var k = ([\s\S]*?)\n}, A =/);
      const compiler = /new O\(\{\s*allErrors: !0,\s*strict: !0\s*\}\)\.compile\(k\)/;
      if (!schema || !compiler.test(source)) throw new Error('Avatar package changed: review the CSP validator build adapter.');
      const definition = runInNewContext(`(${schema[1]}\n})`);
      const ajv = new Ajv2020({ allErrors: true, strict: true, code: { source: true, esm: true } });
      validator = standaloneCode(ajv, ajv.compile(definition));
      const imports = [];
      validator = validator.replace(/require\("([^"\n]+)"\)\.default/g, (_, path) => {
        const name = `runtime${imports.length}`;
        imports.push(`import ${name} from ${JSON.stringify(path + '.js')};`);
        return name;
      });
      validator = imports.join('\n') + '\n' + validator;
      return { code: source.replace('import O from "ajv/dist/2020.js";', 'import compiledValidator from "portfolio-avatar-validator";').replace(compiler, 'compiledValidator'), map: null };
    },
  };
}
