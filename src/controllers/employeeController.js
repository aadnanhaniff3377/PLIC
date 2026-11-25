import { employeeService } from '../services/employeeService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const employeeController = {
  /**
   * POST /api/v1/employees
   */
  async create(req, res, next) {
    try {
      const employee = await employeeService.createEmployee(req.body);
      return sendSuccess(
        res,
        201,
        'Employee created successfully',
        employee
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/employees
   */
  async getAll(req, res, next) {
    try {
      const { page, limit, search, department, status } = req.query;
      const result = await employeeService.getAllEmployees({
        page,
        limit,
        search,
        department,
        status,
      });

      return sendSuccess(
        res,
        200,
        'Employees retrieved successfully',
        result.employees,
        result.pagination
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/employees/:id
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const employee = await employeeService.getEmployeeById(id);

      if (!employee) {
        return sendError(
          res,
          404,
          `Employee with ID ${id} not found`,
          'EMPLOYEE_NOT_FOUND'
        );
      }

      return sendSuccess(
        res,
        200,
        'Employee retrieved successfully',
        employee
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/v1/employees/:id
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updatedEmployee = await employeeService.updateEmployee(id, req.body);

      if (!updatedEmployee) {
        return sendError(
          res,
          404,
          `Employee with ID ${id} not found`,
          'EMPLOYEE_NOT_FOUND'
        );
      }

      return sendSuccess(
        res,
        200,
        'Employee updated successfully',
        updatedEmployee
      );
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/v1/employees/:id
   */
  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const deletedEmployee = await employeeService.deleteEmployee(id);

      if (!deletedEmployee) {
        return sendError(
          res,
          404,
          `Employee with ID ${id} not found`,
          'EMPLOYEE_NOT_FOUND'
        );
      }

      return sendSuccess(
        res,
        200,
        'Employee deleted successfully',
        deletedEmployee
      );
    } catch (error) {
      next(error);
    }
  },
};
