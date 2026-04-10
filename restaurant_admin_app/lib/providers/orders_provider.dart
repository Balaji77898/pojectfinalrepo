import 'package:flutter/material.dart';
import '../core/models/order_models.dart';
import '../core/services/orders_service.dart';

class OrdersProvider extends ChangeNotifier {
  final OrdersService _ordersService = OrdersService();
  
  List<Order> _orders = [];
  OrderDetails? _selectedOrder;
  bool _isLoading = false;
  String? _error;

  List<Order> get orders => _orders;
  OrderDetails? get selectedOrder => _selectedOrder;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchOrders() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _orders = await _ordersService.getOrdersList();
      // Sort newest first
      _orders.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    } catch (e) {
      _error = 'Failed to load orders: \$e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchOrderDetails(String id) async {
    _isLoading = true;
    notifyListeners();

    try {
      _selectedOrder = await _ordersService.getOrderDetails(id);
    } catch (e) {
      _error = 'Failed to load order details: \$e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearSelection() {
    _selectedOrder = null;
    notifyListeners();
  }
}
