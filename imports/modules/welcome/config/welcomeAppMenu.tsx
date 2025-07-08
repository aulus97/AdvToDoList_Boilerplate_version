import React from 'react';
import { IAppMenu } from '/imports/modules/modulesTypings';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';

export const welcomeMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/welcome',
		name: 'Welcome',
		icon: <SysIcon name={'star'} />
	}
];
