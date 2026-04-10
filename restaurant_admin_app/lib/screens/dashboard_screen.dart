import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/menu_provider.dart';
import '../providers/orders_provider.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    // Pre-fetch data for tabs
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<MenuProvider>().loadMenuData();
      context.read<OrdersProvider>().fetchOrders();
    });
  }

  static const List<Widget> _widgetOptions = <Widget>[
    Center(child: Text('Home Metrics Placeholder')),
    _MenuTab(),
    _OrdersTab(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Dashboard'),
        actions: [
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Text(user?['name'] ?? 'Admin', style: const TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => context.read<AuthProvider>().logout(),
          ),
        ],
      ),
      body: _widgetOptions.elementAt(_selectedIndex),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.restaurant_menu),
            label: 'Menu',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.receipt_long),
            label: 'Orders',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.red[800],
        onTap: _onItemTapped,
      ),
    );
  }
}

class _MenuTab extends StatelessWidget {
  const _MenuTab();

  @override
  Widget build(BuildContext context) {
    return Consumer<MenuProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading && provider.items.isEmpty) {
          return const Center(child: CircularProgressIndicator());
        }
        
        return Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Menu Items (\${provider.items.length})', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  ElevatedButton(
                    onPressed: () {}, 
                    child: const Text('Add Item')
                  ),
                ],
              ),
            ),
            Expanded(
              child: ListView.builder(
                itemCount: provider.items.length,
                itemBuilder: (context, index) {
                  final item = provider.items[index];
                  return ListTile(
                    leading: const Icon(Icons.fastfood),
                    title: Text(item.name),
                    subtitle: Text('\$\${item.price.toStringAsFixed(2)}'),
                    trailing: Switch(
                      value: item.isAvailable,
                      onChanged: (_) => provider.toggleItemAvailability(item.id),
                    ),
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }
}

class _OrdersTab extends StatelessWidget {
  const _OrdersTab();

  @override
  Widget build(BuildContext context) {
    return Consumer<OrdersProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading && provider.orders.isEmpty) {
          return const Center(child: CircularProgressIndicator());
        }
        
        return Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text('Recent Orders (\${provider.orders.length})', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            ),
            Expanded(
              child: ListView.builder(
                itemCount: provider.orders.length,
                itemBuilder: (context, index) {
                  final order = provider.orders[index];
                  return Card(
                    margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: ListTile(
                      leading: Icon(
                        order.orderType.name == 'dineIn' ? Icons.table_restaurant : Icons.takeout_dining,
                        color: Colors.blueGrey,
                      ),
                      title: Text('Order \${order.id.substring(0, 8).toUpperCase()}'),
                      subtitle: Text('\${order.status.name.toUpperCase()} • \$\${order.totalAmount.toStringAsFixed(2)}'),
                      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                      onTap: () {
                         // Scaffold route to detail.
                      },
                    ),
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }
}
