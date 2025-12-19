const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();

    // Add test cases count for each project
    const projectsWithCount = await Promise.all(
      projects.map(async (project) => {
        const count = await project.getTestCasesCount();
        return {
          ...project.toJSON(),
          test_cases_count: count
        };
      })
    );

    res.json({
      success: true,
      data: projectsWithCount
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects'
    });
  }
};

// Get project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const testCasesCount = await project.getTestCasesCount();

    res.json({
      success: true,
      data: {
        ...project.toJSON(),
        test_cases_count: testCasesCount
      }
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project'
    });
  }
};

// Get projects by owner
const getProjectsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const projects = await Project.findByOwner(ownerId);

    // Add test cases count for each project
    const projectsWithCount = await Promise.all(
      projects.map(async (project) => {
        const count = await project.getTestCasesCount();
        return {
          ...project.toJSON(),
          test_cases_count: count
        };
      })
    );

    res.json({
      success: true,
      data: projectsWithCount
    });
  } catch (error) {
    console.error('Error fetching projects by owner:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects'
    });
  }
};

// Create new project
const createProject = async (req, res) => {
  try {
    console.log('📝 Creating project, request body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, description } = req.body;
    let owner_id = req.user?.id || req.body.owner_id;

    // If no owner_id provided, try to use system user or create one
    if (!owner_id) {
      console.log('👤 No owner_id provided, using system user...');

      const User = require('../models/User');
      let systemUser = await User.findByUsername('system');

      if (!systemUser) {
        console.log('❌ System user not found, creating...');
        try {
          systemUser = await User.create({
            username: 'system',
            email: 'system@taskhub.qa',
            password: 'system123'
          });
          console.log('✅ System user created with ID:', systemUser.id);
        } catch (createError) {
          console.error('❌ Failed to create system user:', createError);
          // Use NULL as fallback
          owner_id = null;
        }
      }

      if (systemUser) {
        owner_id = systemUser.id;
        console.log('✅ Using existing system user:', owner_id);
      } else {
        console.log('⚠️ System user not available, using NULL');
        owner_id = null;
      }
    }

    console.log('👤 Final owner_id:', owner_id);

    const project = await Project.create({
      name,
      description,
      owner_id
    });

    console.log('✅ Project created successfully:', project.id);

    res.status(201).json({
      success: true,
      data: project.toJSON(),
      message: 'Проект создан успешно'
    });
  } catch (error) {
    console.error('❌ Error creating project:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to create project',
      details: error.message
    });
  }
};

// Update project
const updateProject = async (req, res) => {
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

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const updatedProject = await project.update(updateData);

    res.json({
      success: true,
      data: updatedProject.toJSON(),
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project'
    });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    await project.delete();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project'
    });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  getProjectsByOwner,
  createProject,
  updateProject,
  deleteProject
};
