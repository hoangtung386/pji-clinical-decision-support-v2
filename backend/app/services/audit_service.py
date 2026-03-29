from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit import AuditLog
from app.models.user import User


async def log_action(
    db: AsyncSession,
    user: User | None,
    action: str,
    resource: str,
    resource_id: int | None = None,
    detail: str | None = None,
    changes: dict | None = None,
    ip_address: str | None = None,
) -> None:
    entry = AuditLog(
        user_id=user.id if user else None,
        username=user.username if user else None,
        action=action,
        resource=resource,
        resource_id=resource_id,
        detail=detail,
        changes=changes,
        ip_address=ip_address,
    )
    db.add(entry)
    await db.flush()
