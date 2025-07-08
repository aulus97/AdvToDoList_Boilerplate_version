import WelcomeContainer from '../welcomeContainer';
import { Recurso } from './recursos';
import { IRoute } from '/imports/modules/modulesTypings';

export const welcomeRouterList: (IRoute | null)[] = [
	{
		path: '/welcome/:screenState/:welcomeId',
		component: WelcomeContainer,
		isProtected: true,
		resources: [Recurso.WELCOME_VIEW]
	},
	{
		path: '/welcome/:screenState',
		component: WelcomeContainer,
		isProtected: true,
		resources: [Recurso.WELCOME_CREATE]
	},
	{
		path: '/welcome',
		component: WelcomeContainer,
		isProtected: true,
		resources: [Recurso.WELCOME_VIEW]
	}
];
