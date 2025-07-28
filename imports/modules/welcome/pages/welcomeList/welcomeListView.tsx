import React, { useContext } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { WelcomeListControllerContext } from './welcomeListController';
import { useNavigate } from 'react-router-dom';
import { ComplexTable } from '../../../../ui/components/ComplexTable/ComplexTable';
import DeleteDialog from '../../../../ui/appComponents/showDialog/custom/deleteDialog/deleteDialog';
import WelcomeListStyles from './welcomeListStyles';
import SysTextField from '../../../../ui/components/sysFormFields/sysTextField/sysTextField';
import { SysSelectField } from '../../../../ui/components/sysFormFields/sysSelectField/sysSelectField';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import { SysFab } from '../../../../ui/components/sysFab/sysFab';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { Chip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';

enum situationColors {
    NC = '#29b6f6', // info color from MUI palette for dark themes
    CC = '#66bb6a', // success color from MUI palette for dark themes
};

enum getStatusLabel {
    NC = 'Não Concluída',
    CC = 'Concluída',
};

const WelcomeListView = () => {
	const controller = React.useContext(WelcomeListControllerContext);
	const sysLayoutContext = useContext<IAppLayoutContext>(AppLayoutContext);
	const navigate = useNavigate();
	const { Container, LoadingContainer, SearchContainer } = WelcomeListStyles;

	//const options = [{ value: '', label: 'Nenhum' }, ...(controller.schema.type.options?.() ?? [])];

	const renderStatusChip = (params: GridRenderCellParams) => { // Use 'any' or GridRenderCellParams if imported
        const status = params.value; // The value of the 'check' field ('NC' or 'CC')
        const label = status === 'CC' ? getStatusLabel.CC : getStatusLabel.NC;
        const color = status === 'CC' ? situationColors.CC : situationColors.NC;

        return (
            <Chip
                label={label}
                variant="outlined"
                sx={{
                    borderColor: color,
                    color: color,
                    backgroundColor: 'transparent'
                }}
            />
        );
    };
	
	return (
		<Container>
			<SearchContainer sx={{ alignItems: 'center' }}>
				<Typography variant="h5">Atividades recentes</Typography>
				<SysFab
					text="Minhas Tarefas"
					startIcon={<SysIcon name={'task'} />}
					onClick={()=>navigate('/toDos')}
				/>
			</SearchContainer>
			{/* <SearchContainer>
				<SysTextField
					name="search"
					placeholder="Pesquisar por nome"
					onChange={controller.onChangeTextField}
					startAdornment={<SysIcon name={'search'} />}
				/>
				<SysSelectField
					name="Category"
					options={options}
					placeholder="Selecionar"
					onChange={controller.onChangeCategory}
				/>
			</SearchContainer> */}
			{controller.loading ? (
				<LoadingContainer>
					<CircularProgress />
					<Typography variant="body1">Aguarde, carregando informações...</Typography>
				</LoadingContainer>
			) : (
				<Box sx={{ width: '100%' }}>
					<ComplexTable
						data={controller.welcomeList}
						schema={controller.schema}
						onRowClick={(row) => navigate('/toDos/view/' + row.id)}
						renderCellModified={renderStatusChip}
						fieldsRenderCellModified={{check: true}}
					/>
				</Box>
			)}
		</Container>
	);
};

export default WelcomeListView;
