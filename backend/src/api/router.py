from fastapi import APIRouter

from src.api.routes import quote, bookings, integrations, checkout, route, notifications

api_router = APIRouter()
api_router.include_router(quote.router)
api_router.include_router(bookings.router)
api_router.include_router(integrations.router)
api_router.include_router(checkout.router)
api_router.include_router(route.router)
api_router.include_router(notifications.router)


