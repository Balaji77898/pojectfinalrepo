enum OrderType { dineIn, takeaway, delivery }
enum OrderStatus { pending, confirmed, preparing, ready, completed, cancelled }
enum PaymentStatus { pending, paid, failed }

OrderType parseOrderType(String type) {
  switch (type.toUpperCase()) {
    case 'TAKEAWAY': return OrderType.takeaway;
    case 'DELIVERY': return OrderType.delivery;
    case 'DINE_IN':
    default:
      return OrderType.dineIn;
  }
}

OrderStatus parseOrderStatus(String status) {
  switch (status.toUpperCase()) {
    case 'CONFIRMED': return OrderStatus.confirmed;
    case 'PREPARING': return OrderStatus.preparing;
    case 'READY': return OrderStatus.ready;
    case 'COMPLETED': return OrderStatus.completed;
    case 'CANCELLED': return OrderStatus.cancelled;
    case 'PENDING':
    default:
      return OrderStatus.pending;
  }
}

PaymentStatus parsePaymentStatus(String status) {
  switch (status.toUpperCase()) {
    case 'PAID': return PaymentStatus.paid;
    case 'FAILED': return PaymentStatus.failed;
    case 'PENDING':
    default:
      return PaymentStatus.pending;
  }
}

class OrderItem {
  final String id;
  final String menuItemId;
  final String name;
  final int quantity;
  final double price;
  final double subtotal;

  OrderItem({
    required this.id,
    required this.menuItemId,
    required this.name,
    required this.quantity,
    required this.price,
    required this.subtotal,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      id: json['id'] as String,
      menuItemId: json['menu_item_id'] as String,
      name: json['name'] as String,
      quantity: json['quantity'] as int,
      price: (json['price'] as num).toDouble(),
      subtotal: (json['subtotal'] as num).toDouble(),
    );
  }
}

class Order {
  final String id;
  final OrderType orderType;
  final OrderStatus status;
  final double totalAmount;
  final PaymentStatus paymentStatus;
  final String? paymentMethod;
  final String createdAt;
  final String? updatedAt;

  Order({
    required this.id,
    required this.orderType,
    required this.status,
    required this.totalAmount,
    required this.paymentStatus,
    this.paymentMethod,
    required this.createdAt,
    this.updatedAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'] as String,
      orderType: parseOrderType(json['order_type'] as String),
      status: parseOrderStatus(json['status'] as String),
      totalAmount: (json['total_amount'] as num).toDouble(),
      paymentStatus: parsePaymentStatus(json['payment_status'] as String),
      paymentMethod: json['payment_method'] as String?,
      createdAt: json['created_at'] as String,
      updatedAt: json['updated_at'] as String?,
    );
  }
}

class OrderDetails extends Order {
  final List<OrderItem> items;
  final double subtotal;
  final double tax;

  OrderDetails({
    required super.id,
    required super.orderType,
    required super.status,
    required super.totalAmount,
    required super.paymentStatus,
    super.paymentMethod,
    required super.createdAt,
    super.updatedAt,
    required this.items,
    required this.subtotal,
    required this.tax,
  });

  factory OrderDetails.fromJson(Map<String, dynamic> json) {
    final order = Order.fromJson(json);
    
    var itemsList = <OrderItem>[];
    if (json['items'] != null) {
      itemsList = (json['items'] as List)
          .map((item) => OrderItem.fromJson(item as Map<String, dynamic>))
          .toList();
    }

    return OrderDetails(
      id: order.id,
      orderType: order.orderType,
      status: order.status,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: itemsList,
      subtotal: (json['subtotal'] as num).toDouble(),
      tax: (json['tax'] as num).toDouble(),
    );
  }
}
