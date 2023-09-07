import typescript from 'rollup-plugin-typescript2';
import pkgc from './package.json' assert { type: 'json' };
import {nodeResolve} from '@rollup/plugin-node-resolve';
import * as fs from "fs";
import path from "path";

const PACKAGE_NAME = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(PACKAGE_NAME, 'package.json'), 'utf-8'));

const commonjsOptions = {
  ignoreGlobal: true,
  include: /node_modules/,
}
const extensions = ['.js', '.ts', '.tsx'];

const typescriptOptions = {
  tsconfig: `${PACKAGE_NAME}/tsconfig.json`,
  declaration: true,
  declarationDir: '.',
  emitDeclarationOnly: true,
  declarationMap: true,
};

const nodeOptions = {
  extensions,
};

export default {
  input: `${PACKAGE_NAME}/src/index.ts`,
  external: [...Object.keys(pkgc.peerDependencies)||{}, 'use-sync-external-store/shim/with-selector'],
  output: [
    {
      dir: pkg.main,
      format: 'cjs'
    },
    {
      dir: pkg.module,
      format: 'esm'
    }
  ],
  plugins: [
    nodeResolve(nodeOptions),
    typescript(typescriptOptions),
  ]
}
// export default [{
// 	input: './packages/core/src/index.ts',
// 	external: Object.keys(pkg.dependencies),
// 	output: [{
// 		file: './dist/core/cjs/index.js',
// 		format: 'cjs'
// 	},{
// 		dir: './dist/core/esm/',
// 		format: 'esm'
// 	}],
// 	plugins: [
// 		typescript({
// 			tsconfig: './packages/core/tsconfig.json',
// 		})
// 	]
// },{
// 	input: './packages/react/src/index.ts',
// 	external: Object.keys(pkg.dependencies),
// 	output: [{
// 		file: './dist/react/cjs/index.js',
// 		format: 'cjs'
// 	},{
// 		dir: './dist/react/esm/',
// 		format: 'esm'
// 	}],
// 	plugins: [
// 		typescript({
// 			tsconfig: './packages/react/tsconfig.json',
// 		})
// 	]
// }];