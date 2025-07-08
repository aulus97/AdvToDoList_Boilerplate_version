import { IAppMenu, IModuleHub, IRoute } from './modulesTypings';
import Example from './example/config';
import Welcome from './welcome/config';
import UserProfile from './userprofile/config';

const pages: Array<IRoute | null> = [
	...Example.pagesRouterList, 
	...Welcome.pagesRouterList, 
	...UserProfile.pagesRouterList
];

const menuItens: Array<IAppMenu | null> = [
	...Example.pagesMenuItemList, 
	...Welcome.pagesMenuItemList,
	...UserProfile.pagesMenuItemList
];

const Modules: IModuleHub = {
	pagesMenuItemList: menuItens,
	pagesRouterList: pages
};

export default Modules;
