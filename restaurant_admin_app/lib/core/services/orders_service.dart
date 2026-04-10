import '../models/order_models.dart';
import 'api_service.dart';
import '../constants/api_constants.dart';

class OrdersService {
  final ApiService _apiService = ApiService();

  Future<List<Order>> getOrdersList() async {
    final response = await _apiService.get(ApiConstants.ordersList);
    final List data = response is List ? response : response['data'] ?? [];
    return data.map((json) => Order.fromJson(json)).toList();
  }

  Future<OrderDetails> getOrderDetails(String id) async {
    final response = await _apiService.get(ApiConstants.orderDetails(id));
    final Map<String, dynamic> data = response['data'] ?? response;
    return OrderDetails.fromJson(data);
  }
}
