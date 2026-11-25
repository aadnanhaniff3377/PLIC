import { query } from '../config/database.js';

export const employeeService = {
  /**
   * Create a new employee
   */
  async createEmployee(employeeData) {
    const {
      full_name,
      email,
      phone,
      department,
      designation,
      salary,
      joining_date,
      status,
    } = employeeData;

    const sql = `
      INSERT INTO employees (
        full_name, email, phone, department, designation, salary, joining_date, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      full_name,
      email,
      phone || null,
      department || null,
      designation || null,
      salary !== undefined ? salary : null,
      joining_date || null,
      status || 'Active',
    ];

    const result = await query(sql, values);
    return result.rows[0];
  },

  /**
   * Get all employees with pagination, search, and filters
   */
  async getAllEmployees(filters) {
    let { page = 1, limit = 10, search, department, status } = filters;
    page = Math.max(1, parseInt(page, 10));
    limit = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const offset = (page - 1) * limit;

    let conditions = [];
    let values = [];
    let paramIndex = 1;

    if (search) {
      conditions.push(`(full_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR designation ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (department) {
      conditions.push(`department = $${paramIndex}`);
      values.push(department);
      paramIndex++;
    }

    if (status) {
      conditions.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count query for pagination metadata
    const countSql = `SELECT COUNT(*) FROM employees ${whereClause};`;
    const countResult = await query(countSql, values);
    const totalRecords = parseInt(countResult.rows[0].count, 10);

    // Data query
    const dataSql = `
      SELECT * FROM employees
      ${whereClause}
      ORDER BY employee_id DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
    `;

    const dataValues = [...values, limit, offset];
    const dataResult = await query(dataSql, dataValues);

    const totalPages = Math.ceil(totalRecords / limit) || 1;

    return {
      employees: dataResult.rows,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  },

  /**
   * Get employee by ID
   */
  async getEmployeeById(id) {
    const sql = `SELECT * FROM employees WHERE employee_id = $1;`;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  /**
   * Update employee by ID
   */
  async updateEmployee(id, employeeData) {
    const existing = await this.getEmployeeById(id);
    if (!existing) {
      return null;
    }

    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'full_name',
      'email',
      'phone',
      'department',
      'designation',
      'salary',
      'joining_date',
      'status',
    ];

    for (const field of allowedFields) {
      if (employeeData[field] !== undefined) {
        fields.push(`${field} = $${paramIndex}`);
        values.push(employeeData[field]);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      return existing;
    }

    values.push(id);
    const sql = `
      UPDATE employees
      SET ${fields.join(', ')}
      WHERE employee_id = $${paramIndex}
      RETURNING *;
    `;

    const result = await query(sql, values);
    return result.rows[0];
  },

  /**
   * Delete employee by ID
   */
  async deleteEmployee(id) {
    const sql = `DELETE FROM employees WHERE employee_id = $1 RETURNING *;`;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },
};
