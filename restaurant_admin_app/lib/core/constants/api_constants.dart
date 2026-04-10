class ApiConstants {
  // Use the exact same backend API as the Next.js app
  static const String baseUrl = 'https://pos-backend-s380.onrender.com';
  
  // Endpoint definitions mirror the Next.js api.config.ts
  static const String adminLogin = '/api/admin/login';
  static const String adminLogout = '/api/admin/logout';
  static const String adminProfile = '/api/admin/profile';
  static const String adminMe = '/api/admin/me';
  
  static const String adminTables = '/api/admin/tables';
  
  // Menu Routes
  static const String menuCategories = '/api/admin/menu/categories';
  static const String menuItems = '/api/admin/menu/items';
  static String menuItemById(String id) => '/api/admin/menu/items/$id';
  static String toggleMenuItem(String id) => '/api/admin/menu/items/$id/toggle';
  
  // Orders Routes
  static const String ordersList = '/api/admin/orders';
  static String orderDetails(String id) => '/api/admin/orders/$id';
}
