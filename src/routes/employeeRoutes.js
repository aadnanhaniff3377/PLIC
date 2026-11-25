import { Router } from 'express';
import { employeeController } from '../controllers/employeeController.js';
import { validateEmployee, validateEmployeeUpdate } from '../middleware/requestValidator.js';

const router = Router();

// POST /api/v1/employees
router.post('/', validateEmployee, employeeController.create);

// GET /api/v1/employees
router.get('/', employeeController.getAll);

// GET /api/v1/employees/:id
router.get('/:id', employeeController.getById);

// PUT /api/v1/employees/:id
router.put('/:id', validateEmployeeUpdate, employeeController.update);

// DELETE /api/v1/employees/:id
router.delete('/:id', employeeController.remove);

export default router;
