import ToDosContainer from '../toDosContainer';
import { Recurso } from './recursos';
import { IRoute } from '../../../modules/modulesTypings';

export const toDosRouterList: (IRoute | null)[] = [
	{
		path: '/toDos/:screenState/:toDosId',
		component: ToDosContainer,
		isProtected: false,
		resources: [Recurso.TODOS_VIEW]
	},
	{
		path: '/toDos/:screenState',
		component: ToDosContainer,
		isProtected: true,
		resources: [Recurso.TODOS_CREATE]
	},
	{
		path: '/toDos',
		component: ToDosContainer,
		isProtected: false,
		resources: [Recurso.TODOS_VIEW]
	}
];
