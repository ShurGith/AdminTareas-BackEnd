import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { projectExist } from '../middleware/project';
import { hasAthorization, taskBelongsToProject, taskExist } from '../middleware/task';
import { taskStatusEnum } from '../models/Task';
import { authenticate } from '../middleware/auth';
import { TeamMemberController } from '../controllers/TeamController';
import { NoteController } from '../controllers/NoteController';

export const router = Router();

router.use(authenticate);

router.post('/',
  body('projectName')
    .isLength({ min: 3 })
    .withMessage('El nombre del proyecto debe tener al menos tres caracteres.'),
  body('clientName')
    .isLength({ min: 3 })
    .withMessage('El nombre del cliente debe tener al menos tres caracteres.'),
  body('description')
    .isLength({ min: 3 })
    .withMessage('La descripción debe tener al menos tres caracteres.'),
  handleInputErrors,
  ProjectController.createProject
)

router.get('/', ProjectController.getAllProjects)

router.get('/:id',
  param('id').isMongoId().withMessage('ID inválido'),
  handleInputErrors,
  ProjectController.getProjectById)

router.put('/:id',
  param('id').isMongoId().withMessage('ID inválido'), body('projectName')
    .isLength({ min: 3 })
    .withMessage('El nombre del proyecto debe tener al menos tres caracteres.'),
  body('clientName')
    .isLength({ min: 3 })
    .withMessage('El nombre del cliente debe tener al menos tres caracteres.'),
  body('description')
    .isLength({ min: 3 })
    .withMessage('La descripción debe tener al menos tres caracteres.'),
  handleInputErrors,
  ProjectController.updateProject
)
router.delete('/:id',
  param('id').isMongoId().withMessage('ID inválido'),
  handleInputErrors,
  ProjectController.deleteProject)

//& ** Tasks routes **//
router.param('projectId', projectExist);
router.param('taskId', taskExist);
router.param('taskId', taskBelongsToProject);
 //** Se ejecuta antes que cualquier ruta con taskId.
//*** De esta manera se comprueba si la tarea existe y pertenece a un proyecto y no es necesario repetirlo en cada ruta.
//** Se ejecuta antes que cualquier ruta con projectId.
//*** De esta manera se comprueba si el proyecto existe y no es necesario repetirlo en cada ruta.
//** Se ejecuta antes que cualquier ruta con projectId. 
//*** De esta manera se comprueba si el proyecto existe y no es necesario repetirlo en cada ruta.

router.post('/:projectId/tasks', 
  hasAthorization,
  body('name')
    .isLength({ min: 3 })
    .withMessage('El nombre de la tarea debe tener al menos tres caracteres.'),
  body('description')
    .isLength({ min: 3 })
    .withMessage('La descripción debe tener al menos tres caracteres.'),
  handleInputErrors,
  TaskController.createTask
)

router.get('/:projectId/tasks',
  TaskController.getProjectTasks
)

router.get('/:projectId/tasks/:taskId',
  param('projectId').isMongoId().withMessage('ID del proyecto no válido'),
  param('taskId').isMongoId().withMessage('ID de la taréa no válido'),
  handleInputErrors,
  TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
  hasAthorization,
  param('projectId').isMongoId().withMessage('ID del proyecto no válido'),
  param('taskId').isMongoId().withMessage('ID de la taréa no válido'),
  body('name')
    .isLength({ min: 3 })
    .withMessage('El nombre de la tarea debe tener al menos tres caracteres.'),
  body('description')
    .isLength({ min: 3 })
    .withMessage('La descripción debe tener al menos tres caracteres.'),
  handleInputErrors,
  TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
  hasAthorization,
  param('projectId').isMongoId().withMessage('ID del proyecto no válido'),
  param('taskId').isMongoId().withMessage('ID de la taréa no válido'),
  handleInputErrors,
  TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
  param('projectId').isMongoId().withMessage('ID del proyecto no válido'),
  param('taskId').isMongoId().withMessage('ID de la taréa no válido'),
  body('status')
    .notEmpty()
    .withMessage("El estado no puede estar vacío.")
    .isIn(Object.values(taskStatusEnum))
    .withMessage(`Estado inválido. Los estados válidos son: ${Object.values(taskStatusEnum).join(", ")}.`),
  handleInputErrors,
  TaskController.updateTaskStatus
)

router.post('/:projectId/team/find',
  body('email')
    .isEmail().toLowerCase()
    .withMessage('El correo electrónico debe ser válido.'),
  handleInputErrors,
  TeamMemberController.findUserByEmail
)
router.post('/:projectId/team',
  body('id')
    .isMongoId().withMessage('ID de Proyecto inválido.'),
  handleInputErrors,
  TeamMemberController.addMemberById
)
router.delete('/:projectId/team/:userId',
  param('userId')
    .isMongoId().withMessage('ID de Usuario NO válido.'),
  handleInputErrors,
  TeamMemberController.removeMemberById
)
router.get('/:projectId/team',
  TeamMemberController.getProjectTeam
)

//& **  Routes for notes */

router.post('/:projectId/tasks/:taskId/notes',
  body('content')
    .isLength({ min: 10 })
    .withMessage('La nota debe tener al menos diez caracteres.'),
  handleInputErrors,
  NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
  handleInputErrors,
  NoteController.getTaskNotes
)


router.delete('/:projectId/tasks/:taskId/notes/:noteId',
  param('noteId').isMongoId().withMessage('ID de Nota NO válido.'),
  handleInputErrors,
  NoteController.deleteNote
)

export default router;