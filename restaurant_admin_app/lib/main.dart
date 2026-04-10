import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

import 'providers/auth_provider.dart';
import 'providers/menu_provider.dart';
import 'providers/orders_provider.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => MenuProvider()),
        ChangeNotifierProvider(create: (_) => OrdersProvider()),
      ],
      child: const AdminApp(),
    ),
  );
}

class AdminApp extends StatefulWidget {
  const AdminApp({super.key});

  @override
  State<AdminApp> createState() => _AdminAppState();
}

class _AdminAppState extends State<AdminApp> {
  late final GoRouter _router;

  @override
  void initState() {
    super.initState();
    final authProvider = context.read<AuthProvider>();

    _router = GoRouter(
      initialLocation: '/dashboard',
      refreshListenable: authProvider,
      redirect: (context, state) {
        final isLoggingIn = state.matchedLocation == '/login';
        
        // Wait for auth initialization
        if (authProvider.isLoading) return null;

        if (!authProvider.isAuthenticated && !isLoggingIn) {
          return '/login';
        }
        
        if (authProvider.isAuthenticated && isLoggingIn) {
          return '/dashboard';
        }
        
        return null;
      },
      routes: [
        GoRoute(
          path: '/login',
          builder: (context, state) => const LoginScreen(),
        ),
        GoRoute(
          path: '/dashboard',
          builder: (context, state) => const DashboardScreen(),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    if (context.watch<AuthProvider>().isLoading) {
      return const MaterialApp(
        home: Scaffold(
          body: Center(child: CircularProgressIndicator()),
        ),
      );
    }

    return MaterialApp.router(
      title: 'Restaurant Admin',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.redAccent,
          primary: Colors.red[800]!,
        ),
        useMaterial3: true,
      ),
      routerConfig: _router,
    );
  }
}
