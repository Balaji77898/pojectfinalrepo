import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api_constants.dart';

class ApiService {
  static const String tokenKey = 'admin_auth_token';

  Future<Map<String, String>> _buildHeaders(bool requiresAuth) async {
    final Map<String, String> headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    };

    if (requiresAuth) {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString(tokenKey);
      
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
        // Backend compatibility headers matching original Next.js codebase 
        headers['x-access-token'] = token;
        headers['x-auth-token'] = token;
      }
    }
    return headers;
  }

  Future<dynamic> post(String endpoint, {Map<String, dynamic>? body, bool requiresAuth = true}) async {
    final url = Uri.parse('${ApiConstants.baseUrl}$endpoint');
    final headers = await _buildHeaders(requiresAuth);

    try {
      final response = await http.post(
        url,
        headers: headers,
        body: body != null ? jsonEncode(body) : null,
      );
      
      return _handleResponse(response);
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  Future<dynamic> get(String endpoint, {bool requiresAuth = true}) async {
    final url = Uri.parse('${ApiConstants.baseUrl}$endpoint');
    final headers = await _buildHeaders(requiresAuth);

    try {
      final response = await http.get(url, headers: headers);
      return _handleResponse(response);
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isNotEmpty) {
        return jsonDecode(response.body);
      }
      return null;
    } else {
      dynamic errorBody;
      try {
        errorBody = jsonDecode(response.body);
      } catch (_) {
        errorBody = response.body;
      }
      throw Exception(
        errorBody is Map && errorBody['message'] != null 
          ? errorBody['message'] 
          : 'HTTP Error: ${response.statusCode}'
      );
    }
  }
}
