from fastapi import APIRouter

from app.api.v1.endpoints import auth, audit, clinical, labs, patients, treatment

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(patients.router)
api_router.include_router(clinical.router)
api_router.include_router(labs.router)
api_router.include_router(treatment.router)
api_router.include_router(audit.router)
