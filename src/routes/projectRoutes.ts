import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controllers/TaxkController';
import { validateProjectExist } from '../middleware/project';

export const router = Router();

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
//TODO: Implementar las rutas de tareas
router.post('/:projectId/tasks',
  validateProjectExist,
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
  validateProjectExist,
  TaskController.getProjectTasks
)

router.get('/:projectId/tasks/:taskId',
  validateProjectExist,
  param('projectId').isMongoId().withMessage('projectId inválido'),
  param('taskId').isMongoId().withMessage('taskId inválido'),
  handleInputErrors,
  TaskController.getTaskById
)
export default router;