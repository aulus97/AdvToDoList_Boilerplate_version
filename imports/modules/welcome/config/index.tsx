import { welcomeRouterList } from './welcomeRouters';
import { welcomeMenuItemList } from './welcomeAppMenu';
import { IModuleHub } from '../../modulesTypings';

const Welcome: IModuleHub = {
	pagesRouterList: welcomeRouterList,
	pagesMenuItemList: welcomeMenuItemList
};

export default Welcome;
