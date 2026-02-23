#!/usr/bin/env python3
"""
SpendWise Premium Backend API Tests
Tests all backend endpoints according to the review request requirements.
"""

import requests
import json
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List
import sys

# Backend URL from frontend environment
BACKEND_URL = "https://fintech-track-app.preview.emergentagent.com/api"

class BackendTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.user_id = None
        self.category_id = None
        self.expense_id = None
        self.budget_id = None
        self.test_results = []
        
    def log_result(self, endpoint: str, success: bool, message: str, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "endpoint": endpoint,
            "success": success,
            "message": message,
            "details": details,
            "status": status
        }
        self.test_results.append(result)
        print(f"{status} {endpoint}: {message}")
        if details:
            print(f"    Details: {details}")
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, params: Dict = None) -> tuple:
        """Make HTTP request and return response and success status"""
        url = f"{self.base_url}{endpoint}"
        try:
            if method.upper() == "GET":
                response = requests.get(url, params=params, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, timeout=30)
            else:
                return None, False, f"Unsupported method: {method}"
            
            return response, True, ""
        except requests.exceptions.ConnectionError:
            return None, False, "Connection error - backend might be down"
        except requests.exceptions.Timeout:
            return None, False, "Request timeout"
        except Exception as e:
            return None, False, f"Request failed: {str(e)}"
    
    def test_health_check(self):
        """Test health endpoint"""
        print("\n=== HEALTH CHECK ===")
        response, success, error = self.make_request("GET", "/health")
        
        if not success:
            self.log_result("/health", False, "Health check failed", error)
            return False
        
        if response.status_code == 200:
            data = response.json()
            if "status" in data and data["status"] == "healthy":
                self.log_result("/health", True, "Health check passed")
                return True
            else:
                self.log_result("/health", False, "Health status not healthy", str(data))
                return False
        else:
            self.log_result("/health", False, f"Health check failed with status {response.status_code}", response.text[:200])
            return False
    
    def test_user_management(self):
        """Test all user management endpoints"""
        print("\n=== USER MANAGEMENT TESTS ===")
        
        # 1. Create user with guest mode
        print("\n1. Testing user creation (guest mode)...")
        user_data = {
            "provider": "guest",
            "display_name": "Test User SpendWise",
            "email": "test@spendwise.ro"
        }
        
        response, success, error = self.make_request("POST", "/users", user_data)
        if not success:
            self.log_result("POST /users", False, "Failed to create user", error)
            return False
        
        if response.status_code == 200:
            user = response.json()
            self.user_id = user.get("id")
            if self.user_id and user.get("provider") == "guest":
                self.log_result("POST /users", True, f"User created with ID: {self.user_id}")
            else:
                self.log_result("POST /users", False, "User created but missing ID or wrong provider", str(user))
                return False
        else:
            self.log_result("POST /users", False, f"User creation failed with status {response.status_code}", response.text[:200])
            return False
        
        # 2. Get user by ID
        print("\n2. Testing get user by ID...")
        response, success, error = self.make_request("GET", f"/users/{self.user_id}")
        if not success:
            self.log_result("GET /users/{user_id}", False, "Failed to get user", error)
            return False
        
        if response.status_code == 200:
            user = response.json()
            if user.get("id") == self.user_id:
                self.log_result("GET /users/{user_id}", True, "User retrieved successfully")
            else:
                self.log_result("GET /users/{user_id}", False, "Retrieved user ID mismatch", f"Expected: {self.user_id}, Got: {user.get('id')}")
                return False
        else:
            self.log_result("GET /users/{user_id}", False, f"Get user failed with status {response.status_code}", response.text[:200])
            return False
        
        # 3. Update user
        print("\n3. Testing user update...")
        update_data = {
            "display_name": "Updated Test User",
            "settings": {
                "currency": "RON",
                "theme": "dark",
                "budget_alerts": True
            }
        }
        
        response, success, error = self.make_request("PUT", f"/users/{self.user_id}", update_data)
        if not success:
            self.log_result("PUT /users/{user_id}", False, "Failed to update user", error)
            return False
        
        if response.status_code == 200:
            user = response.json()
            if user.get("display_name") == "Updated Test User":
                self.log_result("PUT /users/{user_id}", True, "User updated successfully")
            else:
                self.log_result("PUT /users/{user_id}", False, "User update didn't persist", str(user))
                return False
        else:
            self.log_result("PUT /users/{user_id}", False, f"User update failed with status {response.status_code}", response.text[:200])
            return False
        
        # 4. Export user data
        print("\n4. Testing user data export...")
        response, success, error = self.make_request("GET", f"/users/{self.user_id}/export")
        if not success:
            self.log_result("GET /users/{user_id}/export", False, "Failed to export user data", error)
            return False
        
        if response.status_code == 200:
            export_data = response.json()
            if "user" in export_data and "expenses" in export_data and "categories" in export_data:
                self.log_result("GET /users/{user_id}/export", True, "User data exported successfully")
            else:
                self.log_result("GET /users/{user_id}/export", False, "Export missing required fields", str(export_data))
                return False
        else:
            self.log_result("GET /users/{user_id}/export", False, f"Export failed with status {response.status_code}", response.text[:200])
            return False
        
        return True
    
    def test_categories(self):
        """Test all category endpoints"""
        print("\n=== CATEGORY TESTS ===")
        
        if not self.user_id:
            self.log_result("Categories", False, "No user_id available for category tests")
            return False
        
        # 1. Get all categories (should have 10 default Romanian categories)
        print("\n1. Testing get categories (should have default Romanian categories)...")
        response, success, error = self.make_request("GET", "/categories", params={"user_id": self.user_id})
        if not success:
            self.log_result("GET /categories", False, "Failed to get categories", error)
            return False
        
        if response.status_code == 200:
            categories = response.json()
            if len(categories) >= 10:
                # Check if we have Romanian category names
                romanian_names = ["Mâncare", "Transport", "Cumpărături", "Divertisment", "Sănătate"]
                found_romanian = any(cat.get("name") in romanian_names for cat in categories)
                if found_romanian:
                    self.log_result("GET /categories", True, f"Found {len(categories)} categories with Romanian names")
                    self.category_id = categories[0]["id"]  # Store first category for later tests
                else:
                    self.log_result("GET /categories", False, f"Found {len(categories)} categories but no Romanian names detected", str([cat.get("name") for cat in categories[:5]]))
                    return False
            else:
                self.log_result("GET /categories", False, f"Expected at least 10 categories, found {len(categories)}")
                return False
        else:
            self.log_result("GET /categories", False, f"Get categories failed with status {response.status_code}", response.text[:200])
            return False
        
        # 2. Create new category
        print("\n2. Testing category creation...")
        new_category = {
            "user_id": self.user_id,
            "name": "Test Category",
            "icon": "test-icon",
            "color": "#FF5733",
            "is_favorite": True,
            "order": 99
        }
        
        response, success, error = self.make_request("POST", "/categories", new_category)
        if not success:
            self.log_result("POST /categories", False, "Failed to create category", error)
            return False
        
        if response.status_code == 200:
            category = response.json()
            new_cat_id = category.get("id")
            if new_cat_id and category.get("name") == "Test Category":
                self.log_result("POST /categories", True, f"Category created with ID: {new_cat_id}")
            else:
                self.log_result("POST /categories", False, "Category created but missing expected data", str(category))
                return False
        else:
            self.log_result("POST /categories", False, f"Category creation failed with status {response.status_code}", response.text[:200])
            return False
        
        # 3. Update category
        print("\n3. Testing category update...")
        update_data = {
            "name": "Updated Test Category",
            "color": "#00FF00"
        }
        
        response, success, error = self.make_request("PUT", f"/categories/{new_cat_id}", update_data)
        if not success:
            self.log_result("PUT /categories/{category_id}", False, "Failed to update category", error)
            return False
        
        if response.status_code == 200:
            category = response.json()
            if category.get("name") == "Updated Test Category":
                self.log_result("PUT /categories/{category_id}", True, "Category updated successfully")
            else:
                self.log_result("PUT /categories/{category_id}", False, "Category update didn't persist", str(category))
                return False
        else:
            self.log_result("PUT /categories/{category_id}", False, f"Category update failed with status {response.status_code}", response.text[:200])
            return False
        
        # 4. Delete category (test last)
        print("\n4. Testing category deletion...")
        response, success, error = self.make_request("DELETE", f"/categories/{new_cat_id}")
        if not success:
            self.log_result("DELETE /categories/{category_id}", False, "Failed to delete category", error)
            return False
        
        if response.status_code == 200:
            self.log_result("DELETE /categories/{category_id}", True, "Category deleted successfully")
        else:
            self.log_result("DELETE /categories/{category_id}", False, f"Category deletion failed with status {response.status_code}", response.text[:200])
            return False
        
        return True
    
    def test_expenses(self):
        """Test all expense endpoints"""
        print("\n=== EXPENSE TESTS ===")
        
        if not self.user_id or not self.category_id:
            self.log_result("Expenses", False, "No user_id or category_id available for expense tests")
            return False
        
        # 1. Create expense
        print("\n1. Testing expense creation...")
        expense_data = {
            "user_id": self.user_id,
            "amount": 125.50,
            "category_id": self.category_id,
            "title": "Test Expense - Restaurant",
            "date": "2026-02-15",
            "payment_method": "card",
            "notes": "Test expense for SpendWise",
            "tags": ["test", "restaurant"]
        }
        
        response, success, error = self.make_request("POST", "/expenses", expense_data)
        if not success:
            self.log_result("POST /expenses", False, "Failed to create expense", error)
            return False
        
        if response.status_code == 200:
            expense = response.json()
            self.expense_id = expense.get("id")
            if self.expense_id and expense.get("amount") == 125.50:
                self.log_result("POST /expenses", True, f"Expense created with ID: {self.expense_id}")
            else:
                self.log_result("POST /expenses", False, "Expense created but missing expected data", str(expense))
                return False
        else:
            self.log_result("POST /expenses", False, f"Expense creation failed with status {response.status_code}", response.text[:200])
            return False
        
        # Create a few more expenses for testing filters
        for i in range(3):
            extra_expense = {
                "user_id": self.user_id,
                "amount": 50.0 + i * 25,
                "category_id": self.category_id,
                "title": f"Extra Expense {i+1}",
                "date": f"2026-02-{16+i:02d}",
                "payment_method": "cash" if i % 2 == 0 else "card"
            }
            self.make_request("POST", "/expenses", extra_expense)
        
        # 2. Get all expenses for user
        print("\n2. Testing get all expenses...")
        response, success, error = self.make_request("GET", "/expenses", params={"user_id": self.user_id})
        if not success:
            self.log_result("GET /expenses", False, "Failed to get expenses", error)
            return False
        
        if response.status_code == 200:
            expenses = response.json()
            if len(expenses) >= 1:
                self.log_result("GET /expenses", True, f"Retrieved {len(expenses)} expenses")
            else:
                self.log_result("GET /expenses", False, "No expenses found")
                return False
        else:
            self.log_result("GET /expenses", False, f"Get expenses failed with status {response.status_code}", response.text[:200])
            return False
        
        # 3. Test date filtering
        print("\n3. Testing expense filtering by date...")
        params = {
            "user_id": self.user_id,
            "start_date": "2026-02-01",
            "end_date": "2026-02-28"
        }
        response, success, error = self.make_request("GET", "/expenses", params=params)
        if not success:
            self.log_result("GET /expenses (date filter)", False, "Failed to filter expenses by date", error)
            return False
        
        if response.status_code == 200:
            filtered_expenses = response.json()
            self.log_result("GET /expenses (date filter)", True, f"Date filtering returned {len(filtered_expenses)} expenses")
        else:
            self.log_result("GET /expenses (date filter)", False, f"Date filtering failed with status {response.status_code}", response.text[:200])
            return False
        
        # 4. Update expense
        print("\n4. Testing expense update...")
        update_data = {
            "amount": 150.75,
            "title": "Updated Test Expense",
            "notes": "Updated notes"
        }
        
        response, success, error = self.make_request("PUT", f"/expenses/{self.expense_id}", update_data)
        if not success:
            self.log_result("PUT /expenses/{expense_id}", False, "Failed to update expense", error)
            return False
        
        if response.status_code == 200:
            expense = response.json()
            if expense.get("amount") == 150.75:
                self.log_result("PUT /expenses/{expense_id}", True, "Expense updated successfully")
            else:
                self.log_result("PUT /expenses/{expense_id}", False, "Expense update didn't persist", str(expense))
                return False
        else:
            self.log_result("PUT /expenses/{expense_id}", False, f"Expense update failed with status {response.status_code}", response.text[:200])
            return False
        
        # 5. Test bulk delete
        print("\n5. Testing bulk delete expenses...")
        # Get current expenses to delete some
        response, _, _ = self.make_request("GET", "/expenses", params={"user_id": self.user_id})
        if response and response.status_code == 200:
            expenses = response.json()
            if len(expenses) >= 2:
                expense_ids_to_delete = [exp["id"] for exp in expenses[:2]]
                bulk_delete_data = {"expense_ids": expense_ids_to_delete}
                
                response, success, error = self.make_request("POST", "/expenses/bulk-delete", bulk_delete_data)
                if not success:
                    self.log_result("POST /expenses/bulk-delete", False, "Failed to bulk delete expenses", error)
                    return False
                
                if response.status_code == 200:
                    result = response.json()
                    self.log_result("POST /expenses/bulk-delete", True, f"Bulk deleted expenses: {result.get('message')}")
                else:
                    self.log_result("POST /expenses/bulk-delete", False, f"Bulk delete failed with status {response.status_code}", response.text[:200])
                    return False
            else:
                self.log_result("POST /expenses/bulk-delete", True, "Skipped bulk delete - not enough expenses")
        
        # 6. Delete single expense
        print("\n6. Testing single expense deletion...")
        response, success, error = self.make_request("DELETE", f"/expenses/{self.expense_id}")
        if not success:
            self.log_result("DELETE /expenses/{expense_id}", False, "Failed to delete expense", error)
            return False
        
        if response.status_code == 200:
            self.log_result("DELETE /expenses/{expense_id}", True, "Expense deleted successfully")
        else:
            self.log_result("DELETE /expenses/{expense_id}", False, f"Expense deletion failed with status {response.status_code}", response.text[:200])
            return False
        
        return True
    
    def test_budgets(self):
        """Test all budget endpoints"""
        print("\n=== BUDGET TESTS ===")
        
        if not self.user_id:
            self.log_result("Budgets", False, "No user_id available for budget tests")
            return False
        
        # 1. Create budget
        print("\n1. Testing budget creation...")
        budget_data = {
            "user_id": self.user_id,
            "month": "2026-02",
            "total_budget": 5000.0,
            "category_budgets": []
        }
        
        response, success, error = self.make_request("POST", "/budgets", budget_data)
        if not success:
            self.log_result("POST /budgets", False, "Failed to create budget", error)
            return False
        
        if response.status_code == 200:
            budget = response.json()
            self.budget_id = budget.get("id")
            if self.budget_id and budget.get("total_budget") == 5000.0:
                self.log_result("POST /budgets", True, f"Budget created with ID: {self.budget_id}")
            else:
                self.log_result("POST /budgets", False, "Budget created but missing expected data", str(budget))
                return False
        else:
            self.log_result("POST /budgets", False, f"Budget creation failed with status {response.status_code}", response.text[:200])
            return False
        
        # 2. Get all budgets
        print("\n2. Testing get all budgets...")
        response, success, error = self.make_request("GET", "/budgets", params={"user_id": self.user_id})
        if not success:
            self.log_result("GET /budgets", False, "Failed to get budgets", error)
            return False
        
        if response.status_code == 200:
            budgets = response.json()
            if len(budgets) >= 1:
                self.log_result("GET /budgets", True, f"Retrieved {len(budgets)} budgets")
            else:
                self.log_result("GET /budgets", False, "No budgets found")
                return False
        else:
            self.log_result("GET /budgets", False, f"Get budgets failed with status {response.status_code}", response.text[:200])
            return False
        
        # 3. Get budget by month
        print("\n3. Testing get budget by month...")
        response, success, error = self.make_request("GET", f"/budgets/{self.user_id}/2026-02")
        if not success:
            self.log_result("GET /budgets/{user_id}/{month}", False, "Failed to get budget by month", error)
            return False
        
        if response.status_code == 200:
            budget = response.json()
            if budget.get("month") == "2026-02":
                self.log_result("GET /budgets/{user_id}/{month}", True, "Budget retrieved by month successfully")
            else:
                self.log_result("GET /budgets/{user_id}/{month}", False, "Retrieved budget month mismatch", str(budget))
                return False
        else:
            self.log_result("GET /budgets/{user_id}/{month}", False, f"Get budget by month failed with status {response.status_code}", response.text[:200])
            return False
        
        return True
    
    def test_dashboard_and_insights(self):
        """Test dashboard and insights endpoints"""
        print("\n=== DASHBOARD & INSIGHTS TESTS ===")
        
        if not self.user_id:
            self.log_result("Dashboard/Insights", False, "No user_id available for dashboard/insights tests")
            return False
        
        # 1. Test dashboard
        print("\n1. Testing dashboard stats...")
        response, success, error = self.make_request("GET", "/dashboard", params={"user_id": self.user_id})
        if not success:
            self.log_result("GET /dashboard", False, "Failed to get dashboard stats", error)
            return False
        
        if response.status_code == 200:
            dashboard = response.json()
            required_fields = ["total_spent", "budget_total", "budget_remaining", "category_totals", "recent_transactions"]
            if all(field in dashboard for field in required_fields):
                self.log_result("GET /dashboard", True, f"Dashboard returned with total_spent: {dashboard.get('total_spent')}")
            else:
                missing = [f for f in required_fields if f not in dashboard]
                self.log_result("GET /dashboard", False, f"Dashboard missing required fields: {missing}")
                return False
        else:
            self.log_result("GET /dashboard", False, f"Dashboard failed with status {response.status_code}", response.text[:200])
            return False
        
        # 2. Test insights
        print("\n2. Testing insights...")
        params = {
            "user_id": self.user_id,
            "start_date": "2026-01-01",
            "end_date": "2026-02-28"
        }
        response, success, error = self.make_request("GET", "/insights", params=params)
        if not success:
            self.log_result("GET /insights", False, "Failed to get insights", error)
            return False
        
        if response.status_code == 200:
            insights = response.json()
            required_fields = ["total_spent", "monthly_average", "highest_month", "biggest_category", 
                             "weekday_total", "weekend_total", "monthly_trend", "category_breakdown"]
            if all(field in insights for field in required_fields):
                self.log_result("GET /insights", True, f"Insights returned with total_spent: {insights.get('total_spent')}")
            else:
                missing = [f for f in required_fields if f not in insights]
                self.log_result("GET /insights", False, f"Insights missing required fields: {missing}")
                return False
        else:
            self.log_result("GET /insights", False, f"Insights failed with status {response.status_code}", response.text[:200])
            return False
        
        # 3. Test CSV export
        print("\n3. Testing CSV export...")
        params = {
            "user_id": self.user_id,
            "start_date": "2026-01-01",
            "end_date": "2026-02-28"
        }
        response, success, error = self.make_request("GET", "/insights/export/csv", params=params)
        if not success:
            self.log_result("GET /insights/export/csv", False, "Failed to export CSV", error)
            return False
        
        if response.status_code == 200:
            csv_content = response.text
            # Check if it's valid CSV with Romanian headers
            if "Data" in csv_content and "Sumă" in csv_content:
                self.log_result("GET /insights/export/csv", True, "CSV export successful with Romanian headers")
            else:
                self.log_result("GET /insights/export/csv", False, "CSV export missing expected Romanian headers")
                return False
        else:
            self.log_result("GET /insights/export/csv", False, f"CSV export failed with status {response.status_code}", response.text[:200])
            return False
        
        return True
    
    def test_user_deletion(self):
        """Test user deletion (final test)"""
        print("\n=== USER DELETION TEST (FINAL) ===")
        
        if not self.user_id:
            self.log_result("User Deletion", False, "No user_id available for deletion test")
            return False
        
        print("\nTesting user deletion (should delete all user data)...")
        response, success, error = self.make_request("DELETE", f"/users/{self.user_id}")
        if not success:
            self.log_result("DELETE /users/{user_id}", False, "Failed to delete user", error)
            return False
        
        if response.status_code == 200:
            result = response.json()
            if "deleted successfully" in result.get("message", ""):
                self.log_result("DELETE /users/{user_id}", True, "User and all data deleted successfully")
            else:
                self.log_result("DELETE /users/{user_id}", False, "User deletion unclear result", str(result))
                return False
        else:
            self.log_result("DELETE /users/{user_id}", False, f"User deletion failed with status {response.status_code}", response.text[:200])
            return False
        
        return True
    
    def run_all_tests(self):
        """Run all backend tests in sequence"""
        print("🚀 Starting SpendWise Premium Backend API Tests")
        print(f"📡 Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Test in order as specified in review request
        test_methods = [
            ("Health Check", self.test_health_check),
            ("User Management", self.test_user_management),
            ("Categories", self.test_categories),
            ("Expenses", self.test_expenses),
            ("Budgets", self.test_budgets),
            ("Dashboard & Insights", self.test_dashboard_and_insights),
            ("User Deletion", self.test_user_deletion)
        ]
        
        overall_success = True
        for test_name, test_method in test_methods:
            try:
                success = test_method()
                if not success:
                    overall_success = False
                    print(f"\n❌ {test_name} tests FAILED - stopping remaining tests")
                    break
            except Exception as e:
                self.log_result(test_name, False, f"Test method crashed: {str(e)}")
                overall_success = False
                print(f"\n💥 {test_name} tests CRASHED - stopping remaining tests")
                break
        
        # Print final summary
        print("\n" + "=" * 60)
        print("📊 FINAL TEST SUMMARY")
        print("=" * 60)
        
        passed_tests = [r for r in self.test_results if r["success"]]
        failed_tests = [r for r in self.test_results if not r["success"]]
        
        print(f"✅ PASSED: {len(passed_tests)}")
        print(f"❌ FAILED: {len(failed_tests)}")
        print(f"📈 SUCCESS RATE: {len(passed_tests)}/{len(self.test_results)} ({len(passed_tests)/len(self.test_results)*100:.1f}%)")
        
        if failed_tests:
            print(f"\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"  • {test['endpoint']}: {test['message']}")
        
        if overall_success:
            print(f"\n🎉 ALL SPENDWISE PREMIUM BACKEND TESTS PASSED!")
        else:
            print(f"\n⚠️ SOME TESTS FAILED - CHECK DETAILS ABOVE")
        
        return overall_success, len(passed_tests), len(failed_tests)

def main():
    """Main test execution"""
    tester = BackendTester()
    success, passed, failed = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()