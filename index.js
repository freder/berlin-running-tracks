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


const renameKeys = (oldNewKeys, obj) => {
	return R.pipe(
		R.reduce(
			(acc, [oldKey, newKey]) => R.assoc(newKey, acc[oldKey], acc),
			R.__,
			oldNewKeys
		),
		R.omit(
			oldNewKeys.map(R.head)
		),
	)(obj);
};


const prepare = R.pipe(
	// rename fields
	(item) => renameKeys(
		[
			['lat / lng', 'latLng'],
			['google maps', 'googleMaps'],
			['lap distance (m)', 'lapDistance'],
			['run by freder', 'runByFreder'],
		],
		item
	),

	// prepare data
	(item) => R.pipe(
		R.assoc('runByFreder', item.runByFreder || false),
		R.assoc('public', item.public || false),
	)(item),
	R.evolve({
		lapDistance: (d) => parseInt(d, 10),
		latLng: R.pipe(
			R.split(','), 
			R.map(R.trim)
		),
	}),
);
