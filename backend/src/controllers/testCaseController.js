const TestCase = require('../models/TestCase');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// Get all test cases with optional filters
const getTestCases = async (req, res) => {
  try {
    const filters = {};

    // Apply filters from query parameters
    if (req.query.project_id) filters.project_id = req.query.project_id;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.priority) filters.priority = req.query.priority;
    if (req.query.assigned_to) filters.assigned_to = req.query.assigned_to;

    const testCases = await TestCase.findAll(filters);

    res.json({
      success: true,
      data: testCases.map(tc => tc.toJSON())
    });
  } catch (error) {
    console.error('Error fetching test cases:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch test cases'
    });
  }
};

// Get test case by ID
const getTestCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const testCase = await TestCase.findById(id);

    if (!testCase) {
      return res.status(404).json({
        success: false,
        error: 'Test case not found'
      });
    }

    res.json({
      success: true,
      data: testCase.toJSON()
    });
  } catch (error) {
    console.error('Error fetching test case:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch test case'
    });
  }
};

// Get test cases by project
const getTestCasesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const testCases = await TestCase.findByProject(projectId);

    res.json({
      success: true,
      data: testCases.map(tc => tc.toJSON())
    });
  } catch (error) {
    console.error('Error fetching test cases by project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch test cases'
    });
  }
};

// Get test cases assigned to user
const getTestCasesByAssignedUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const testCases = await TestCase.findByAssignedUser(userId);

    res.json({
      success: true,
      data: testCases.map(tc => tc.toJSON())
    });
  } catch (error) {
    console.error('Error fetching test cases by assigned user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch test cases'
    });
  }
};

// Create new test case
const createTestCase = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      project_id,
      priority,
      status,
      steps,
      expected_result,
      assigned_to
    } = req.body;

    // Verify project exists
    const project = await Project.findById(project_id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const created_by = req.user?.id || 'system'; // For now, use system if no auth

    const testCase = await TestCase.create({
      title,
      description,
      project_id,
      priority,
      status,
      steps,
      expected_result,
      created_by,
      assigned_to
    });

    res.status(201).json({
      success: true,
      data: testCase.toJSON(),
      message: 'Test case created successfully'
    });
  } catch (error) {
    console.error('Error creating test case:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create test case'
    });
  }
};

// Update test case
const updateTestCase = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const testCase = await TestCase.findById(id);
    if (!testCase) {
      return res.status(404).json({
        success: false,
        error: 'Test case not found'
      });
    }

    const updatedTestCase = await testCase.update(updateData);

    res.json({
      success: true,
      data: updatedTestCase.toJSON(),
      message: 'Test case updated successfully'
    });
  } catch (error) {
    console.error('Error updating test case:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update test case'
    });
  }
};

// Delete test case
const deleteTestCase = async (req, res) => {
  try {
    const { id } = req.params;

    const testCase = await TestCase.findById(id);
    if (!testCase) {
      return res.status(404).json({
        success: false,
        error: 'Test case not found'
      });
    }

    await testCase.delete();

    res.json({
      success: true,
      message: 'Test case deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting test case:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete test case'
    });
  }
};

// Get test case statistics
const getTestCaseStats = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Get all test cases for the project
    const testCases = await TestCase.findByProject(projectId);

    // Calculate statistics
    const stats = {
      total: testCases.length,
      by_status: {},
      by_priority: {}
    };

    testCases.forEach(tc => {
      // Count by status
      stats.by_status[tc.status] = (stats.by_status[tc.status] || 0) + 1;

      // Count by priority
      stats.by_priority[tc.priority] = (stats.by_priority[tc.priority] || 0) + 1;
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching test case statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
};

module.exports = {
  getTestCases,
  getTestCaseById,
  getTestCasesByProject,
  getTestCasesByAssignedUser,
  createTestCase,
  updateTestCase,
  deleteTestCase,
  getTestCaseStats
};
