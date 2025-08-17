import { body } from 'express-validator';


export const registerRules = [
body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name 2-60 chars'),
body('email').isEmail().withMessage('Valid email required'),
body('password')
.isLength({ min: 8 }).withMessage('Min 8 chars')
.matches(/[A-Z]/).withMessage('At least one uppercase')
.matches(/[a-z]/).withMessage('At least one lowercase')
.matches(/[0-9]/).withMessage('At least one digit'),
body('role').optional().isIn(['HR', 'USER']).withMessage('Invalid role')
];


export const loginRules = [
body('email').isEmail().withMessage('Valid email required'),
body('password').notEmpty().withMessage('Password required')
];