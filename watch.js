import fs from 'fs'
import path from 'path'
import handler from 'serve-handler';
import http from 'http'

import build from './build.js'

const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  return handler(request, response);
})

server.listen(3000, () => {
  console.log('Running at http://localhost:3000');
});
const __dirname = path.resolve(path.dirname('')); 

const docs_path = path.join(__dirname, 'docs');
const www_path = path.join(__dirname, 'www');

let timeout = setTimeout(() => {}, 0);

fs.watch(docs_path, {
	encoding: 'utf-8',
}, (e, filename) => {
	if (e === 'change') {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			server.close();
			console.log(` ...start re-building [${filename}]\n`)
			build(filename);
			console.log(` ...building done [${filename}]\n`)
			server.listen(3000, () => {
				console.log('Running at http://localhost:3000');
			  });
		}, 0);
	}
})
