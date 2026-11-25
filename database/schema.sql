-- Employee Management System Database Schema

-- Drop table if exists (for clean setup/reset)
DROP TABLE IF EXISTS employees;

-- Create employees table
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    department VARCHAR(100),
    designation VARCHAR(100),
    salary NUMERIC(12, 2) CHECK (salary >= 0),
    joining_date DATE,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance and frequent queries
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_status ON employees(status);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to call the function before row updates
CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Insert sample data for testing
INSERT INTO employees (full_name, email, phone, department, designation, salary, joining_date, status)
VALUES
('Ali Ahmed', 'ali.ahmed@example.com', '03001234567', 'IT', 'Software Developer', 85000.00, '2025-01-15', 'Active'),
('Fatima Noor', 'fatima.noor@example.com', '03019876543', 'HR', 'HR Manager', 95000.00, '2024-06-10', 'Active'),
('Usman Khan', 'usman.khan@example.com', '03025558899', 'Finance', 'Financial Analyst', 75000.00, '2025-03-01', 'Active');
