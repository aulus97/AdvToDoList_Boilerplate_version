// region Imports
import { Recurso } from '../config/recursos';
import { toDosSch, IToDos } from './toDosSch';
import { userprofileServerApi } from '../../../modules/userprofile/api/userProfileServerApi';
import { ProductServerBase } from '../../../api/productServerBase';

// endregion

class ToDosServerApi extends ProductServerBase<IToDos> {
	constructor() {
		super('toDos', toDosSch, {
			resources: Recurso
			// saveImageToDisk: true,
		});

		const self = this;

		this.addTransformedPublication(
			'toDosList',
			(filter = {}) => {
				return this.defaultListCollectionPublication(filter, {
					projection: { title: 1, type: 1, typeMulti: 1, createdAt: 1 }
				});
			},
			async (doc: IToDos & { nomeUsuario: string }) => {
				const userProfileDoc = await userprofileServerApi.getCollectionInstance().findOneAsync({ _id: doc.createdBy });
				return { ...doc };
			}
		);

		this.addPublication('toDosDetail', (filter = {}) => {
			return this.defaultDetailCollectionPublication(filter, {
				projection: {
					contacts: 1,
					title: 1,
					description: 1,
					type: 1,
					typeMulti: 1,
					date: 1,
					files: 1,
					chip: 1,
					statusRadio: 1,
					statusToggle: 1,
					slider: 1,
					check: 1,
					address: 1
				}
			});
		});

	// 	this.addRestEndpoint(
	// 		'view',
	// 		(params, options) => {
	// 			console.log('Params', params);
	// 			console.log('options.headers', options.headers);
	// 			return { status: 'ok' };
	// 		},
	// 		['post']
	// 	);

	// 	this.addRestEndpoint(
	// 		'view/:toDosId',
	// 		(params, _options) => {
	// 			console.log('Rest', params);
	// 			if (params.toDosId) {
	// 				return self
	// 					.defaultCollectionPublication(
	// 						{
	// 							_id: params.toDosId
	// 						},
	// 						{}
	// 					)
	// 					.fetch();
	// 			} else {
	// 				return { ...params };
	// 			}
	// 		},
	// 		['get']
	// 	);
	// }
	}
}

export const toDosServerApi = new ToDosServerApi();
