import { Router } from 'express';
import { body, param } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middleware/validation';

const router = Router();

router.post('/create-account', 
  body('name').notEmpty().withMessage('El Nombre es obligatorio'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 8 }).withMessage('El Password debe tener al menos 8 caracteres'),
  body('password').matches(/\d/).withMessage('El Password debe contener al menos un número'),
  body('password').matches(/[a-z]/).withMessage('El Password debe contener al menos una letra en minúscula'),
  body('password').matches(/[A-Z]/).withMessage('El Password debe contener al menos una letra en mayúscula'),
  body('password').matches(/[^a-zA-Z0-9]/).withMessage('El Password debe contener al menos un carácter especial'),
  body('password_confirmation').custom((value, {req}) => {
  
    if (value !== req.body.password) {
      throw new Error('Las contraseñas no coinciden');
    }
    return true;
  }),
  handleInputErrors,
 AuthController.createAcount,
);

router.post('/confirm-account', 
  body('token').notEmpty().withMessage('El token es obligatorio'),
  body('token').isLength({ min: 6, max: 6 }).withMessage('El token debe tener exactamente 6 caracteres'),
  handleInputErrors,
  AuthController.confirmAccount,
);

router.post('/login', 
  body('email').isEmail().withMessage('Email no válido'),
  body('password').notEmpty().withMessage('El Password es obligatorio'),
  handleInputErrors,
  AuthController.login,
);

router.post('/request-code', 
  body('email').isEmail().withMessage('Email no válido'),
  handleInputErrors,
  AuthController.requestConfirmationCode,
);

router.post('/forgot-password', 
  body('email').isEmail().withMessage('Email no válido'),
  handleInputErrors,
  AuthController.forgotPassword,
);

router.post('/validate-token', 
  body('token').notEmpty().withMessage('El token no puede estar vacío'),
  handleInputErrors,
  AuthController.validateToken,
);

router.post('/update-password/:token', 
  param('token').isNumeric().withMessage('Token NO válido'),
  body('password').isLength({ min: 8 }).withMessage('El Password debe tener al menos 8 caracteres'),
  body('password').matches(/\d/).withMessage('El Password debe contener al menos un número'),
  body('password').matches(/[a-z]/).withMessage('El Password debe contener al menos una letra en minúscula'),
  body('password').matches(/[A-Z]/).withMessage('El Password debe contener al menos una letra en mayúscula'),
  body('password-comfirmation').custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('Las contraseñas no coinciden');
    }
    return true;
  }),
  handleInputErrors,
  AuthController.updatePasswordWithToken,
);




export default router;