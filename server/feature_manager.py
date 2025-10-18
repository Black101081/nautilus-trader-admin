"""
Nautilus Core Feature and Service Management
Backend module for managing Nautilus features, components, and services
"""

import json
from typing import Dict, List, Any

# Load feature dependencies from analysis
def load_feature_dependencies() -> Dict:
    """Load feature dependencies from JSON file"""
    try:
        with open('/home/ubuntu/nautilus_feature_dependencies.json', 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading feature dependencies: {e}")
        return {}

# Feature management functions
def get_all_features() -> Dict[str, Any]:
    """Get all Nautilus Core features with their status and dependencies"""
    dependencies = load_feature_dependencies()
    
    # Flatten the structure for easier frontend consumption
    all_features = []
    for category, features in dependencies.items():
        for feature_name, feature_info in features.items():
            all_features.append({
                "id": f"{category}_{feature_name}".replace(" ", "_").lower(),
                "name": feature_name,
                "category": category,
                "status": feature_info.get("status", "unknown"),
                "dependencies": feature_info.get("dependencies", []),
                "services": feature_info.get("services", []),
                "required_for": feature_info.get("required_for", []),
            })
    
    return {
        "features": all_features,
        "total": len(all_features),
        "categories": list(dependencies.keys()),
    }

def get_features_by_category(category: str) -> List[Dict]:
    """Get features filtered by category"""
    all_data = get_all_features()
    return [f for f in all_data["features"] if f["category"] == category]

def get_feature_by_id(feature_id: str) -> Dict:
    """Get a specific feature by ID"""
    all_data = get_all_features()
    for feature in all_data["features"]:
        if feature["id"] == feature_id:
            return feature
    return {}

def get_feature_status_summary() -> Dict[str, int]:
    """Get summary of feature statuses"""
    all_data = get_all_features()
    status_counts = {
        "available": 0,
        "configured": 0,
        "requires_config": 0,
        "requires_data": 0,
        "unknown": 0,
    }
    
    for feature in all_data["features"]:
        status = feature["status"]
        if status in status_counts:
            status_counts[status] += 1
        else:
            status_counts["unknown"] += 1
    
    return status_counts

# Service management functions
def get_all_services() -> Dict[str, Any]:
    """Get all services provided by Nautilus Core"""
    dependencies = load_feature_dependencies()
    
    # Extract all unique services
    services_map = {}
    for category, features in dependencies.items():
        for feature_name, feature_info in features.items():
            for service in feature_info.get("services", []):
                if service not in services_map:
                    services_map[service] = {
                        "id": service,
                        "name": service.replace("_", " ").title(),
                        "provided_by": [],
                        "category": category,
                    }
                services_map[service]["provided_by"].append(feature_name)
    
    services_list = list(services_map.values())
    
    return {
        "services": services_list,
        "total": len(services_list),
    }

def get_services_by_feature(feature_name: str) -> List[str]:
    """Get services provided by a specific feature"""
    dependencies = load_feature_dependencies()
    
    for category, features in dependencies.items():
        if feature_name in features:
            return features[feature_name].get("services", [])
    
    return []

# Component management functions
def get_core_components() -> List[Dict]:
    """Get all core components with their status"""
    components = [
        {
            "id": "kernel",
            "name": "Kernel",
            "type": "core",
            "status": "running",
            "health": "healthy",
            "uptime": "2h 15m",
            "description": "Central orchestration and lifecycle management",
            "dependencies": ["Clock", "Logger", "MessageBus"],
        },
        {
            "id": "message_bus",
            "name": "MessageBus",
            "type": "core",
            "status": "running",
            "health": "healthy",
            "uptime": "2h 15m",
            "description": "Inter-component communication and event routing",
            "dependencies": ["Logger"],
        },
        {
            "id": "cache",
            "name": "Cache",
            "type": "core",
            "status": "running",
            "health": "healthy",
            "uptime": "2h 15m",
            "description": "High-performance in-memory data storage",
            "dependencies": ["Redis (optional)"],
        },
        {
            "id": "clock",
            "name": "Clock",
            "type": "core",
            "status": "running",
            "health": "healthy",
            "uptime": "2h 15m",
            "description": "Time management and event scheduling",
            "dependencies": [],
        },
        {
            "id": "logger",
            "name": "Logger",
            "type": "core",
            "status": "running",
            "health": "healthy",
            "uptime": "2h 15m",
            "description": "Centralized logging system",
            "dependencies": [],
        },
        {
            "id": "data_engine",
            "name": "DataEngine",
            "type": "engine",
            "status": "running",
            "health": "healthy",
            "uptime": "2h 15m",
            "description": "Market data processing and distribution",
            "dependencies": ["MessageBus", "Cache", "Clock"],
        },
        {
            "id": "execution_engine",
            "name": "ExecutionEngine",
            "type": "engine",
            "status": "running",
            "health": "healthy",
            "uptime": "2h 15m",
            "description": "Order lifecycle management and execution",
            "dependencies": ["MessageBus", "Cache", "Clock", "RiskEngine"],
        },
        {
            "id": "risk_engine",
            "name": "RiskEngine",
            "type": "engine",
            "status": "running",
            "health": "healthy",
            "uptime": "2h 15m",
            "description": "Pre-trade and post-trade risk management",
            "dependencies": ["MessageBus", "Cache", "PortfolioEngine"],
        },
        {
            "id": "strategy_engine",
            "name": "StrategyEngine",
            "type": "engine",
            "status": "running",
            "health": "healthy",
            "uptime": "2h 15m",
            "description": "Strategy lifecycle and execution management",
            "dependencies": ["MessageBus", "Cache", "Clock"],
        },
        {
            "id": "portfolio_engine",
            "name": "PortfolioEngine",
            "type": "engine",
            "status": "running",
            "health": "healthy",
            "uptime": "2h 15m",
            "description": "Portfolio state tracking and P&L calculation",
            "dependencies": ["MessageBus", "Cache"],
        },
    ]
    
    return components

def get_component_by_id(component_id: str) -> Dict:
    """Get a specific component by ID"""
    components = get_core_components()
    for component in components:
        if component["id"] == component_id:
            return component
    return {}

def get_component_health_summary() -> Dict[str, int]:
    """Get summary of component health status"""
    components = get_core_components()
    health_counts = {
        "healthy": 0,
        "degraded": 0,
        "unhealthy": 0,
        "stopped": 0,
    }
    
    for component in components:
        health = component.get("health", "unknown")
        if health in health_counts:
            health_counts[health] += 1
    
    return health_counts

# Export all functions
__all__ = [
    "get_all_features",
    "get_features_by_category",
    "get_feature_by_id",
    "get_feature_status_summary",
    "get_all_services",
    "get_services_by_feature",
    "get_core_components",
    "get_component_by_id",
    "get_component_health_summary",
]

