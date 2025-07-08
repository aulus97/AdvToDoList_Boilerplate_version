// region Imports
import { Recurso } from '../config/recursos';
import { welcomeSch, IWelcome } from './welcomeSch';
import { ProductServerBase } from '/imports/api/productServerBase';

// endregion

class WelcomeServerApi extends ProductServerBase<IWelcome> {
	constructor() {
		super('welcome', welcomeSch, { resources: Recurso });

    const self = this;

		this.addPublication(
			'welcomeList',
			(filter = {}) => {
				return this.defaultListCollectionPublication(filter, {
					projection: { name: 1, birthday: 1, phone: 1, remember: 1, delivery: 1 }
				});
			},
		);

		this.addPublication('welcomeDetail', (filter = {}) => {
			return this.defaultDetailCollectionPublication(filter, {
				projection: { name: 1, birthday: 1, phone: 1, remember: 1, delivery: 1 }
			});
		});

		// this.addRestEndpoint(
		// 	'view',
		// 	(params, options) => {
        // //debug console.log
		// 		console.log('Params', params);
		// 		console.log('options.headers', options.headers);
		// 		return { status: 'ok' };
		// 	},
		// 	['post']
		// );

		// this.addRestEndpoint(
		// 	'view/:aniversarioId',
		// 	(params, _options) => {
		// 		console.log('Rest', params);
		// 		if (params.aniversarioId) {
		// 			return self
		// 				.defaultCollectionPublication(
		// 					{
		// 						_id: params.aniversarioId
		// 					},
		// 					{}
		// 				)
		// 				.fetch();
		// 		} else {
		// 			return { ...params };
		// 		}
		// 	},
		// 	['get']
		// );
	}
}

export const welcomeServerApi = new WelcomeServerApi();
