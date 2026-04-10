import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';
import '../constants/api_constants.dart';

class AuthService {
  final ApiService _apiService = ApiService();
  static const String tokenKey = 'admin_auth_token';
  static const String userKey = 'admin_user_data';

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _apiService.post(
      ApiConstants.adminLogin,
      body: {'email': email, 'password': password},
      requiresAuth: false,
    );

    // Extract token
    String? token = response['token'] ?? 
        response['accessToken'] ?? 
        response['data']?['token'] ?? 
        response['user']?['token'];

    if (token != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(tokenKey, token);
    }

    // Extract user data
    dynamic userData = response['data'] ?? response['user'] ?? response['staff'] ?? response;
    if (userData != null && userData is Map<String, dynamic>) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(userKey, jsonEncode(userData));
    }

    return response;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(tokenKey);
    await prefs.remove(userKey);
  }

  Future<bool> isAuthenticated() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.containsKey(tokenKey);
  }

  Future<Map<String, dynamic>?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString(userKey);
    if (userStr != null) {
      return jsonDecode(userStr);
    }
    return null;
  }

  Future<Map<String, dynamic>?> validateSession() async {
    final isAuthenticatedLocally = await isAuthenticated();
    if (!isAuthenticatedLocally) return null;

    try {
      final response = await _apiService.get(ApiConstants.adminMe, requiresAuth: true);
      
      final userData = response['data'] ?? response['user'] ?? response;
      if (userData != null && userData is Map<String, dynamic>) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(userKey, jsonEncode(userData));
        return userData;
      }
      return null;
    } catch (e) {
      print('Session validation error: $e');
      await logout();
      return null;
    }
  }
}
