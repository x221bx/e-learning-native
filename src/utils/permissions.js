/**
 * Role-based Permission System
 * Defines what each role can do in the application
 */

export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  GUEST: 'guest',
};

export const PERMISSIONS = {
  // Course Management
  VIEW_ALL_COURSES: 'view_all_courses',
  VIEW_OWN_COURSES: 'view_own_courses',
  CREATE_COURSE: 'create_course',
  EDIT_OWN_COURSE: 'edit_own_course',
  EDIT_ANY_COURSE: 'edit_any_course',
  DELETE_OWN_COURSE: 'delete_own_course',
  DELETE_ANY_COURSE: 'delete_any_course',
  APPROVE_COURSE: 'approve_course',
  
  // User Management
  VIEW_USERS: 'view_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  CHANGE_USER_ROLE: 'change_user_role',
  APPROVE_TEACHER: 'approve_teacher',
  
  // Enrollment
  ENROLL_COURSE: 'enroll_course',
  UNENROLL_COURSE: 'unenroll_course',
  VIEW_ENROLLED_COURSES: 'view_enrolled_courses',
  
  // Wishlist
  ADD_TO_WISHLIST: 'add_to_wishlist',
  REMOVE_FROM_WISHLIST: 'remove_from_wishlist',
  
  // Content Access
  VIEW_COURSE_CONTENT: 'view_course_content',
  VIEW_STUDENTS: 'view_students',
  
  // Statistics
  VIEW_ALL_STATISTICS: 'view_all_statistics',
  VIEW_OWN_STATISTICS: 'view_own_statistics',
};

// Role Permissions Mapping
const rolePermissions = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_ALL_COURSES,
    PERMISSIONS.CREATE_COURSE,
    PERMISSIONS.EDIT_ANY_COURSE,
    PERMISSIONS.DELETE_ANY_COURSE,
    PERMISSIONS.APPROVE_COURSE,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.CHANGE_USER_ROLE,
    PERMISSIONS.APPROVE_TEACHER,
    PERMISSIONS.VIEW_ALL_STATISTICS,
    PERMISSIONS.VIEW_COURSE_CONTENT,
  ],
  
  [ROLES.TEACHER]: [
    PERMISSIONS.VIEW_ALL_COURSES,
    PERMISSIONS.VIEW_OWN_COURSES,
    PERMISSIONS.CREATE_COURSE,
    PERMISSIONS.EDIT_OWN_COURSE,
    PERMISSIONS.DELETE_OWN_COURSE,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.VIEW_OWN_STATISTICS,
    PERMISSIONS.VIEW_COURSE_CONTENT,
  ],
  
  [ROLES.STUDENT]: [
    PERMISSIONS.VIEW_ALL_COURSES,
    PERMISSIONS.ENROLL_COURSE,
    PERMISSIONS.UNENROLL_COURSE,
    PERMISSIONS.VIEW_ENROLLED_COURSES,
    PERMISSIONS.ADD_TO_WISHLIST,
    PERMISSIONS.REMOVE_FROM_WISHLIST,
    PERMISSIONS.VIEW_COURSE_CONTENT,
  ],
  
  [ROLES.GUEST]: [
    PERMISSIONS.VIEW_ALL_COURSES,
  ],
};

/**
 * Check if a user has a specific permission
 * @param {Object} user - User object with role property
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export function hasPermission(user, permission) {
  if (!user) return false;
  
  const userRole = user.role || ROLES.GUEST;
  const permissions = rolePermissions[userRole] || [];
  
  return permissions.includes(permission);
}

/**
 * Check if a user has any of the specified permissions
 * @param {Object} user - User object with role property
 * @param {Array<string>} permissions - Array of permissions to check
 * @returns {boolean}
 */
export function hasAnyPermission(user, permissions) {
  return permissions.some(permission => hasPermission(user, permission));
}

/**
 * Check if a user has all of the specified permissions
 * @param {Object} user - User object with role property
 * @param {Array<string>} permissions - Array of permissions to check
 * @returns {boolean}
 */
export function hasAllPermissions(user, permissions) {
  return permissions.every(permission => hasPermission(user, permission));
}

