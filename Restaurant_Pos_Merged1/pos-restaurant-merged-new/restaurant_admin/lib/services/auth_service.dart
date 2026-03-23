import 'package:shared_preferences/shared_preferences.dart';
import 'package:restaurant_admin/services/api_service.dart';
import 'package:restaurant_admin/core/constants.dart';

class AuthService {
  /// Login — calls backend directly (no Next.js proxy needed in Flutter)
  static Future<Map<String, dynamic>> login(
      String email, String password) async {
    final response = await ApiService.post(
      ApiEndpoints.login,
      {'email': email, 'password': password},
      requiresAuth: false,
    );
    final data = response as Map<String, dynamic>;
    final token = data['token'] as String?;
    if (token == null || token.isEmpty) {
      throw Exception('No token received from server');
    }
    // Persist token
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(kTokenKey, token);
    // Build user object
    final user = data['user'] as Map<String, dynamic>? ?? {'email': email};
    await prefs.setString(kUserKey, email);
    return {'token': token, 'user': user};
  }

  /// Logout — clear storage
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(kTokenKey);
    await prefs.remove(kUserKey);
  }

  /// Get stored token
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(kTokenKey);
  }

  /// Validate session with backend
  static Future<Map<String, dynamic>?> validateSession() async {
    try {
      final data = await ApiService.get(ApiEndpoints.me, requiresAuth: true);
      return data as Map<String, dynamic>?;
    } catch (_) {
      return null;
    }
  }
}
