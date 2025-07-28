import { IDoc } from '../../../typings/IDoc';
import { ISchema } from '../../../typings/ISchema';

export const welcomeSch: ISchema<IWelcome> = {
	image: {
		type: String,
		label: 'Imagem',
		defaultValue: '',
		optional: true,
		isImage: true,
		defaultSize: {
			width: 300,
			height: 300
		}
	},
	title: {
		type: String,
		label: 'Nome',
		defaultValue: '',
		optional: false
	},
	description: {
		type: String,
		label: 'Descrição',
		defaultValue: '',
		optional: false
	},

	check: {
		type: String,
		label: 'Situação',
		defaultValue: 'NC',
		optional: true,
		options: () => [
			{ value: 'NC', label: 'Não Concluída' },
			{ value: 'CC', label: 'Concluída' }
		]
	},
	date: {
		type: Date,
		label: 'Data de fabricação',
		defaultValue: '',
		optional: true
	}
};

export interface IWelcome extends IDoc {
	username: string;
	image: string;
	title: string;
	description: string;
	check: string;
	date: Date;
	files: object[];
	createdBy?: string;
}
