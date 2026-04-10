import 'package:flutter/material.dart';
import '../core/models/menu_models.dart';
import '../core/services/menu_service.dart';

class MenuProvider extends ChangeNotifier {
  final MenuService _menuService = MenuService();
  
  List<Category> _categories = [];
  List<MenuItem> _items = [];
  bool _isLoading = false;
  String? _error;

  List<Category> get categories => _categories;
  List<MenuItem> get items => _items;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadMenuData() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final futures = await Future.wait([
        _menuService.getCategories(),
        _menuService.getMenuItems(),
      ]);
      _categories = futures[0] as List<Category>;
      _items = futures[1] as List<MenuItem>;
    } catch (e) {
      _error = 'Failed to load menu: \$e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> toggleItemAvailability(String id) async {
    final index = _items.indexWhere((item) => item.id == id);
    if (index == -1) return;

    // Optimistic UI update
    final oldItem = _items[index];
    _items[index] = MenuItem(
      id: oldItem.id,
      name: oldItem.name,
      price: oldItem.price,
      categoryId: oldItem.categoryId,
      isAvailable: !oldItem.isAvailable,
      description: oldItem.description,
      imageUrl: oldItem.imageUrl,
    );
    notifyListeners();

    try {
      final updatedItem = await _menuService.toggleItemAvailability(id);
      _items[index] = updatedItem;
      notifyListeners();
    } catch (e) {
      // Revert on failure
      _items[index] = oldItem;
      _error = 'Failed to toggle availability';
      notifyListeners();
    }
  }
}
