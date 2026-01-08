
// models.js - Direct mapping from your Python models

// ==================== USER MODELS ====================

/**
 * @typedef {Object} UserBase
 * @property {string} [name]
 * @property {string} password
 * @property {string} phone
 */

/**
 * @typedef {Object} UserCitizenship
 * @property {number} [citizenship_num]
 * @property {string} [district]
 * @property {string} [city]
 * @property {number} [ward_num]
 */

/**
 * User Model (full user with all fields)
 * @class
 */
class User {
  /**
   * @param {Object} data
   * @param {string} data.id - UUID
   * @param {string} [data.name]
   * @param {string} data.password
   * @param {string} data.phone
   * @param {number} [data.citizenship_num]
   * @param {string} [data.district]
   * @param {string} [data.city]
   * @param {number} [data.ward_num]
   * @param {boolean} data.admin
   */
  constructor(data) {
    this.id = data.id || this.generateUUID();
    this.name = data.name || null;
    this.password = data.password || "";
    this.phone = data.phone || "";
    this.citizenship_num = data.citizenship_num || null;
    this.district = data.district || null;
    this.city = data.city || null;
    this.ward_num = data.ward_num || null;
    this.admin = data.admin || false;
  }

  /** Generate UUID for client-side if needed */
  generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }

  /** Convert to public format (without password) */
  toPublic() {
    return new UserPublic({
      id: this.id,
      name: this.name,
      phone: this.phone,
      admin: this.admin,
      citizenship_num: this.citizenship_num,
      district: this.district,
      city: this.city,
      ward_num: this.ward_num,
    });
  }
}

/**
 * User Public Model (for API responses)
 * @class
 */
class UserPublic {
  /**
   * @param {Object} data
   * @param {string} data.id
   * @param {string} [data.name]
   * @param {string} data.phone
   * @param {boolean} data.admin
   * @param {number} [data.citizenship_num]
   * @param {string} [data.district]
   * @param {string} [data.city]
   * @param {number} [data.ward_num]
   */
  constructor(data) {
    this.id = data.id;
    this.name = data.name || null;
    this.phone = data.phone;
    this.admin = data.admin;
    this.citizenship_num = data.citizenship_num || null;
    this.district = data.district || null;
    this.city = data.city || null;
    this.ward_num = data.ward_num || null;
  }
}

// ==================== CITIZENSHIP MODELS ====================

/**
 * Citizenship Base Model
 * @class
 */
class CitizenshipBase {
  /**
   * @param {Object} data
   * @param {string} data.phone
   * @param {string} data.path
   * @param {string} [data.status] - "approved", "pending", "rejected"
   */
  constructor(data) {
    this.phone = data.phone;
    this.path = data.path;
    this.status = data.status || "pending";
  }
}

/**
 * Citizenship Model (full)
 * @class
 */
class Citizenship extends CitizenshipBase {
  /**
   * @param {Object} data
   * @param {number} [data.id]
   * @param {string} data.phone
   * @param {string} data.path
   * @param {string} [data.status]
   */
  constructor(data) {
    super(data);
    this.id = data.id || null;
  }
}

// ==================== PROJECT MODELS ====================

/**
 * Project Status Enum
 * @enum {string}
 */
const ProjectStatus = {
  SOON: "soon",
  ONGOING: "ongoing",
  COMPLETED: "completed",
  DELAYED: "delayed",
};

/**
 * Project Type Enum
 * @enum {string}
 */
const ProjectType = {
  GOV_FUNDED: "Gov-funded",
  COMMUNITY_FUNDED: "Community-funded",
};

/**
 * Project Base Model
 * @class
 */
