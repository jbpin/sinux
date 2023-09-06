import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json' assert { type: 'json' };

export default [{
	input: './packages/core/src/index.ts',
	external: Object.keys(pkg.dependencies),
	output: [{
		file: './dist/core/cjs/index.js',
		format: 'cjs'
	},{
		dir: './dist/core/esm/',
		format: 'esm'
	}],
	plugins: [
		typescript({
			tsconfig: './packages/core/tsconfig.json',
		})
	]
},{
	input: './packages/react/src/index.ts',
	external: Object.keys(pkg.dependencies),
	output: [{
		file: './dist/react/cjs/index.js',
		format: 'cjs'
	},{
		dir: './dist/react/esm/',
		format: 'esm'
	}],
	plugins: [
		typescript({
			tsconfig: './packages/react/tsconfig.json',
		})
	]
}];