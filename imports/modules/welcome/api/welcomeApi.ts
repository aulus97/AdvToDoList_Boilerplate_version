// region Imports
import { ProductBase } from '../../../api/productBase';
import { welcomeSch, IWelcome } from './welcomeSch';

class WelcomeApi extends ProductBase<IWelcome> {
	constructor() {
		super('welcome', welcomeSch, {
			enableCallMethodObserver: true,
			enableSubscribeObserver: true
		});
	}
}

export const welcomeApi = new WelcomeApi();
