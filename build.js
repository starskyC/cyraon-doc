import fs from 'fs/promises';
import path, { resolve } from 'path';

import hljs from 'highlight.js';
import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';

const __dirname = path.resolve(path.dirname('')); 

// TODO: finish `cyraon` highlighting
// hljs.registerLanguage('cyraon', hljs => {

// });

const md = markdownIt({
	html: true,
	highlight(str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				const langHtml = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
				return `<pre class="hljs"><code>${langHtml}</code></pre>`;
			} catch (_) { }
		}

		return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
	},
}).use(markdownItAnchor)

const docs_path = path.join(__dirname, 'docs');
const www_path = path.join(__dirname, 'www');

const build = async filename => {
	const file = path.join(docs_path, filename);
	const doc_md = await fs.readFile(file, 'utf-8');

	let doc_html = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${filename}</title>

	<link rel="stylesheet" href="./style.css">
</head>
<body>
	${md.render(doc_md)}
</body>
</html>
	`;
	// add width: 100% to <table>
	doc_html = doc_html.replace(`<table>`, `<table style="width: 100%">`);

	const html_file = path.join(www_path, path.parse(file).name + '.html');
	await fs.unlink(html_file).catch(err => {
		console.log(`[${html_file}] doesn't exist previously. Creating a new one.`);
	});
	await fs.writeFile(html_file, doc_html);
};

const buildDir = async () => {
	const docs = await fs.readdir(docs_path);
	docs.forEach(build);
}

if (process.argv.includes("build.js")) { // running this script
	console.log("running this script");
	buildDir()
}

export default build
