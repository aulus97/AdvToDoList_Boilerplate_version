// region Imports
import { Recurso } from '../config/recursos';
import { welcomeSch, IWelcome } from './welcomeSch';
import { userprofileServerApi } from '../../../modules/userprofile/api/userProfileServerApi';
import { ProductServerBase } from '../../../api/productServerBase';

// endregion

class WelcomeServerApi extends ProductServerBase<IWelcome> {
	constructor() {
		super('welcome', welcomeSch, {
			resources: Recurso
			// saveImageToDisk: true,
		});

		const self = this;

		this.addTransformedPublication(
			'welcomeList',
			(filter = {}) => {
				return this.defaultListCollectionPublication(filter, {
					projection: { title: 1, type: 1, typeMulti: 1, createdAt: 1 }
				});
			},
			async (doc: IWelcome & { nomeUsuario: string }) => {
				const userProfileDoc = await userprofileServerApi.getCollectionInstance().findOneAsync({ _id: doc.createdBy });
				return { ...doc };
			}
		);

		this.addPublication('welcomeDetail', (filter = {}) => {
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
	// 		'view/:welcomeId',
	// 		(params, _options) => {
	// 			console.log('Rest', params);
	// 			if (params.welcomeId) {
	// 				return self
	// 					.defaultCollectionPublication(
	// 						{
	// 							_id: params.welcomeId
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

export const welcomeServerApi = new WelcomeServerApi();