/**
 * Check if user can edit a specific course
 * @param {Object} user - User object
 * @param {Object} course - Course object
 * @returns {boolean}
 */
export function canEditCourse(user, course) {
  if (!user || !course) return false;
  
  // Admin can edit any course
  if (hasPermission(user, PERMISSIONS.EDIT_ANY_COURSE)) {
    return true;
  }
  
  // Teacher can edit own courses
  if (hasPermission(user, PERMISSIONS.EDIT_OWN_COURSE)) {
    return course.teacherId === user.id;
  }
  
  return false;
}

/**
 * Check if user can delete a specific course
 * @param {Object} user - User object
 * @param {Object} course - Course object
 * @returns {boolean}
 */
export function canDeleteCourse(user, course) {
  if (!user || !course) return false;
  
  // Admin can delete any course
  if (hasPermission(user, PERMISSIONS.DELETE_ANY_COURSE)) {
    return true;
  }
  
  // Teacher can delete own courses
  if (hasPermission(user, PERMISSIONS.DELETE_OWN_COURSE)) {
    return course.teacherId === user.id;
  }
  
  return false;
}

/**
 * Get user role display name
 * @param {string} role - Role identifier
 * @returns {string}
 */
export function getRoleDisplayName(role) {
  const roleNames = {
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.TEACHER]: 'Teacher',
    [ROLES.STUDENT]: 'Student',
    [ROLES.GUEST]: 'Guest',
  };
  
  return roleNames[role] || 'Unknown';
}

/**
 * Get available navigation items based on user role
 * @param {Object} user - User object
 * @returns {Array}
 */
export function getNavigationItems(user) {
  const role = user?.role || ROLES.GUEST;
  
  const navigationMap = {
    [ROLES.ADMIN]: [
      { name: 'Home', icon: 'home', route: 'Home' },
      { name: 'Admin', icon: 'settings', route: 'Admin' },
      { name: 'Courses', icon: 'book', route: 'AdminCourses' },
      { name: 'Users', icon: 'people', route: 'AdminUsers' },
      { name: 'Statistics', icon: 'stats-chart', route: 'AdminStats' },
      { name: 'Profile', icon: 'person', route: 'Profile' },
    ],
    
    [ROLES.TEACHER]: [
      { name: 'Home', icon: 'home', route: 'Home' },
      { name: 'Dashboard', icon: 'grid', route: 'TeacherDashboard' },
      { name: 'My Courses', icon: 'book', route: 'TeacherCourses' },
      { name: 'Add Course', icon: 'add-circle', route: 'AddCourse' },
      { name: 'Students', icon: 'people', route: 'MyStudents' },
      { name: 'Profile', icon: 'person', route: 'Profile' },
    ],
    
    [ROLES.STUDENT]: [
      { name: 'Home', icon: 'home', route: 'Home' },
      { name: 'Search', icon: 'search', route: 'Search' },
      { name: 'My Courses', icon: 'book', route: 'MyCourses' },
      { name: 'Wishlist', icon: 'heart', route: 'Wishlist' },
      { name: 'Profile', icon: 'person', route: 'Profile' },
    ],
    
    [ROLES.GUEST]: [
      { name: 'Home', icon: 'home', route: 'Home' },
      { name: 'Search', icon: 'search', route: 'Search' },
      { name: 'Login', icon: 'log-in', route: 'Login' },
    ],
  };
  
  return navigationMap[role] || navigationMap[ROLES.GUEST];
}

/**
 * Check if user is guest
 * @param {Object} user - User object
 * @param {boolean} isGuest - Guest flag from auth state
 * @returns {boolean}
 */
export function isGuestUser(user, isGuest) {
  return !user && isGuest;
}

/**
 * Get dashboard route based on user role
 * @param {Object} user - User object
 * @returns {string}
 */
export function getDashboardRoute(user) {
  if (!user) return 'Home';
  
  const dashboardMap = {
    [ROLES.ADMIN]: 'AdminDashboard',
    [ROLES.TEACHER]: 'TeacherDashboard',
    [ROLES.STUDENT]: 'StudentDashboard',
  };
  
  return dashboardMap[user.role] || 'Home';
}
