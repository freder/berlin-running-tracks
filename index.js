const R = require('ramda');
const Airtable = require('airtable');


const args = R.drop(2, process.argv);
const apiKey = R.head(args);


let allRecords = [];
const base = new Airtable({ apiKey }).base('appWdn4YdV4o7BEDL');
base('data')
	.select({ view: 'Grid view' })
	.eachPage(
		(records, fetchNextPage) => {
			allRecords = [...allRecords, ...records];
			fetchNextPage();
		}, 

		// done
		(err) => {
			if (err) { 
				console.error(err); 
				return; 
			}
			
			const data = R.map(
				R.pipe(
					R.prop('fields'),
					prepare,
				)
			)(allRecords);
			console.log(
				JSON.stringify(data, null, '\t')
			);
		}
	);


const prepare = R.pipe(
	// prepare data
	R.evolve({
		'lap distance (m)': (d) => parseInt(d, 10),
		'lat / lng': R.pipe(
			R.split(','), 
			R.map(R.trim)
		),
	}),

	// rename fields
	(item) => {
		return R.pipe(
			R.assoc('latLng', item['lat / lng']),
			R.assoc('googleMaps', item['google maps']),
			R.assoc('lapDistance', item['lap distance (m)']),
			R.assoc('runByFreder', item['run by freder'] || false),
			R.assoc('public', item['public'] || false),
		)(item);
	},
	R.omit([
		'lat / lng',
		'google maps',
		'lap distance (m)',
		'run by freder',
	]),
);
