import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json' assert { type: 'json' };

export default {
	input: './packages/core/src/index.ts',
	external: Object.keys(pkg.dependencies),
	useTsconfigDeclarationDir: true,
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
}