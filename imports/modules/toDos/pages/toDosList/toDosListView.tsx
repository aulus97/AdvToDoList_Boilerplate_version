import React, { useContext } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { ToDosListControllerContext } from './toDosListController';
import { useNavigate } from 'react-router-dom';
import { ComplexTable } from '../../../../ui/components/ComplexTable/ComplexTable';
import DeleteDialog from '../../../../ui/appComponents/showDialog/custom/deleteDialog/deleteDialog';
import ToDosListStyles from './toDosListStyles';
import SysTextField from '../../../../ui/components/sysFormFields/sysTextField/sysTextField';
import { SysSelectField } from '../../../../ui/components/sysFormFields/sysSelectField/sysSelectField';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import { SysFab } from '../../../../ui/components/sysFab/sysFab';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { Checkbox, Divider, FormControlLabel, IconButton, List, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ToDosListView = () => {
	const controller = React.useContext(ToDosListControllerContext);
	const sysLayoutContext = useContext<IAppLayoutContext>(AppLayoutContext);
	const navigate = useNavigate();
	const { Container, LoadingContainer, SearchContainer } = ToDosListStyles;

	//const options = [{ value: '', label: 'Nenhum' }, ...(controller.schema.type.options?.() ?? [])];

	return (
		<Container>
			<Typography variant="h5">Lista de Itens</Typography>
			<SearchContainer>
				<SysTextField
					name="search"
					placeholder="Pesquisar por nome"
					onChange={controller.onChangeTextField}
					startAdornment={<SysIcon name={'search'} />}
				/>
				{/* <SysSelectField
					name="Category"
					label="Categoria"
					options={options}
					placeholder="Selecionar"
					onChange={controller.onChangeCategory}
				/> */}
			</SearchContainer>
			{controller.loading ? (
				<LoadingContainer>
					<CircularProgress />
					<Typography variant="body1">Aguarde, carregando informações...</Typography>
				</LoadingContainer>
			) : (
				<Box sx={{ width: '100%' }}>
					{controller.todoList.map((task) => (
						<List>
							<ListItem onClick={() => navigate('/toDos/view/' + task._id)} key={task._id} 
							sx={{
								cursor: 'pointer',
								display: 'flex',
								flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
								alignItems: { xs: 'flex-start', sm: 'center' },
								gap: 2,
								width: '100%',
							}}>
								<FormControlLabel
									control={
										<Checkbox
										//checked={!!controller.todoList.check}
										//onChange={() => onCheckboxClick(task)}
										/>
									}
									label=""
								/>
								{task.image ? 
									<IconButton > task.image </IconButton> 
								: <IconButton> <SysIcon name={'task'} /> </IconButton>}
								<Typography variant="h6" component="div" noWrap 
									sx={{
										width: { xs: '100%', sm: '20%' },
										flexShrink: 0,
									}}
								>
									{task?.title || 'Título Desconhecido'}
								</Typography>
								<Box sx={{width: { xs: '100%', sm: '60%' },overflowWrap: 'break-word',wordBreak: 'break-word',}}>
									<ListItemText
										primary={task?.description || 'Descrição Desconhecida'}
										secondary={'by: ' + (task?.username || 'Usuário Desconhecido')}
										primaryTypographyProps={{ noWrap: false }}
										secondaryTypographyProps={{ noWrap: false }}
									/>
								</Box>
								<IconButton edge="end" aria-label="delete"
									sx={{
										alignSelf: { xs: 'flex-end', sm: 'center' },
										mt: { xs: 1, sm: 0 },
									}}
								>
									<DeleteIcon />
								</IconButton>
							</ListItem>
						</List>
					))}
				</Box>
			)}

			<SysFab
				variant="extended"
				text="Adicionar"
				startIcon={<SysIcon name={'add'} />}
				fixed={true}
				onClick={controller.onAddButtonClick}
			/>
		</Container>
	);
};

export default ToDosListView;
/* 
<ComplexTable
						data={controller.todoList}
						schema={controller.schema}
						onRowClick={(row) => navigate('/toDos/view/' + row.id)}
						searchPlaceholder={'Pesquisar exemplo'}
						onEdit={(row) => navigate('/toDos/edit/' + row._id)}
						onDelete={(row) => {
							DeleteDialog({
								showDialog: sysLayoutContext.showDialog,
								closeDialog: sysLayoutContext.closeDialog,
								title: `Excluir dado ${row.title}`,
								message: `Tem certeza que deseja excluir o arquivo ${row.title}?`,
								onDeleteConfirm: () => {
									controller.onDeleteButtonClick(row);
									sysLayoutContext.showNotification({
										message: 'Excluído com sucesso!'
									});
								}
							});
						}}
					/>
*/