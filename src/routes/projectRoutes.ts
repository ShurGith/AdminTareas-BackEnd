import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controllers/TaxkController';
import { projectExist } from '../middleware/project';
import { taskExist } from '../middleware/task';
import { taskStatusEnum } from '../models/Task';
import { authenticate } from '../middleware/auth';

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

//** Tasks routes **//
router.param('projectId', projectExist);
router.param('taskId', taskExist);
//** Se ejecuta antes que cualquier ruta con projectId. 
//*** De esta manera se comprueba si el proyecto existe y no es necesario repetirlo en cada ruta.
//TODO: Implementar las rutas de tareas
router.post('/:projectId/tasks',
  //projectExist, 
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
  //projectExist,
  TaskController.getProjectTasks
)

router.get('/:projectId/tasks/:taskId',
  //projectExist,
  param('projectId').isMongoId().withMessage('ID del proyecto no válido'),
  param('taskId').isMongoId().withMessage('ID de la taréa no válido'),
  handleInputErrors,
  TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
  //projectExist,
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
  //projectExist,
  param('projectId').isMongoId().withMessage('ID del proyecto no válido'),
  param('taskId').isMongoId().withMessage('ID de la taréa no válido'),
  handleInputErrors,
  TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
  //projectExist,
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


export default router;