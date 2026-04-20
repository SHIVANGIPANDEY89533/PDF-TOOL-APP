from main import app

print("=" * 50)
print("Registered Routes:")
print("=" * 50)
for route in app.routes:
    print(f"{route.path} - {route.methods if hasattr(route, 'methods') else 'N/A'}")
print("=" * 50)
