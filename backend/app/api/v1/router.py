from fastapi import APIRouter

from app.api.v1.routes import auth, problems, dashboard, analytics, roadmap, revisions, notes, resources, planner

api_router = APIRouter(prefix="/api")

api_router.include_router(auth.router)
api_router.include_router(problems.router)
api_router.include_router(dashboard.router)
api_router.include_router(analytics.router)
api_router.include_router(roadmap.router)
api_router.include_router(revisions.router)
api_router.include_router(notes.router)
api_router.include_router(resources.router)
api_router.include_router(planner.router)
