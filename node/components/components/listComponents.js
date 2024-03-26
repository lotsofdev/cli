import { __packageRootDir } from '@lotsof/sugar/path';
import { globSync as __globSync } from 'glob';
export default function listComponents(args = {}) {
    // search for "lotsof.json" files
    const lotsofFiles = __globSync(`${__packageRootDir()}/node_modules/**/lotsof.json`);
    console.log(lotsofFiles);
    return {
        packages: {},
        components: {},
    };
}
//# sourceMappingURL=listComponents.js.map