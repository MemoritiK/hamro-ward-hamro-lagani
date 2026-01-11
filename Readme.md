# Public Project Management System (PPMS)
Public Project Management System (PPMS) is a transparent web-based platform designed to track and manage public infrastructure and community development projects. The system enables government bodies, contractors, and citizens to monitor project progress, expenditures, and milestones in real-time.

## Purpose

To provide transparency and accountability in public fund utilization by creating a unified platform where all stakeholders can track project execution, budget utilization, and completion status.

## Target Users

1. **Government Officials** - Create and monitor public projects
2. **Contractors** - Manage assigned projects, track expenses, update progress
3. **Citizens** - View project status, report issues, track community-funded projects
4. **Administrators** - Manage users, verify identities, oversee system operations

## Project Types

### Government-Funded Projects
- Projects funded by government budgets
- Focus on budget utilization tracking
- Formal procurement and contracting

### Community-Funded Projects
- Projects funded by community contributions
- Focus on fundraising progress
- Community participation in monitoring

## System Screenshots

<table>
  <tr>
    <td><img width="933" height="962" alt="Dashboard" src="https://github.com/user-attachments/assets/3a1557b1-c31b-4ca3-9d34-04e523493764" /></td>
    <td><img width="936" height="946" alt="Project List" src="https://github.com/user-attachments/assets/0072d3cc-d8f8-4a30-a863-4707560a5ff0" /></td>
  </tr>
  <tr>
    <td><img width="928" height="963" alt="Project Details" src="https://github.com/user-attachments/assets/c434cac8-9ce5-436e-b281-9c2521f6dc67" /></td>
    <td><img width="888" height="880" alt="Expense Tracking" src="https://github.com/user-attachments/assets/6ae82364-dc1a-4a18-b85d-307cc189bf06" /></td>
  </tr>
</table>
## Core Features

### Project Management
- Create and manage projects with detailed specifications
- Track project status (soon, ongoing, completed, delayed)
- Monitor budget utilization and fundraising progress
- Set and track project deadlines
- Geographic filtering by ward, district, city

### Financial Tracking
- Record project expenditures with bill documentation
- Track budget utilization percentage
- Monitor fundraising progress for community projects
- View detailed expense reports with timestamps

### Milestone Management
- Define project milestones with due dates
- Mark milestones as completed
- Upload photographic evidence of progress
- Track overall project completion progress

### User Management
- Multi-role access (citizens, contractors, admins)
- Phone-based authentication
- Citizenship verification system
- Role-based permissions and access control

### Issue Reporting
- Citizens can report project-related issues
- Anonymous reporting option
- Attach evidence/photos
- Track issue resolution status

## Technical Architecture

### Frontend
- HTML, CSS, JavaScript
- Pico.css for minimalist styling
- Responsive design for mobile/desktop
- Role-based UI components

### Backend
- Python with SQLModel
- RESTful API architecture
- JWT-based authentication
- File upload handling

### Database
- PostgreSQL (or SQLite for development)
- Relational data structure
- JSON support for flexible fields

## Installation

### Prerequisites
- Python 3.8+
- PostgreSQL or SQLite
- Web server (Nginx/Apache for production)

### Setup Steps
1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Configure database connection in `.env`
4. Run database migrations
5. Start the application server
6. Access the web interface

## Usage Workflows

### For Government Officials
1. Create new projects with budget allocation
2. Assign contractors to projects
3. Monitor budget utilization and timelines
4. Review issue reports and take action

### For Contractors
1. View assigned projects
2. Update project status and milestones
3. Record expenses with supporting bills
4. Upload progress photos

### For Citizens
1. Browse projects in their locality
2. Track project progress and expenses
3. Report issues with projects
4. Monitor community-funded initiatives

## Security Features

- Phone-based authentication
- Role-based access control
- Secure file uploads
- Data validation and sanitization
- Audit logging for critical operations

## Benefits

### For Government
- Transparent fund utilization
- Better project oversight
- Reduced corruption opportunities
- Improved public trust

### For Contractors
- Simplified project management
- Clear documentation requirements
- Timely progress tracking
- Reduced disputes

### For Citizens
- Visibility into public spending
- Ability to report problems
- Trust in development processes
- Community participation
