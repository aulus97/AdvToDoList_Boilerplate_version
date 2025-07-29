import React, { useContext, useState } from 'react';
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
import { Checkbox, Chip, Divider, FormControlLabel, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { set } from 'lodash';
import FormDialog from '/imports/ui/appComponents/showDialog/custom/formDialog/formDialog';
import ToDosDetailView from '../toDosDetail/toDosDetailView';
import { IShowDialogProps } from '/imports/ui/appComponents/showDialog/showDialog';
import { ToDosModuleContext } from '../../toDosContainer';
import ToDosDetailModal from '../toDosDetail/toDosDetailModal';

enum situationColors {
    NC='#29b6f6',//info color from MUI palette for dark themes
    CC='#66bb6a',//success color from MUI palette for dark themes
};

enum getStatusLabel {
    NC='Não Concluída',
    CC='Concluída',
};

const ToDosListView = () => {
	const controller = useContext(ToDosListControllerContext);
	const sysLayoutContext = useContext<IAppLayoutContext>(AppLayoutContext);
	const navigate = useNavigate();
	const { Container, LoadingContainer, SearchContainer } = ToDosListStyles;
	const { userId } = useContext(AppLayoutContext);

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
						<List key={task._id}>
							<ListItem onClick={() => FormDialog({
								showDialog: sysLayoutContext.showDialog as (options?: IShowDialogProps) => void,
								closeDialog: sysLayoutContext.closeDialog,
								title: task.title || 'Título Desconhecido',
								form: (
									<ToDosDetailModal taskId={task._id} closeModal={sysLayoutContext.closeDialog} />
								),
								/* onSubmit: () => {
									sysLayoutContext.showNotification({
										message: 'Dados salvos!'
									}); 
								} */
							})/* navigate('/toDos/view/' + task._id) */}   
							sx={{
								cursor: 'pointer',
								display: 'flex',
								flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
								alignItems: { xs: 'flex-start', sm: 'center' },
								gap: 2,
								width: '100%',
							}}>
								
								{task.image ? 
									(<IconButton > task.image </IconButton>) 
								: (<IconButton> <SysIcon name={'task'} /> </IconButton>) }
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
								
								<Box onClick={(e) => e.stopPropagation()} 
									sx={{
										display: 'flex',
										alignSelf: { xs: 'flex-end', sm: 'center' },
										mt: { xs: 1, sm: 0 },
										gap: 1,
									}}
								>
									<Chip
										label={task.check == 'CC' ? getStatusLabel.CC : getStatusLabel.NC}
										variant="outlined"
										sx={{
											borderColor: task.check == 'CC' ? situationColors.CC: situationColors.NC,
											color: task.check == 'CC' ? situationColors.CC: situationColors.NC,
											backgroundColor: 'transparent'
										}}
										onClick={(e) => {
											//e.stopPropagation();
											if(task.createdBy == userId) {
											const updatedTask = { ...task, check: task.check === 'CC' ? 'NC' : 'CC' };
											controller.onUpdateStatus(updatedTask);}
											else {
												sysLayoutContext.showNotification({
													type: 'error',
													title: 'Operação não realizada!',
													message: 'Você não pode alterar o status de um item que não foi criado por você!'
												});}
											} }
									/>
									<IconButton edge="end" aria-label="edit" >
										<SysIcon name={'edit'} onClick={(e) => {task.createdBy == userId && navigate('/toDos/edit/' + task._id) } }/>
									</IconButton>
								
									<IconButton edge="end" aria-label="delete" >
										<DeleteIcon onClick={(e)=> { task.createdBy == userId && DeleteDialog({
											showDialog: sysLayoutContext.showDialog,
											closeDialog: sysLayoutContext.closeDialog,
											title: `Excluir dado ${task.title}`,
											message: `Tem certeza que deseja excluir o arquivo ${task.title}?`,
											onDeleteConfirm: () => {
												controller.onDeleteButtonClick(task);
												sysLayoutContext.showNotification({
													message: 'Excluído com sucesso!'
												});
											}
											})
										}}/>
									</IconButton>

								</Box>
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