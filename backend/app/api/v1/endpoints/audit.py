from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import require_role
from app.db.session import get_db
from app.models.audit import AuditLog
from app.models.user import User, UserRole

router = APIRouter(prefix="/audit", tags=["Audit Log"])


@router.get("/")
async def list_audit_logs(
    resource: str | None = None,
    action: str | None = None,
    skip: int = 0,
    limit: int = Query(default=100, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
):
    """Xem nhật ký hoạt động (chỉ Admin)."""
    query = select(AuditLog).order_by(AuditLog.created_at.desc())

    if resource:
        query = query.where(AuditLog.resource == resource)
    if action:
        query = query.where(AuditLog.action == action)

    result = await db.execute(query.offset(skip).limit(limit))
    logs = result.scalars().all()

    return [
        {
            "id": log.id,
            "user_id": log.user_id,
            "username": log.username,
            "action": log.action,
            "resource": log.resource,
            "resource_id": log.resource_id,
            "detail": log.detail,
            "changes": log.changes,
            "created_at": log.created_at,
        }
        for log in logs
    ]