class ProjectBase {
  /**
   * @param {Object} data
   * @param {string} data.title
   * @param {string} data.type - ProjectType.GOV_FUNDED or ProjectType.COMMUNITY_FUNDED
   * @param {string} [data.description]
   * @param {number} data.ward_num
   * @param {string} data.district
   * @param {string} data.city
   * @param {string} data.contractor - phone number
   * @param {string} data.contractor_name - name
   * @param {number} [data.total_budget]
   * @param {number} [data.budget_utilized]
   * @param {string} [data.deadline] - ISO date string
   * @param {number} [data.fundraised]
   * @param {string} [data.status] - ProjectStatus
   */
  constructor(data) {
    this.title = data.title;
    this.type = data.type;
    this.description = data.description || null;
    this.ward_num = data.ward_num;
    this.district = data.district;
    this.city = data.city;
    this.contractor = data.contractor;
    this.contractor_name = data.contractor_name;
    this.total_budget = data.total_budget || 0.0;
    this.budget_utilized = data.budget_utilized || 0.0;
    this.deadline = data.deadline
      ? new Date(data.deadline).toISOString().split("T")[0]
      : null;
    this.fundraised = data.fundraised || 0.0;
    this.status = data.status || ProjectStatus.SOON;
  }
}

/**
 * Project Model (full)
 * @class
 */
class Project extends ProjectBase {
  /**
   * @param {Object} data
   * @param {string} [data.id] - UUID
   * @param {string} [data.created_at] - ISO datetime string
   * @param {string} data.title
   * @param {string} data.type
   * @param {string} [data.description]
   * @param {number} data.ward_num
   * @param {string} data.district
   * @param {string} data.city
   * @param {string} data.contractor
   * @param {string} data.contractor_name
   * @param {number} [data.total_budget]
   * @param {number} [data.budget_utilized]
   * @param {string} [data.deadline]
   * @param {number} [data.fundraised]
   * @param {string} [data.status]
   */
  constructor(data) {
    super(data);
    this.id = data.id || this.generateUUID();
    this.created_at = data.created_at || new Date().toISOString();
  }

  generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }
}

/**
 * Project Update Model (for PATCH operations)
 * @class
 */
class ProjectUpdate {
  /**
   * @param {Object} data
   * @param {string} data.contractor - phone number
   * @param {number} [data.budget_utilized]
   * @param {string} [data.status]
   * @param {string} [data.deadline] - ISO date string
   * @param {number} [data.fundraised]
   */
  constructor(data) {
    this.contractor = data.contractor;
    this.budget_utilized = data.budget_utilized || null;
    this.status = data.status || null;
    this.deadline = data.deadline
      ? new Date(data.deadline).toISOString().split("T")[0]
      : null;
    this.fundraised = data.fundraised || null;
  }
}

// ==================== MILESTONE MODELS ====================

/**
 * Milestone Base Model
 * @class
 */
class MilestoneBase {
  /**
   * @param {Object} data
   * @param {string} [data.project_id]
   * @param {string} [data.description]
   * @param {string} [data.due_date] - ISO date string
   * @param {boolean} [data.completed]
   * @param {string} [data.completed_at] - ISO datetime string
   * @param {string[]} [data.photo_urls]
   */
  constructor(data) {
    this.project_id = data.project_id || null;
    this.description = data.description || null;
    this.due_date = data.due_date
      ? new Date(data.due_date).toISOString().split("T")[0]
      : null;
    this.completed = data.completed || false;
    this.completed_at = data.completed_at || null;
    this.photo_urls = data.photo_urls || [];
  }
}

/**
 * Milestone Model (full)
 * @class
 */
class Milestone extends MilestoneBase {
  /**
   * @param {Object} data
   * @param {string} [data.id] - UUID
   * @param {string} [data.project_id]
   * @param {string} [data.description]
   * @param {string} [data.due_date]
   * @param {boolean} [data.completed]
   * @param {string} [data.completed_at]
   * @param {string[]} [data.photo_urls]
   */
  constructor(data) {
    super(data);
    this.id = data.id || this.generateUUID();
  }

  generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }
}

/**
 * Milestone Update Model (for PATCH operations)
 * @class
 */
