// region Imports
import { Recurso } from '../config/recursos';
import { toDosSch, IToDos } from './toDosSch';
import { userprofileServerApi } from '../../../modules/userprofile/api/userProfileServerApi';
import { ProductServerBase } from '../../../api/productServerBase';
import { IUserProfile } from '../../userprofile/api/userProfileSch';
import _ from 'lodash';

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
							privacy: 1,
						},
					});
			},
			async (doc: Partial<IToDos>) : Promise<Partial<IToDos & { username: string, userId: string } >> => {
				const user: IUserProfile = await userprofileServerApi.getCollectionInstance().findOneAsync(
					{ _id: doc.createdBy },
					{fields: { username: 1 , _id: 1} },
			);
				return{...doc, username: user?.username || 'Usuário Desconhecido', userId: user?._id || 'UserId not found!' };
			}
		);

		this.addTransformedPublication(
			'toDosDetail',
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
							privacy: 1,
						},
					});
			},
			async (doc: Partial<IToDos>) : Promise<Partial<IToDos & { username: string, userId: string } >> => {
				const user: IUserProfile = await userprofileServerApi.getCollectionInstance().findOneAsync(
					{ _id: doc.createdBy },
					{fields: { username: 1, _id: 1} },
			);
				return{...doc, username: user?.username || 'Usuário Desconhecido', userId: user?._id || 'UserId not found!' };
			}
		);

		this.addTransformedPublication(
					'welcomeList',
					async (filter = {}, options = {}) => {
						return this.find(filter, {
							...options,
							fields: {
								_id: 1,
								title: 1,
								description: 1,
								createdAt: 1,
								date: 1,
								check: 1,
								image: 1,
								createdBy: 1,
								privacy: 1,
							},
						});
					},
					async (doc: Partial<IToDos>) : Promise<Partial<IToDos & { username: string } >> => {
						const user: IUserProfile = await userprofileServerApi.getCollectionInstance().findOneAsync(
								{ _id: doc.createdBy },
								{fields: { username: 1 } },
					);
						return{...doc, username: user?.username || 'Usuário Desconhecido' };
					}
				);
		/* this.addPublication('toDosDetail', (filter = {}) => {
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
		}); */

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
