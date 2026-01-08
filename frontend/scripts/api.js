//api.js
(function () {
  function getModels() {
    if (typeof window.Models === "undefined") {
      throw new Error("Models not loaded. Load models.js before api.js");
    }
    return window.Models;
  }

  // Create shortcuts with unique names
  const LocalModels = getModels();
  const LocalUser = LocalModels.User;
  const LocalUserPublic = LocalModels.UserPublic;
  const LocalCitizenship = LocalModels.Citizenship;
  const LocalProject = LocalModels.Project;
  const LocalMilestone = LocalModels.Milestone;
  const LocalExpenditure = LocalModels.Expenditure;
  const LocalIssue = LocalModels.Issue;
  const LocalProjectStatus = LocalModels.ProjectStatus;
  const LocalProjectType = LocalModels.ProjectType;
  const LocalIssueStatus = LocalModels.IssueStatus;

  // ==================== AUTH SERVICE ====================

  class AuthService {
    constructor(baseURL = "") {
      this.baseURL = baseURL;
      this.token = localStorage.getItem("auth_token") || null;
      this.currentLocalUser =
        JSON.parse(localStorage.getItem("current_user")) || null;
    }

    /**
     * Set authentication token
     * @param {string} token - JWT token
     */
    setToken(token) {
      this.token = token;
      localStorage.setItem("auth_token", token);
    }

    /**
     * Clear authentication data
     */
    clearAuth() {
      this.token = null;
      this.currentLocalUser = null;
      localStorage.removeItem("auth_token");
      localStorage.removeItem("current_user");
    }

    /**
     * Make authenticated request
     * @param {string} url
     * @param {Object} options
     * @returns {Promise<Response>}
     */
    async authenticatedFetch(url, options = {}) {
      if (!this.token) {
        throw new Error("No authentication token");
      }

      const headers = {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...options.headers,
      };

      return fetch(url, { ...options, headers });
    }

    /**
     * Register a new user
     * @param {LocalUser} userData
     * @returns {Promise<LocalUserPublic>}
     */
    async register(userData) {
      const response = await fetch(`${this.baseURL}/user/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Registration failed");
      }

      const data = await response.json();
      return new LocalUserPublic(data);
    }

    /**
     * Login user
     * @param {Object} credentials
     * @param {string} credentials.phone
     * @param {string} credentials.password
     * @returns {Promise<Object>} { access_token, token_type }
     */
    async login(credentials) {
      const response = await fetch(`${this.baseURL}/user/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }

      const data = await response.json();
      this.setToken(data.access_token);

      // Verify and get current user
      try {
        const user = await this.verifyLocalUser();
        this.currentLocalUser = user;
        localStorage.setItem("current_user", JSON.stringify(user));
      } catch (error) {
        console.warn("Could not fetch user after login:", error);
      }

      return data;
    }

    /**
     * Verify current user
     * @returns {Promise<LocalUserPublic>}
     */
    async verifyLocalUser() {
      const response = await this.authenticatedFetch(
        `${this.baseURL}/user/verify`,
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Verification failed");
      }

      const data = await response.json();
      return new LocalUserPublic(data);
    }

    /**
     * Set user as admin (admin only)
     * @param {string} phone - Phone number of user to make admin
     * @returns {Promise<LocalUserPublic>}
     */
    async setAdmin(phone) {
      const response = await this.authenticatedFetch(
        `${this.baseURL}/user/admin?phone=${encodeURIComponent(phone)}`,
        { method: "PUT" },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to set admin");
      }

      const data = await response.json();
      return new LocalUserPublic(data);
    }

    /**
     * Check if current user is admin
     * @returns {boolean}
     */
    isAdmin() {
      return this.currentLocalUser?.admin || false;
    }
  }

  // ==================== VERIFICATION SERVICE ====================

  class VerificationService {
    constructor(baseURL = "", authService) {
      this.baseURL = baseURL;
      this.auth = authService;
    }

    /**
     * Upload citizenship document
     * @param {File} file - Image file
     * @param {string} phone - User's phone number
     * @returns {Promise<Object>} { filename, saved_to }
     */
    async uploadCitizenship(file, phone) {
      const formData = new FormData();
      formData.append("file", file);

      // Create headers WITHOUT Content-Type for FormData
      const headers = {
        Authorization: `Bearer ${this.auth.token}`,
      };

      const response = await fetch(
        `${this.baseURL}/verification/citizenship/${encodeURIComponent(phone)}`,
        {
          method: "POST",
          headers: headers,
          body: formData,
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Upload failed");
      }

      return await response.json();
    }

    /**
     * Get verified citizenship (admin only)
     * @returns {Promise<Object>} { id, phone, image_data }
     */
    async getVerifiedCitizenship() {
      const headers = {
        Authorization: `Bearer ${this.auth.token}`,
      };
      const response = await this.auth.authenticatedFetch(
        `${this.baseURL}/verification/citizenship/`,
        {
          method: "GET",
          headers: headers,
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to fetch citizenship");
      }

      return await response.json();
    }

    /**
     * Verify user identity (admin only)
     * @param {string} phone - LocalUser's phone number
     * @param {Object} userData - LocalUser citizenship data
     * @returns {Promise<LocalUserPublic>}
     */
    async verifyIdentity(phone, userData) {
      const headers = {
        Authorization: `Bearer ${this.auth.token}`,
      };
      const response = await this.auth.authenticatedFetch(
        `${this.baseURL}/verification/citizenship/${encodeURIComponent(phone)}`,
        {
          method: "PUT",
          body: JSON.stringify(userData),
          headers: headers,
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Verification failed");
      }

      const data = await response.json();
      return new LocalUserPublic(data);
    }
    
    /**
     * Get all users (admin only)
     * @returns {Promise<LocalUserPublic>}
     */
    async getAllUsers() {
      const headers = {
        Authorization: `Bearer ${this.auth.token}`,
      };
      const response = await this.auth.authenticatedFetch(
        `${this.baseURL}/user/all`,
        {
          method: "GET",
          headers: headers,
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Verification failed");
      }

      const data = await response.json();
      return data.map(user => new LocalUserPublic(user));
    }
  }

  // ==================== PROJECT SERVICE ====================

  class ProjectService {
    constructor(baseURL = "", authService) {
      this.baseURL = baseURL;
      this.auth = authService;
    }

    /**
     * Create a new project (admin only)
     * @param {Object} projectData
     * @param {Array} milestones
     * @returns {Promise<LocalProject>}
     */
    async createProject(projectData, milestones = []) {
      const response = await this.auth.authenticatedFetch(
        `${this.baseURL}/project/`,
        {
          method: "POST",
          body: JSON.stringify({
            project: projectData,
            milestones: milestones,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Project creation failed");
      }

      const data = await response.json();
      return new LocalProject(data);
    }

    /**
     * List all projects
     * @returns {Promise<LocalProject[]>}
     */
    async listProjects() {
      const response = await fetch(`${this.baseURL}/project/`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to fetch projects");
      }

      const data = await response.json();
      return data.map((project) => new LocalProject(project));
    }

    /**
     * Get project by ID
     * @param {string} projectId
     * @returns {Promise<LocalProject>}
     */
    async getProject(projectId) {
      const response = await fetch(`${this.baseURL}/project/${projectId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Project not found");
      }

      const data = await response.json();
      return new LocalProject(data);
    }

    /**
     * Update project (admin only)
     * @param {string} projectId
     * @param {Object} projectData
     * @returns {Promise<LocalProject>}
     */
    async updateProject(projectId, projectData) {
      const response = await this.auth.authenticatedFetch(
        `${this.baseURL}/project/${projectId}`,
        {
          method: "PUT",
          body: JSON.stringify(projectData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Project update failed");
      }

      const data = await response.json();
      return new LocalProject(data);
    }

    /**
     * Delete project (admin only)
     * @param {string} projectId
     * @returns {Promise<Object>}
     */
    async deleteProject(projectId) {
      const response = await this.auth.authenticatedFetch(
        `${this.baseURL}/project/${projectId}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Project deletion failed");
      }

      return await response.json();
    }

    /**
     * Get project milestones
     * @param {string} projectId
     * @returns {Promise<LocalMilestone[]>}
     */
    async listMilestones(projectId) {
      const response = await fetch(
        `${this.baseURL}/project/${projectId}/milestones`,
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to fetch milestones");
      }

      const data = await response.json();
      return data.map((milestone) => new LocalMilestone(milestone));
    }

    /**
     * Update milestone (contractor only)
     * @param {string} projectId
     * @param {string} milestoneId
     * @param {Object} milestoneData
     * @returns {Promise<LocalProject>}
     */
    async updateMilestone(projectId, milestoneId, milestoneData) {
      const response = await this.auth.authenticatedFetch(
        `${this.baseURL}/project/${projectId}/${milestoneId}`,
        {
          method: "PUT",
          body: JSON.stringify(milestoneData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Milestone update failed");
      }

      const data = await response.json();
      return new LocalProject(data);
    }
  }

  // ==================== EXPENSE SERVICE ====================

  class ExpenseService {
    constructor(baseURL = "", authService) {
      this.baseURL = baseURL;
      this.auth = authService;
    }

    /**
     * Create expenditure (contractor only)
     * @param {string} projectId
     * @param {Object} expenditureData
     * @returns {Promise<LocalExpenditure>}
     */
    async createExpenditure(projectId, expenditureData) {
      const response = await this.auth.authenticatedFetch(
        `${this.baseURL}/expenses/${projectId}/expenditures`,
        {
          method: "POST",
          body: JSON.stringify(expenditureData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Expenditure creation failed");
      }

      const data = await response.json();
      return new LocalExpenditure(data);
    }

    /**
     * Get project expenditures
     * @param {string} projectId
     * @returns {Promise<LocalExpenditure[]>}
     */
    async getProjectExpenditures(projectId) {
      const response = await fetch(
        `${this.baseURL}/expenses/projects/${projectId}/expenditures`,
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to fetch expenditures");
      }

      const data = await response.json();
      return data.map((exp) => new LocalExpenditure(exp));
    }
  }

  // ==================== ISSUE SERVICE ====================

  class IssueService {
    constructor(baseURL = "", authService) {
      this.baseURL = baseURL;
      this.auth = authService;
    }

    /**
     * Create issue
     * @param {string} projectId
     * @param {Object} issueData
     * @returns {Promise<LocalIssue>}
     */
    async createIssue(projectId, issueData) {
      const response = await this.auth.authenticatedFetch(
        `${this.baseURL}/issues/${projectId}/issues`,
        {
          method: "POST",
          body: JSON.stringify(issueData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Issue creation failed");
      }

      const data = await response.json();
      return new LocalIssue(data);
    }

    /**
     * Get project issues
     * @param {string} projectId
     * @returns {Promise<LocalIssue[]>}
     */
    async getProjectIssues(projectId) {
      const response = await fetch(
        `${this.baseURL}/issues/${projectId}/issues`,
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to fetch issues");
      }

      const data = await response.json();
      return data.map((issue) => new LocalIssue(issue));
    }

    /**
     * Update issue status (admin only)
     * @param {string} issueId
     * @param {Object} statusData
     * @returns {Promise<LocalIssue>}
     */
    async updateIssueStatus(issueId, statusData) {
      const response = await this.auth.authenticatedFetch(
        `${this.baseURL}/issues/issues/${issueId}/status`,
        {
          method: "PUT",
          body: JSON.stringify(statusData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to update issue status");
      }

      const data = await response.json();
      return new LocalIssue(data);
    }
  }

  // ==================== MAIN API SERVICE ====================

  class APIService {
    constructor(baseURL = "http://localhost:8000") {
      console.log("Creating APIService with URL:", baseURL);
      this.baseURL = baseURL;
      this.auth = new AuthService(baseURL);
      this.verification = new VerificationService(baseURL, this.auth);
      this.projects = new ProjectService(baseURL, this.auth);
      this.expenses = new ExpenseService(baseURL, this.auth);
      this.issues = new IssueService(baseURL, this.auth);
    }

    /**
     * Check if API is reachable
     * @returns {Promise<boolean>}
     */
    async healthCheck() {
      try {
        const response = await fetch(`${this.baseURL}/`, { method: "HEAD" });
        return response.ok;
      } catch (error) {
        console.error("Health check failed:", error);
        return false;
      }
    }

    /**
     * Logout user
     */
    logout() {
      this.auth.clearAuth();
    }

    /**
     * Get current user
     * @returns {LocalUserPublic|null}
     */
    getCurrentUser() {
      return this.auth.currentLocalUser;
    }

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
      return !!this.auth.token;
    }

    /**
     * Check if user is admin
     * @returns {boolean}
     */
    isAdmin() {
      return this.auth.isAdmin();
    }
  }

  // Expose to global scope
  if (typeof window !== "undefined") {
    window.APIService = APIService;
    window.AuthService = AuthService;
    window.VerificationService = VerificationService;
    window.ProjectService = ProjectService;
    window.ExpenseService = ExpenseService;
    window.IssueService = IssueService;
  }
})();
