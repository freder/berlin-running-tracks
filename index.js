const csvtojson = require('csvtojson');
const R = require('ramda');


const args = R.drop(2, process.argv);
const csvFile = R.head(args);


const prepare = R.pipe(
	// prepare data
	R.evolve({
		public: (p) => (p === 'checked'),
		'lap distance (m)': (d) => parseInt(d, 10),
		'lat lng': R.pipe(
			R.split(','), 
			R.map(R.trim)
		),
	}),

	// rename fields
	(item) => {
		return R.pipe(
			R.assoc('latLng', item['lat lng']),
			R.assoc('googleMaps', item['google maps']),
			R.assoc('lapDistance', item['lap distance (m)']),
		)(item);
	},
	R.omit([
		'lat lng',
		'google maps',
		'lap distance (m)',
	]),
);


csvtojson()
	.fromFile(csvFile)
	.then(R.map(prepare))
	.then((data) => {
		console.log(
			JSON.stringify(data, null, '\t')
		);
	});
