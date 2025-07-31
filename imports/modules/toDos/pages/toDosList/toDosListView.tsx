	import React, { useContext, useState } from 'react';
	import Typography from '@mui/material/Typography';
	import Box from '@mui/material/Box';
	import CircularProgress from '@mui/material/CircularProgress';
	import { ToDosListControllerContext } from './toDosListController';
	import { useNavigate } from 'react-router-dom';
	import DeleteDialog from '../../../../ui/appComponents/showDialog/custom/deleteDialog/deleteDialog';
	import ToDosListStyles from './toDosListStyles';
	import SysTextField from '../../../../ui/components/sysFormFields/sysTextField/sysTextField';
	import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
	import { SysFab } from '../../../../ui/components/sysFab/sysFab';
	import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
	import {
	Chip,
	IconButton,
	List,
	ListItem,
	ListItemText,
	TablePagination
	} from '@mui/material';
	import DeleteIcon from '@mui/icons-material/Delete';
	import FormDialog from '/imports/ui/appComponents/showDialog/custom/formDialog/formDialog';
	import ToDosDetailModal from '../toDosDetail/toDosDetailModal';
	import { IShowDialogProps } from '/imports/ui/appComponents/showDialog/showDialog';

	const situationColors = {
	NC: '#29b6f6',
	CC: '#66bb6a'
	};

	const getStatusLabel = {
	NC: 'Não Concluída',
	CC: 'Concluída'
	};

	const privacyColors = {
	PRIVATE: '#c62828',
	PUBLIC: '#66bb6a'
	};

	const getPrivacyLabel = {
	PRIVATE: 'Privado',
	PUBLIC: 'Público'
	};

	const ToDosListView = () => {
	const controller = useContext(ToDosListControllerContext);
	const sysLayoutContext = useContext<IAppLayoutContext>(AppLayoutContext);
	const navigate = useNavigate();
	const { Container, LoadingContainer, SearchContainer } = ToDosListStyles;
	const { userId } = useContext(AppLayoutContext);

	return (
		<Container>
		<Typography variant="h5">Lista de Itens</Typography>
		<SearchContainer>
			<SysTextField
			name="search"
			placeholder="Pesquisar por palavra na descrição"
			onChange={controller.onChangeTextField}
			startAdornment={<SysIcon name={'search'} />}
			/>
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
				<ListItem
					onClick={() =>
					FormDialog({
						showDialog: sysLayoutContext.showDialog as (options?: IShowDialogProps) => void,
						closeDialog: sysLayoutContext.closeDialog,
						title: task.title || 'Título Desconhecido',
						form: <ToDosDetailModal taskId={task._id} closeModal={sysLayoutContext.closeDialog} />,
						hideDefaultActions: false
					})
					}
					sx={{
					cursor: 'pointer',
					display: 'flex',
					flexDirection: { xs: 'column', sm: 'row' },
					alignItems: { xs: 'flex-start', sm: 'center' },
					gap: 2,
					width: '100%'
					}}
				>
					<IconButton>
					{task.check === 'CC' ? (
						<SysIcon name={'checkCircle'} color='success' />
					) : (
						<SysIcon name={'task'} color='warning' />
					)}
					</IconButton>

					<Typography
					variant="h6"
					component="div"
					noWrap
					sx={{ width: { xs: '100%', sm: '20%' }, flexShrink: 0 }}
					>
					{task?.title || 'Título Desconhecido'}
					</Typography>

					<Box sx={{ width: { xs: '100%', sm: '60%' }, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
					<ListItemText
						primary={task?.description || 'Descrição Desconhecida'}
						secondary={'by: ' + (task?.username || 'Usuário Desconhecido')}
						primaryTypographyProps={{ noWrap: false }}
						secondaryTypographyProps={{ noWrap: false }}
					/>
					</Box>

					<Box
					onClick={(e) => e.stopPropagation()}
					sx={{
						display: 'flex',
						alignSelf: { xs: 'flex-end', sm: 'center' },
						mt: { xs: 1, sm: 0 },
						gap: 1
					}}
					>
					<Chip
						label={task.privacy === 'PRIVATE' ? getPrivacyLabel.PRIVATE : getPrivacyLabel.PUBLIC}
						variant="outlined"
						sx={{
						borderColor: task.privacy === 'PRIVATE' ? privacyColors.PRIVATE : privacyColors.PUBLIC,
						color: task.privacy === 'PRIVATE' ? privacyColors.PRIVATE : privacyColors.PUBLIC,
						backgroundColor: 'transparent'
						}}
					/>

					<Chip
						label={task.check === 'CC' ? getStatusLabel.CC : getStatusLabel.NC}
						variant="outlined"
						sx={{
						borderColor: task.check === 'CC' ? situationColors.CC : situationColors.NC,
						color: task.check === 'CC' ? situationColors.CC : situationColors.NC,
						backgroundColor: 'transparent'
						}}
						onClick={() => {
						if (task.createdBy === userId) {
							const updatedTask = { ...task, check: task.check === 'CC' ? 'NC' : 'CC' };
							controller.onUpdateStatus(updatedTask);
						} else {
							sysLayoutContext.showNotification({
							type: 'error',
							title: 'Operação não realizada!',
							message: 'Você não pode alterar o status de um item que não foi criado por você!'
							});
						}
						}}
					/>

					<IconButton edge="end" aria-label="edit">
						<SysIcon
						name={'edit'}
						onClick={() => task.createdBy === userId && navigate('/toDos/edit/' + task._id)}
						/>
					</IconButton>

					<IconButton edge="end" aria-label="delete">
						<DeleteIcon
						onClick={() => {
							if (task.createdBy === userId) {
							DeleteDialog({
								showDialog: sysLayoutContext.showDialog,
								closeDialog: sysLayoutContext.closeDialog,
								title: `Excluir dado ${task.title}`,
								message: `Tem certeza que deseja excluir o arquivo ${task.title}?`,
								onDeleteConfirm: () => {
								controller.onDeleteButtonClick(task);
								sysLayoutContext.showNotification({ message: 'Excluído com sucesso!' });
								}
							});
							}
						}}
						/>
					</IconButton>
					</Box>
				</ListItem>
				</List>
			))}
			</Box>
		)}

		<Box
			component="footer" 
			sx={{ position: 'fixed', bottom: 0, left: 0, right: 0,
				width: '100%',
				backgroundColor: 'background.paper',
				borderTop: '1px solid #ccc',
				zIndex: 10
			}}
		>
			<TablePagination
			component="div"
			labelRowsPerPage="Itens por página"
			labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
			count={typeof controller.totalCount === 'number' ? controller.totalCount : 0}
			page={controller.currentPage - 1}
			onPageChange={(event, newPage) => controller.onPageChange(newPage + 1)}
			rowsPerPage={controller.pageSize}
			onRowsPerPageChange={(event) => controller.onPageSizeChange(parseInt(event.target.value, 10))}
			rowsPerPageOptions={[4]}
			sx={{
				minWidth: 300,
				'.MuiTablePagination-toolbar': {
				flexDirection: { xs: 'column', sm: 'row' },
				flexWrap: 'wrap',
				alignItems: { xs: 'flex-start', sm: 'center' },
				gap: 1,
				padding: 1
				},
				'.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
				fontSize: '0.75rem'
				},
				'.MuiInputBase-root': {
				fontSize: '0.75rem'
				}
			}}
			/>
		</Box>

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
import React, { useContext, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { ToDosListControllerContext } from './toDosListController';
import { useNavigate } from 'react-router-dom';
import DeleteDialog from '../../../../ui/appComponents/showDialog/custom/deleteDialog/deleteDialog';
import ToDosListStyles from './toDosListStyles';
import SysTextField from '../../../../ui/components/sysFormFields/sysTextField/sysTextField';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import { SysFab } from '../../../../ui/components/sysFab/sysFab';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import {
	Chip,
	IconButton,
	List,
	ListItem,
	ListItemText,
	TablePagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FormDialog from '/imports/ui/appComponents/showDialog/custom/formDialog/formDialog';
import ToDosDetailModal from '../toDosDetail/toDosDetailModal';
import { IShowDialogProps } from '/imports/ui/appComponents/showDialog/showDialog';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions';

const situationColors = {
NC: '#29b6f6',
CC: '#66bb6a'
};

const getStatusLabel = {
NC: 'Não Concluída',
CC: 'Concluída'
};

const privacyColors = {
PRIVATE: '#c62828',
PUBLIC: '#66bb6a'
};

const getPrivacyLabel = {
PRIVATE: 'Privado',
PUBLIC: 'Público'
};

function SimplePaginationActions(props: TablePaginationActionsProps) {
	const { count, page, rowsPerPage, onPageChange } = props;
	const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);

	return (
		<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
		<IconButton
			onClick={(e) => onPageChange(e, 0)}
			disabled={page === 0}
			size="small"
			aria-label="first page"
		>
			<FirstPageIcon fontSize="small" />
		</IconButton>
		<IconButton
			onClick={(e) => onPageChange(e, page - 1)}
			disabled={page === 0}
			size="small"
			aria-label="previous page"
		>
			<KeyboardArrowLeft fontSize="small" />
		</IconButton>
		<IconButton
			onClick={(e) => onPageChange(e, page + 1)}
			disabled={page >= lastPage}
			size="small"
			aria-label="next page"
		>
			<KeyboardArrowRight fontSize="small" />
		</IconButton>
		<IconButton
			onClick={(e) => onPageChange(e, lastPage)}
			disabled={page >= lastPage}
			size="small"
			aria-label="last page"
		>
			<LastPageIcon fontSize="small" />
		</IconButton>
		</Box>
	);
}
const ToDosListView = () => {
const controller = useContext(ToDosListControllerContext);
const sysLayoutContext = useContext<IAppLayoutContext>(AppLayoutContext);
const navigate = useNavigate();
const { Container, LoadingContainer, SearchContainer } = ToDosListStyles;
const { userId } = useContext(AppLayoutContext);
const theme = useTheme();
const isXs = useMediaQuery(theme.breakpoints.down('sm'));

return (
	<Container>
	<Typography variant="h5">Lista de Itens</Typography>
	<SearchContainer>
		<SysTextField
		name="search"
		placeholder="Pesquisar por palavra na descrição"
		onChange={controller.onChangeTextField}
		startAdornment={<SysIcon name={'search'} />}
		/>
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
			<ListItem
				onClick={() =>
				FormDialog({
					showDialog: sysLayoutContext.showDialog as (options?: IShowDialogProps) => void,
					closeDialog: sysLayoutContext.closeDialog,
					title: task.title || 'Título Desconhecido',
					form: <ToDosDetailModal taskId={task._id} closeModal={sysLayoutContext.closeDialog} />
				})
				}
				sx={{
				cursor: 'pointer',
				display: 'flex',
				flexDirection: { xs: 'column', sm: 'row' },
				alignItems: { xs: 'flex-start', sm: 'center' },
				gap: 2,
				width: '100%'
				}}
			>
				<IconButton>
				{task.check === 'CC' ? (
					<SysIcon name={'checkCircle'} color='success' />
				) : (
					<SysIcon name={'task'} color='warning' />
				)}
				</IconButton>

				<Typography
				variant="h6"
				component="div"
				noWrap
				sx={{ width: { xs: '100%', sm: '20%' }, flexShrink: 0 }}
				>
				{task?.title || 'Título Desconhecido'}
				</Typography>

				<Box sx={{ width: { xs: '100%', sm: '60%' }, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
				<ListItemText
					primary={task?.description || 'Descrição Desconhecida'}
					secondary={'by: ' + (task?.username || 'Usuário Desconhecido')}
					primaryTypographyProps={{ noWrap: false }}
					secondaryTypographyProps={{ noWrap: false }}
				/>
				</Box>

				<Box
				onClick={(e) => e.stopPropagation()}
				sx={{
					display: 'flex',
					alignSelf: { xs: 'flex-end', sm: 'center' },
					mt: { xs: 1, sm: 0 },
					gap: 1
				}}
				>
				<Chip
					label={task.privacy === 'PRIVATE' ? getPrivacyLabel.PRIVATE : getPrivacyLabel.PUBLIC}
					variant="outlined"
					sx={{
					borderColor: task.privacy === 'PRIVATE' ? privacyColors.PRIVATE : privacyColors.PUBLIC,
					color: task.privacy === 'PRIVATE' ? privacyColors.PRIVATE : privacyColors.PUBLIC,
					backgroundColor: 'transparent'
					}}
				/>

				<Chip
					label={task.check === 'CC' ? getStatusLabel.CC : getStatusLabel.NC}
					variant="outlined"
					sx={{
					borderColor: task.check === 'CC' ? situationColors.CC : situationColors.NC,
					color: task.check === 'CC' ? situationColors.CC : situationColors.NC,
					backgroundColor: 'transparent'
					}}
					onClick={() => {
					if (task.createdBy === userId) {
						const updatedTask = { ...task, check: task.check === 'CC' ? 'NC' : 'CC' };
						controller.onUpdateStatus(updatedTask);
					} else {
						sysLayoutContext.showNotification({
						type: 'error',
						title: 'Operação não realizada!',
						message: 'Você não pode alterar o status de um item que não foi criado por você!'
						});
					}
					}}
				/>

				<IconButton edge="end" aria-label="edit">
					<SysIcon
					name={'edit'}
					onClick={() => task.createdBy === userId && navigate('/toDos/edit/' + task._id)}
					/>
				</IconButton>

				<IconButton edge="end" aria-label="delete">
					<DeleteIcon
					onClick={() => {
						if (task.createdBy === userId) {
						DeleteDialog({
							showDialog: sysLayoutContext.showDialog,
							closeDialog: sysLayoutContext.closeDialog,
							title: `Excluir dado ${task.title}`,
							message: `Tem certeza que deseja excluir o arquivo ${task.title}?`,
							onDeleteConfirm: () => {
							controller.onDeleteButtonClick(task);
							sysLayoutContext.showNotification({ message: 'Excluído com sucesso!' });
							}
						});
						}
					}}
					/>
				</IconButton>
				</Box>
			</ListItem>
			</List>
		))}
		</Box>
	)}

	<Box 
		sx={{ width: '100%', borderTop: '1px solid #ccc', pt: 1 }}>
			<TablePagination
				component="footer"
				count={controller.totalCount}
				page={controller.currentPage - 1}
				rowsPerPage={controller.pageSize}
				rowsPerPageOptions={[4]}
				onPageChange={(_, newPage) => controller.onPageChange(newPage + 1)}
				onRowsPerPageChange={(e) =>
					controller.onPageSizeChange(parseInt(e.target.value, 10))
				}
				labelRowsPerPage="Itens por página"
				labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
				ActionsComponent={isXs ? SimplePaginationActions : undefined}
				sx={{
					'.MuiTablePagination-toolbar': {
					justifyContent: isXs ? 'center' : 'space-between'
					}
				}}
			/>
	</Box>

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
*/