class Category {
  final String id;
  final String name;
  final String? description;
  final int? displayOrder;
  final String? createdAt;
  final String? updatedAt;

  Category({
    required this.id,
    required this.name,
    this.description,
    this.displayOrder,
    this.createdAt,
    this.updatedAt,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      displayOrder: json['display_order'] as int?,
      createdAt: json['created_at'] as String?,
      updatedAt: json['updated_at'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'display_order': displayOrder,
      'created_at': createdAt,
      'updated_at': updatedAt,
    };
  }
}

class MenuItem {
  final String id;
  final String name;
  final String? description;
  final double price;
  final String categoryId;
  final bool isAvailable;
  final String? imageUrl;
  final int? preparationTime;
  final String? createdAt;
  final String? updatedAt;

  MenuItem({
    required this.id,
    required this.name,
    required this.price,
    required this.categoryId,
    required this.isAvailable,
    this.description,
    this.imageUrl,
    this.preparationTime,
    this.createdAt,
    this.updatedAt,
  });

  factory MenuItem.fromJson(Map<String, dynamic> json) {
    return MenuItem(
      id: json['id'] as String,
      name: json['name'] as String,
      price: (json['price'] as num).toDouble(),
      categoryId: json['category_id'] as String,
      isAvailable: json['is_available'] as bool? ?? false,
      description: json['description'] as String?,
      imageUrl: json['image_url'] as String?,
      preparationTime: json['preparation_time'] as int?,
      createdAt: json['created_at'] as String?,
      updatedAt: json['updated_at'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'price': price,
      'category_id': categoryId,
      'is_available': isAvailable,
      'description': description,
      'image_url': imageUrl,
      'preparation_time': preparationTime,
    };
  }
}
