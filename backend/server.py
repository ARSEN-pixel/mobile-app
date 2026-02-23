from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
from enum import Enum
import csv
import io

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'spendwise_db')]

# Create the main app
app = FastAPI(title="SpendWise Premium API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== ENUMS ====================

class PaymentMethod(str, Enum):
    cash = "cash"
    card = "card"
    transfer = "transfer"
    other = "other"

class ThemePreference(str, Enum):
    light = "light"
    dark = "dark"
    system = "system"

class SyncStatus(str, Enum):
    synced = "synced"
    pending = "pending"
    local = "local"

# ==================== MODELS ====================

class UserSettings(BaseModel):
    currency: str = "RON"
    theme: ThemePreference = ThemePreference.system
    language: str = "ro"
    notifications_enabled: bool = True
    budget_alerts: bool = True

class UserCreate(BaseModel):
    firebase_uid: Optional[str] = None
    email: Optional[str] = None
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    provider: Optional[str] = "guest"
    settings: Optional[UserSettings] = None

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    firebase_uid: Optional[str] = None
    email: Optional[str] = None
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    provider: Optional[str] = "guest"
    settings: UserSettings = Field(default_factory=UserSettings)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CategoryCreate(BaseModel):
    user_id: str
    name: str
    icon: str
    color: str
    is_default: bool = False
    is_favorite: bool = False
    order: int = 0
    auto_suggest_keywords: List[str] = []

class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    icon: str
    color: str
    is_default: bool = False
    is_favorite: bool = False
    order: int = 0
    auto_suggest_keywords: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ExpenseCreate(BaseModel):
    user_id: str
    amount: float
    category_id: str
    title: str
    date: str  # ISO format date
    payment_method: PaymentMethod = PaymentMethod.cash
    notes: Optional[str] = None
    tags: List[str] = []
    is_recurring: bool = False
    receipt_photo: Optional[str] = None
    sync_status: SyncStatus = SyncStatus.synced

class Expense(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    amount: float
    category_id: str
    title: str
    date: str
    payment_method: PaymentMethod = PaymentMethod.cash
    notes: Optional[str] = None
    tags: List[str] = []
    is_recurring: bool = False
    receipt_photo: Optional[str] = None
    sync_status: SyncStatus = SyncStatus.synced
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = None

class CategoryBudget(BaseModel):
    category_id: str
    amount: float

class BudgetCreate(BaseModel):
    user_id: str
    month: str  # YYYY-MM format
    total_budget: float
    category_budgets: List[CategoryBudget] = []

class Budget(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    month: str
    total_budget: float
    category_budgets: List[CategoryBudget] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class InsightData(BaseModel):
    total_spent: float
    monthly_average: float
    highest_month: Dict[str, Any]
    biggest_category: Dict[str, Any]
    weekday_total: float
    weekend_total: float
    monthly_trend: List[Dict[str, Any]]
    category_breakdown: List[Dict[str, Any]]
    comparison_to_last_month: float

# ==================== DEFAULT DATA ====================

DEFAULT_CATEGORIES = [
    {"name": "Mâncare", "icon": "restaurant", "color": "#F59E0B"},
    {"name": "Transport", "icon": "car", "color": "#3B82F6"},
    {"name": "Cumpărături", "icon": "cart", "color": "#EC4899"},
    {"name": "Divertisment", "icon": "game-controller", "color": "#8B5CF6"},
    {"name": "Sănătate", "icon": "medkit", "color": "#EF4444"},
    {"name": "Facturi", "icon": "document-text", "color": "#14B8A6"},
    {"name": "Educație", "icon": "school", "color": "#6366F1"},
    {"name": "Sport", "icon": "fitness", "color": "#10B981"},
    {"name": "Cadouri", "icon": "gift", "color": "#F97316"},
    {"name": "Altele", "icon": "ellipsis-horizontal", "color": "#64748B"},
]

# ==================== HELPER FUNCTIONS ====================

async def create_default_categories(user_id: str):
    """Create default categories for a new user"""
    categories = []
    for i, cat_data in enumerate(DEFAULT_CATEGORIES):
        category = Category(
            user_id=user_id,
            name=cat_data["name"],
            icon=cat_data["icon"],
            color=cat_data["color"],
            is_default=True,
            order=i
        )
        await db.categories.insert_one(category.dict())
        categories.append(category)
    return categories

# ==================== USER ENDPOINTS ====================

@api_router.post("/users", response_model=User)
async def create_or_get_user(user_data: UserCreate):
    """Create a new user or get existing one by firebase_uid"""
    # Check if user exists by firebase_uid
    if user_data.firebase_uid:
        existing = await db.users.find_one({"firebase_uid": user_data.firebase_uid})
        if existing:
            return User(**existing)
    
    # Create new user
    user = User(
        firebase_uid=user_data.firebase_uid,
        email=user_data.email,
        display_name=user_data.display_name,
        photo_url=user_data.photo_url,
        provider=user_data.provider,
        settings=user_data.settings or UserSettings()
    )
    
    await db.users.insert_one(user.dict())
    
    # Create default categories for new user
    await create_default_categories(user.id)
    
    logger.info(f"Created new user: {user.id}")
    return user

@api_router.get("/users/me", response_model=User)
async def get_current_user(firebase_uid: str = Query(...)):
    """Get current user by firebase_uid"""
    user = await db.users.find_one({"firebase_uid": firebase_uid})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    """Get user by ID"""
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

@api_router.put("/users/{user_id}", response_model=User)
async def update_user(user_id: str, user_data: Dict[str, Any]):
    """Update user"""
    user_data["updated_at"] = datetime.utcnow()
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": user_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated = await db.users.find_one({"id": user_id})
    return User(**updated)

@api_router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    """Delete user and all their data"""
    # Delete user's expenses
    await db.expenses.delete_many({"user_id": user_id})
    # Delete user's categories
    await db.categories.delete_many({"user_id": user_id})
    # Delete user's budgets
    await db.budgets.delete_many({"user_id": user_id})
    # Delete user
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    logger.info(f"Deleted user and all data: {user_id}")
    return {"message": "User and all data deleted successfully"}

@api_router.get("/users/{user_id}/export")
async def export_user_data(user_id: str):
    """Export all user data"""
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    expenses = await db.expenses.find({"user_id": user_id}).to_list(10000)
    categories = await db.categories.find({"user_id": user_id}).to_list(1000)
    budgets = await db.budgets.find({"user_id": user_id}).to_list(1000)
    
    # Convert datetime objects to strings
    for exp in expenses:
        exp['created_at'] = exp['created_at'].isoformat() if exp.get('created_at') else None
        exp['updated_at'] = exp['updated_at'].isoformat() if exp.get('updated_at') else None
        exp.pop('_id', None)
    
    for cat in categories:
        cat['created_at'] = cat['created_at'].isoformat() if cat.get('created_at') else None
        cat['updated_at'] = cat['updated_at'].isoformat() if cat.get('updated_at') else None
        cat.pop('_id', None)
    
    for budget in budgets:
        budget['created_at'] = budget['created_at'].isoformat() if budget.get('created_at') else None
        budget['updated_at'] = budget['updated_at'].isoformat() if budget.get('updated_at') else None
        budget.pop('_id', None)
    
    user.pop('_id', None)
    user['created_at'] = user['created_at'].isoformat() if user.get('created_at') else None
    user['updated_at'] = user['updated_at'].isoformat() if user.get('updated_at') else None
    
    return {
        "user": user,
        "expenses": expenses,
        "categories": categories,
        "budgets": budgets,
        "exported_at": datetime.utcnow().isoformat()
    }

# ==================== CATEGORY ENDPOINTS ====================

@api_router.get("/categories", response_model=List[Category])
async def get_categories(user_id: str = Query(...)):
    """Get all categories for a user"""
    categories = await db.categories.find({"user_id": user_id}).sort("order", 1).to_list(1000)
    return [Category(**cat) for cat in categories]

@api_router.post("/categories", response_model=Category)
async def create_category(category_data: CategoryCreate):
    """Create a new category"""
    category = Category(**category_data.dict())
    await db.categories.insert_one(category.dict())
    return category

@api_router.put("/categories/{category_id}", response_model=Category)
async def update_category(category_id: str, category_data: Dict[str, Any]):
    """Update a category"""
    category_data["updated_at"] = datetime.utcnow()
    result = await db.categories.update_one(
        {"id": category_id},
        {"$set": category_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    updated = await db.categories.find_one({"id": category_id})
    return Category(**updated)

@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: str):
    """Delete a category"""
    # Check if category has expenses
    expense_count = await db.expenses.count_documents({"category_id": category_id})
    if expense_count > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete category with {expense_count} expenses. Move or delete expenses first."
        )
    
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {"message": "Category deleted successfully"}

@api_router.post("/categories/reorder")
async def reorder_categories(data: Dict[str, List[str]]):
    """Reorder categories"""
    category_ids = data.get("category_ids", [])
    for i, cat_id in enumerate(category_ids):
        await db.categories.update_one(
            {"id": cat_id},
            {"$set": {"order": i, "updated_at": datetime.utcnow()}}
        )
    return {"message": "Categories reordered successfully"}

# ==================== EXPENSE ENDPOINTS ====================

@api_router.get("/expenses", response_model=List[Expense])
async def get_expenses(
    user_id: str = Query(...),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category_ids: Optional[str] = None,
    payment_methods: Optional[str] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    search: Optional[str] = None,
):
    """Get all expenses for a user with optional filters"""
    query = {"user_id": user_id, "deleted_at": None}
    
    if start_date:
        query["date"] = {"$gte": start_date}
    if end_date:
        if "date" in query:
            query["date"]["$lte"] = end_date
        else:
            query["date"] = {"$lte": end_date}
    
    if category_ids:
        cat_list = category_ids.split(",")
        query["category_id"] = {"$in": cat_list}
    
    if payment_methods:
        method_list = payment_methods.split(",")
        query["payment_method"] = {"$in": method_list}
    
    if min_amount is not None:
        query["amount"] = {"$gte": min_amount}
    if max_amount is not None:
        if "amount" in query:
            query["amount"]["$lte"] = max_amount
        else:
            query["amount"] = {"$lte": max_amount}
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"notes": {"$regex": search, "$options": "i"}},
        ]
    
    expenses = await db.expenses.find(query).sort("date", -1).to_list(10000)
    return [Expense(**exp) for exp in expenses]

@api_router.post("/expenses", response_model=Expense)
async def create_expense(expense_data: ExpenseCreate):
    """Create a new expense"""
    expense = Expense(**expense_data.dict())
    await db.expenses.insert_one(expense.dict())
    return expense

@api_router.get("/expenses/{expense_id}", response_model=Expense)
async def get_expense(expense_id: str):
    """Get a single expense"""
    expense = await db.expenses.find_one({"id": expense_id})
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return Expense(**expense)

@api_router.put("/expenses/{expense_id}", response_model=Expense)
async def update_expense(expense_id: str, expense_data: Dict[str, Any]):
    """Update an expense"""
    expense_data["updated_at"] = datetime.utcnow()
    result = await db.expenses.update_one(
        {"id": expense_id},
        {"$set": expense_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    updated = await db.expenses.find_one({"id": expense_id})
    return Expense(**updated)

@api_router.delete("/expenses/{expense_id}")
async def delete_expense(expense_id: str):
    """Delete an expense (soft delete with tombstone)"""
    result = await db.expenses.update_one(
        {"id": expense_id},
        {"$set": {"deleted_at": datetime.utcnow(), "updated_at": datetime.utcnow()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    return {"message": "Expense deleted successfully"}

@api_router.post("/expenses/bulk-delete")
async def bulk_delete_expenses(data: Dict[str, List[str]]):
    """Bulk delete expenses"""
    expense_ids = data.get("expense_ids", [])
    now = datetime.utcnow()
    result = await db.expenses.update_many(
        {"id": {"$in": expense_ids}},
        {"$set": {"deleted_at": now, "updated_at": now}}
    )
    return {"message": f"Deleted {result.modified_count} expenses"}

@api_router.post("/expenses/bulk-update-category")
async def bulk_update_category(data: Dict[str, Any]):
    """Bulk update expense category"""
    expense_ids = data.get("expense_ids", [])
    category_id = data.get("category_id")
    
    if not category_id:
        raise HTTPException(status_code=400, detail="category_id is required")
    
    result = await db.expenses.update_many(
        {"id": {"$in": expense_ids}},
        {"$set": {"category_id": category_id, "updated_at": datetime.utcnow()}}
    )
    return {"message": f"Updated {result.modified_count} expenses"}

# ==================== BUDGET ENDPOINTS ====================

@api_router.get("/budgets", response_model=List[Budget])
async def get_budgets(user_id: str = Query(...)):
    """Get all budgets for a user"""
    budgets = await db.budgets.find({"user_id": user_id}).sort("month", -1).to_list(1000)
    return [Budget(**b) for b in budgets]

@api_router.get("/budgets/{user_id}/{month}", response_model=Budget)
async def get_budget_by_month(user_id: str, month: str):
    """Get budget for a specific month"""
    budget = await db.budgets.find_one({"user_id": user_id, "month": month})
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    return Budget(**budget)

@api_router.post("/budgets", response_model=Budget)
async def create_budget(budget_data: BudgetCreate):
    """Create or update a budget for a month"""
    # Check if budget exists for this month
    existing = await db.budgets.find_one({
        "user_id": budget_data.user_id,
        "month": budget_data.month
    })
    
    if existing:
        # Update existing budget
        update_data = budget_data.dict()
        update_data["updated_at"] = datetime.utcnow()
        await db.budgets.update_one(
            {"id": existing["id"]},
            {"$set": update_data}
        )
        updated = await db.budgets.find_one({"id": existing["id"]})
        return Budget(**updated)
    
    # Create new budget
    budget = Budget(**budget_data.dict())
    await db.budgets.insert_one(budget.dict())
    return budget

@api_router.put("/budgets/{budget_id}", response_model=Budget)
async def update_budget(budget_id: str, budget_data: Dict[str, Any]):
    """Update a budget"""
    budget_data["updated_at"] = datetime.utcnow()
    result = await db.budgets.update_one(
        {"id": budget_id},
        {"$set": budget_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    updated = await db.budgets.find_one({"id": budget_id})
    return Budget(**updated)

# ==================== INSIGHTS ENDPOINTS ====================

@api_router.get("/insights", response_model=InsightData)
async def get_insights(
    user_id: str = Query(...),
    start_date: str = Query(...),
    end_date: str = Query(...),
):
    """Get expense insights for a date range"""
    # Get expenses in range
    expenses = await db.expenses.find({
        "user_id": user_id,
        "date": {"$gte": start_date, "$lte": end_date},
        "deleted_at": None
    }).to_list(10000)
    
    if not expenses:
        return InsightData(
            total_spent=0,
            monthly_average=0,
            highest_month={"month": "", "amount": 0},
            biggest_category={"category_id": "", "amount": 0},
            weekday_total=0,
            weekend_total=0,
            monthly_trend=[],
            category_breakdown=[],
            comparison_to_last_month=0
        )
    
    # Calculate total spent
    total_spent = sum(e["amount"] for e in expenses)
    
    # Group by month for monthly trend
    monthly_totals = {}
    for exp in expenses:
        month = exp["date"][:7]  # YYYY-MM
        monthly_totals[month] = monthly_totals.get(month, 0) + exp["amount"]
    
    monthly_trend = [{"month": k, "amount": v} for k, v in sorted(monthly_totals.items())]
    
    # Monthly average
    num_months = len(monthly_totals) if monthly_totals else 1
    monthly_average = total_spent / num_months
    
    # Highest month
    highest_month = max(monthly_totals.items(), key=lambda x: x[1]) if monthly_totals else ("", 0)
    
    # Category breakdown
    category_totals = {}
    for exp in expenses:
        cat_id = exp["category_id"]
        category_totals[cat_id] = category_totals.get(cat_id, 0) + exp["amount"]
    
    category_breakdown = []
    for cat_id, amount in category_totals.items():
        percentage = (amount / total_spent * 100) if total_spent > 0 else 0
        category_breakdown.append({
            "category_id": cat_id,
            "amount": amount,
            "percentage": round(percentage, 1)
        })
    category_breakdown.sort(key=lambda x: x["amount"], reverse=True)
    
    # Biggest category
    biggest_cat = category_breakdown[0] if category_breakdown else {"category_id": "", "amount": 0}
    
    # Weekday vs weekend
    weekday_total = 0
    weekend_total = 0
    for exp in expenses:
        try:
            date_obj = datetime.strptime(exp["date"][:10], "%Y-%m-%d")
            if date_obj.weekday() >= 5:  # Saturday = 5, Sunday = 6
                weekend_total += exp["amount"]
            else:
                weekday_total += exp["amount"]
        except:
            pass
    
    # Comparison to last month
    # Get current month from end_date
    try:
        end_dt = datetime.strptime(end_date[:7], "%Y-%m")
        current_month = end_dt.strftime("%Y-%m")
        last_month_dt = end_dt - timedelta(days=30)
        last_month = last_month_dt.strftime("%Y-%m")
        
        current_total = monthly_totals.get(current_month, 0)
        last_total = monthly_totals.get(last_month, 0)
        
        if last_total > 0:
            comparison = ((current_total - last_total) / last_total) * 100
        else:
            comparison = 100 if current_total > 0 else 0
    except:
        comparison = 0
    
    return InsightData(
        total_spent=round(total_spent, 2),
        monthly_average=round(monthly_average, 2),
        highest_month={"month": highest_month[0], "amount": round(highest_month[1], 2)},
        biggest_category={"category_id": biggest_cat["category_id"], "amount": round(biggest_cat["amount"], 2)},
        weekday_total=round(weekday_total, 2),
        weekend_total=round(weekend_total, 2),
        monthly_trend=monthly_trend,
        category_breakdown=category_breakdown,
        comparison_to_last_month=round(comparison, 1)
    )

@api_router.get("/insights/export/csv")
async def export_csv(
    user_id: str = Query(...),
    start_date: str = Query(...),
    end_date: str = Query(...),
):
    """Export expenses as CSV"""
    expenses = await db.expenses.find({
        "user_id": user_id,
        "date": {"$gte": start_date, "$lte": end_date},
        "deleted_at": None
    }).sort("date", -1).to_list(10000)
    
    # Get categories for names
    categories = await db.categories.find({"user_id": user_id}).to_list(1000)
    cat_map = {c["id"]: c["name"] for c in categories}
    
    # Create CSV
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Data", "Titlu", "Categorie", "Sumă", "Metodă de plată", "Note", "Etichete"])
    
    for exp in expenses:
        writer.writerow([
            exp["date"],
            exp["title"],
            cat_map.get(exp["category_id"], "N/A"),
            exp["amount"],
            exp["payment_method"],
            exp.get("notes", ""),
            ", ".join(exp.get("tags", []))
        ])
    
    return output.getvalue()

# ==================== SYNC ENDPOINT ====================

@api_router.post("/sync")
async def sync_data(data: Dict[str, Any]):
    """Sync local data with server"""
    user_id = data.get("user_id")
    client_expenses = data.get("expenses", [])
    client_categories = data.get("categories", [])
    client_budgets = data.get("budgets", [])
    last_sync = data.get("last_sync")
    
    # Get server data updated after last_sync
    query = {"user_id": user_id}
    if last_sync:
        try:
            last_sync_dt = datetime.fromisoformat(last_sync.replace('Z', '+00:00'))
            query["updated_at"] = {"$gt": last_sync_dt}
        except:
            pass
    
    server_expenses = await db.expenses.find(query).to_list(10000)
    server_categories = await db.categories.find(query).to_list(1000)
    server_budgets = await db.budgets.find(query).to_list(1000)
    
    # Merge client data (last-write-wins strategy)
    now = datetime.utcnow()
    
    for client_exp in client_expenses:
        if client_exp.get("sync_status") == "pending":
            existing = await db.expenses.find_one({"id": client_exp["id"]})
            if existing:
                # Compare timestamps - client wins if newer
                client_updated = datetime.fromisoformat(client_exp.get("updated_at", "2000-01-01"))
                if client_updated > existing.get("updated_at", datetime.min):
                    client_exp["sync_status"] = "synced"
                    await db.expenses.update_one(
                        {"id": client_exp["id"]},
                        {"$set": client_exp}
                    )
            else:
                client_exp["sync_status"] = "synced"
                await db.expenses.insert_one(client_exp)
    
    # Return merged data
    all_expenses = await db.expenses.find({"user_id": user_id}).to_list(10000)
    all_categories = await db.categories.find({"user_id": user_id}).to_list(1000)
    all_budgets = await db.budgets.find({"user_id": user_id}).to_list(1000)
    
    # Clean up MongoDB _id fields and convert datetime
    for exp in all_expenses:
        exp.pop('_id', None)
        if isinstance(exp.get('created_at'), datetime):
            exp['created_at'] = exp['created_at'].isoformat()
        if isinstance(exp.get('updated_at'), datetime):
            exp['updated_at'] = exp['updated_at'].isoformat()
        if exp.get('deleted_at') and isinstance(exp['deleted_at'], datetime):
            exp['deleted_at'] = exp['deleted_at'].isoformat()
    
    for cat in all_categories:
        cat.pop('_id', None)
        if isinstance(cat.get('created_at'), datetime):
            cat['created_at'] = cat['created_at'].isoformat()
        if isinstance(cat.get('updated_at'), datetime):
            cat['updated_at'] = cat['updated_at'].isoformat()
    
    for budget in all_budgets:
        budget.pop('_id', None)
        if isinstance(budget.get('created_at'), datetime):
            budget['created_at'] = budget['created_at'].isoformat()
        if isinstance(budget.get('updated_at'), datetime):
            budget['updated_at'] = budget['updated_at'].isoformat()
    
    return {
        "expenses": all_expenses,
        "categories": all_categories,
        "budgets": all_budgets,
        "last_sync": now.isoformat()
    }

# ==================== DASHBOARD ENDPOINT ====================

@api_router.get("/dashboard")
async def get_dashboard(user_id: str = Query(...)):
    """Get dashboard stats"""
    now = datetime.utcnow()
    current_month = now.strftime("%Y-%m")
    month_start = f"{current_month}-01"
    month_end = now.strftime("%Y-%m-%d")
    
    # Get this month's expenses
    expenses = await db.expenses.find({
        "user_id": user_id,
        "date": {"$gte": month_start, "$lte": month_end},
        "deleted_at": None
    }).to_list(10000)
    
    total_spent = sum(e["amount"] for e in expenses)
    
    # Get budget for this month
    budget = await db.budgets.find_one({"user_id": user_id, "month": current_month})
    budget_total = budget["total_budget"] if budget else 0
    budget_remaining = budget_total - total_spent if budget_total > 0 else 0
    budget_percentage = (total_spent / budget_total * 100) if budget_total > 0 else 0
    
    # Category totals
    category_totals = {}
    for exp in expenses:
        cat_id = exp["category_id"]
        category_totals[cat_id] = category_totals.get(cat_id, 0) + exp["amount"]
    
    # Recent transactions (last 5)
    recent = await db.expenses.find({
        "user_id": user_id,
        "deleted_at": None
    }).sort("date", -1).limit(5).to_list(5)
    
    for exp in recent:
        exp.pop('_id', None)
        if isinstance(exp.get('created_at'), datetime):
            exp['created_at'] = exp['created_at'].isoformat()
        if isinstance(exp.get('updated_at'), datetime):
            exp['updated_at'] = exp['updated_at'].isoformat()
    
    return {
        "total_spent": round(total_spent, 2),
        "budget_total": budget_total,
        "budget_remaining": round(budget_remaining, 2),
        "budget_percentage": round(budget_percentage, 1),
        "category_totals": [{"category_id": k, "total": round(v, 2)} for k, v in category_totals.items()],
        "recent_transactions": recent,
        "current_month": current_month
    }

# ==================== ROOT ENDPOINT ====================

@api_router.get("/")
async def root():
    return {"message": "SpendWise Premium API", "version": "1.0.0"}

@api_router.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
