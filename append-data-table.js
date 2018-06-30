const fs = require('fs');
const R = require('ramda');
const data = require('./dist/berlin-running-tracks.json');


const cols = [
	{ 
		label: 'name',
		format: R.prop('name'),
	},
	{ 
		label: 'coords',
		format: (item) => `[${item.latLng.join(', ')}](${item.googleMaps})`,
	},
	{ 
		label: 'distance',
		format: (item) => `${item.lapDistance}m`,
	},
	{ 
		label: 'is public',
		format: (item) => (!item.public) ? '' : '✔',
	},
	{ 
		label: 'freder did run on it',
		format: (item) => (!item.runByFreder) ? '' : '✔',
	},
];

let header = [
	R.pipe(
		R.map(R.prop('label')),
		R.join(' | '),
		(a) => `| ${a} |`,
	)(cols),
	R.pipe(
		R.map(R.always('---')),
		R.join(' | '),
		(a) => `| ${a} |`,
	)(cols)
];
const rows = data.map((item) => {
	const row = R.pipe(
		R.map(R.prop('format')),
		R.map((fn) => fn(item)),
		R.join(' | '),
	)(cols);
	return `| ${row} |`;
});
const table = [
	'',
	...header,
	...rows,
	'',
].join('\n');

const readme = fs.readFileSync('./readme.md').toString();
const sections = readme.split(/\n---\n/ig);
const updatedReadme = [
	...R.init(sections),
	table
].join('\n---\n')
fs.writeFileSync('./readme.md', updatedReadme);