class MilestoneUpdate {
  /**
   * @param {Object} data
   * @param {boolean} [data.completed]
   * @param {string} [data.completed_at] - ISO datetime string
   * @param {string[]} [data.photo_urls]
   */
  constructor(data) {
    this.completed = data.completed || false;
    this.completed_at = data.completed_at || null;
    this.photo_urls = data.photo_urls || [];
  }
}

// ==================== EXPENDITURE MODELS ====================

/**
 * Expenditure Base Model
 * @class
 */
class ExpenditureBase {
  /**
   * @param {Object} data
   * @param {string} data.project_id
   * @param {string} [data.description]
   * @param {number} data.amount
   * @param {string} data.spent_on - ISO date string
   * @param {string} [data.bill_url]
   */
  constructor(data) {
    this.project_id = data.project_id;
    this.description = data.description || null;
    this.amount = data.amount;
    this.spent_on = new Date(data.spent_on).toISOString().split("T")[0];
    this.bill_url = data.bill_url || null;
  }
}

/**
 * Expenditure Model (full)
 * @class
 */
class Expenditure extends ExpenditureBase {
  /**
   * @param {Object} data
   * @param {string} [data.id] - UUID
   * @param {string} [data.created_at] - ISO datetime string
   * @param {string} data.project_id
   * @param {string} [data.description]
   * @param {number} data.amount
   * @param {string} data.spent_on
   * @param {string} [data.bill_url]
   */
  constructor(data) {
    super(data);
    this.id = data.id || this.generateUUID();
    this.created_at = data.created_at || new Date().toISOString();
  }

  generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }
}

// ==================== ISSUE MODELS ====================

/**
 * Issue Status Enum
 * @enum {string}
 */
const IssueStatus = {
  PENDING: "pending",
  REVIEWED: "reviewed",
  RESOLVED: "resolved",
};

/**
 * Issue Base Model
 * @class
 */
class IssueBase {
  /**
   * @param {Object} data
   * @param {string} data.project_id
   * @param {string} data.reason
   * @param {string[]} [data.proof_urls]
   * @param {string} [data.user_id]
   * @param {boolean} [data.anonymous]
   */
  constructor(data) {
    this.project_id = data.project_id;
    this.reason = data.reason;
    this.proof_urls = data.proof_urls || [];
    this.user_id = data.user_id || null;
    this.anonymous = data.anonymous || false;
  }
}

/**
 * Issue Model (full)
 * @class
 */
class Issue extends IssueBase {
  /**
   * @param {Object} data
   * @param {string} [data.id] - UUID
   * @param {string} [data.created_at] - ISO datetime string
   * @param {string} [data.status] - IssueStatus
   * @param {string} data.project_id
   * @param {string} data.reason
   * @param {string[]} [data.proof_urls]
   * @param {string} [data.user_id]
   * @param {boolean} [data.anonymous]
   */
  constructor(data) {
    super(data);
    this.id = data.id || this.generateUUID();
    this.created_at = data.created_at || new Date().toISOString();
    this.status = data.status || IssueStatus.PENDING;
  }

  generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }
}

/**
 * Issue Update Status Model (for PATCH operations)
 * @class
 */
class IssueUpdateStatus {
  /**
   * @param {Object} data
   * @param {string} data.status - IssueStatus
   */
  constructor(data) {
    this.status = data.status;
  }
}

// ==================== ADD TO WINDOW OBJECT ====================

// For non-module environments (simple script tag)
if (typeof window !== "undefined") {
  window.Models = {
    User,
    UserPublic,
    CitizenshipBase,
    Citizenship,
    ProjectStatus,
    ProjectType,
    ProjectBase,
    Project,
    ProjectUpdate,
    MilestoneBase,
    Milestone,
    MilestoneUpdate,
    ExpenditureBase,
    Expenditure,
    IssueStatus,
    IssueBase,
    Issue,
    IssueUpdateStatus,
  };

  console.log("✅ models.js loaded - window.Models created");
}
