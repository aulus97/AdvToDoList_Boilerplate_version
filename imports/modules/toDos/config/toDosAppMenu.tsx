import React from 'react';
import { IAppMenu } from '../../../modules/modulesTypings';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';

export const toDosMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/toDos',
		name: 'ToDos',
		icon: <SysIcon name={'task'} />
	}
];
