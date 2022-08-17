const pluginName = 'ReplaceInSrcWebpackPlugin';
const path = require('path');
const fs = require('fs');

class ReplaceInSrcWebpackPlugin {
	constructor(options) {
		if (typeof options !== 'object') {
			throw new Error('"options" must be an object.');
		}

		this.options = options;
		this.apply = this.apply.bind(this);
	}

	apply(compiler) {
		compiler.hooks.done.tap(pluginName, () => {
			const output = compiler.outputPath;

			this.options.forEach(option => {
				const dir = option.dir || output;

				if (option.files) {
					const files = option.files;
					if (Array.isArray(files) && files.length) {
						files.forEach(file => {
							this.replace(path.resolve(dir, file), option.rules);
						})
					}
				} else if (option.test) {
					const test = option.test;
					const testArray = Array.isArray(test) ? test : [test];
					const files = this.getAllFiles(dir);

					files.forEach(file => {
						const match = testArray.some(test => {
							return test.test(file);
						})

						if (!match) {
							return;
						}

						this.replace(file, option.rules);
					})
				} else {
					const files = this.getAllFiles(dir);
					files.forEach(file => {
						this.replace(file, option.rules);
					});
				}
			});
		});
	}

	getAllFiles(dir) {
		const files = fs.readdirSync(dir);
		let res = [];

		files.forEach(file => {
			const pathname = dir + '/' + file,
				stat = fs.lstatSync(pathname);

			if (!stat.isDirectory()) {
				res.push(pathname);
			} else {
				res = res.concat(getAllFiles(pathname));
			}
		});

		return res
	}

	replace(file, rules) {
		const src = path.resolve(file);
		let template = fs.readFileSync(src, 'utf8');

		template = rules.reduce(
			(template, rule) => template.replace(
				rule.search,
				(typeof rule.replace === 'string'
					? rule.replace
					: rule.replace.bind({ file: path.basename(file) }))
			),
			template
		);

		fs.writeFileSync(src, template);
	}
}

module.exports = ReplaceInSrcWebpackPlugin;
