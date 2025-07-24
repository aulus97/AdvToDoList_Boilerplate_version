import React from 'react';
import { IAppMenu } from '../../../modules/modulesTypings';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';

export const welcomeMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/welcome',
		name: 'Welcome',
		icon: <SysIcon name={'dashboard'} />
	}
];
