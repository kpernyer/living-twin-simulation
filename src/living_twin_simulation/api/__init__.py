"""
Living Twin Simulation API Module

FastAPI-based REST API with OpenAPI/Swagger documentation and Pydantic models
for type-safe interactions with the simulation engine.
"""

from .main import app

__all__ = ["app"]
