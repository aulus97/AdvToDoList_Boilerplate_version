// region Imports
import { Recurso } from '../config/recursos';
import { welcomeSch, IWelcome } from './welcomeSch';
import { userprofileServerApi } from '../../../modules/userprofile/api/userProfileServerApi';
import { ProductServerBase } from '../../../api/productServerBase';
import { IUserProfile } from '../../userprofile/api/userProfileSch';

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
			async (filter = {}, options = {}) => {
				return this.find(filter, {
					...options,
					fields: {
						title: 1,
						description: 1,
						createdAt: 1,
						date: 1,
						check: 1,
						image: 1,
						createdBy: 1,
					},
				});
			},
			async (doc: Partial<IWelcome>) : Promise<Partial<IWelcome & { username: string } >> => {
				const user: IUserProfile = await userprofileServerApi.getCollectionInstance().findOneAsync(
						{ _id: doc.createdBy },
						{fields: { username: 1 } },
			);
				return{...doc, username: user?.username || 'Usuário Desconhecido' };
			}
		);

		this.addTransformedPublication(
			'welcomeDetail', 
			async (filter = {}) => {
				return this.find(
					filter, 
					{
						fields: {
							title: 1,
							description: 1,
							createdAt: 1,
							date: 1,
							check: 1,
							image: 1,
							createdBy: 1,
						},
					});
			},
			async (doc: Partial<IWelcome> & { username: string }) : Promise<Partial<IWelcome  >> => {
				const user: IUserProfile = await userprofileServerApi.getCollectionInstance().findOneAsync(
					{ _id: doc.createdBy },
					{fields: { username: 1 } },
			);
				return{...doc, username: user?.username || 'Usuário Desconhecido' };
			}
		);


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
