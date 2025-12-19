@echo off
echo ========================================
echo TaskHub QA Sandbox - Git Commit
echo ========================================
echo.

cd /d "%~dp0"

echo Checking Git status...
git status

echo.
echo Adding all files...
git add .

echo.
echo Creating commit...
git commit -m "TaskHub QA Sandbox - Complete Implementation

✅ FULLY FUNCTIONAL QA TESTING PLATFORM

🚀 Features Implemented:
• Complete JWT Authentication System
• Separate Login/Register Pages
• Full CRUD Operations (Users, Projects, Test Cases)
• SQLite Database with Proper Schema
• REST API with Swagger Documentation
• Content Security Policy (CSP)
• Responsive UI with Modern Design
• Automated Server Startup Scripts
• Comprehensive Testing Suite

🛡️ Security & Production Ready:
• CSP Protection against XSS
• Helmet Security Middleware
• CORS Configuration
• Input Validation & Sanitization
• JWT Token Management
• Password Hashing (bcrypt)

🎨 User Experience:
• Separate Auth Pages (no modals)
• Automatic Server Status Detection
• File Protocol Protection
• Comprehensive Error Handling
• Mobile-Responsive Design

🗄️ Database & Backend:
• Express.js Server
• SQLite with Proper Relationships
• RESTful API Design
• Request Validation
• Error Handling & Logging

📊 Frontend:
• Vanilla JavaScript (ES6+)
• Modern CSS with Animations
• Component-Based Architecture
• API Client with Error Handling
• State Management

🧪 Testing & Quality:
• Jest Unit Tests
• Playwright E2E Tests
• API Integration Tests
• Automated Test Scripts

📚 Documentation:
• Complete README
• API Documentation (Swagger)
• Setup Instructions
• Troubleshooting Guide

🚀 Deployment Ready:
• Environment Configuration
• Production Scripts
• Docker Support Ready
• CI/CD Pipeline Ready"

if %errorlevel% equ 0 (
    echo.
    echo ✅ Commit created successfully!
    echo.
    echo To push to GitHub, run:
    echo git push origin main
    echo.
) else (
    echo.
    echo ❌ Commit failed!
    echo Check the error messages above.
    echo.
)

pause