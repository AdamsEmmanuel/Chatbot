from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Dict, Any
from datetime import datetime, timedelta
from database import get_db
from schemas import UserResponse, MessageResponse
from crud import get_users, get_all_messages
from auth import get_current_admin_user
from models import User, Message, Session as ChatSession

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all users (admin only)."""
    users = get_users(db, skip=skip, limit=limit)
    return users

@router.get("/messages", response_model=List[MessageResponse])
async def get_all_user_messages(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all messages from all users (admin only)."""
    messages = get_all_messages(db, skip=skip, limit=limit)
    return messages

@router.get("/stats")
async def get_dashboard_stats(
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Get dashboard statistics (admin only)."""
    
    # Total counts
    total_users = db.query(func.count(User.id)).scalar()
    total_messages = db.query(func.count(Message.id)).scalar()
    total_sessions = db.query(func.count(ChatSession.id)).scalar()
    active_sessions = db.query(func.count(ChatSession.id)).filter(ChatSession.is_active == True).scalar()
    
    # Recent activity (last 7 days)
    week_ago = datetime.utcnow() - timedelta(days=7)
    new_users_week = db.query(func.count(User.id)).filter(User.created_at >= week_ago).scalar()
    messages_week = db.query(func.count(Message.id)).filter(Message.created_at >= week_ago).scalar()
    
    # Daily message counts for the last 7 days
    daily_messages = []
    for i in range(7):
        day_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=i)
        day_end = day_start + timedelta(days=1)
        count = db.query(func.count(Message.id)).filter(
            Message.created_at >= day_start,
            Message.created_at < day_end
        ).scalar()
        daily_messages.append({
            "date": day_start.strftime("%Y-%m-%d"),
            "count": count
        })
    
    # Top active users (by message count)
    top_users = db.query(
        User.username,
        func.count(Message.id).label('message_count')
    ).join(Message).group_by(User.id).order_by(desc('message_count')).limit(5).all()
    
    top_users_list = [
        {"username": user.username, "message_count": user.message_count}
        for user in top_users
    ]
    
    return {
        "total_users": total_users,
        "total_messages": total_messages,
        "total_sessions": total_sessions,
        "active_sessions": active_sessions,
        "new_users_this_week": new_users_week,
        "messages_this_week": messages_week,
        "daily_messages": daily_messages,
        "top_users": top_users_list,
        "generated_at": datetime.utcnow().isoformat()
    }

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_details(
    user_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get detailed information about a specific user (admin only)."""
    from dump.crud import get_user
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.get("/users/{user_id}/messages", response_model=List[MessageResponse])
async def get_user_messages_admin(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all messages for a specific user (admin only)."""
    from dump.crud import get_user, get_user_messages
    
    # Verify user exists
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    messages = get_user_messages(db, user_id, skip=skip, limit=limit)
    return messages

@router.put("/users/{user_id}/toggle-active")
async def toggle_user_active_status(
    user_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Toggle user active status (admin only)."""
    from dump.crud import get_user
    
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Don't allow deactivating admin users
    if user.is_admin and user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate admin users"
        )
    
    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    
    status_text = "activated" if user.is_active else "deactivated"
    return {"message": f"User {user.username} has been {status_text}"}

@router.delete("/messages/{message_id}")
async def delete_message(
    message_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a message (admin only)."""
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    db.delete(message)
    db.commit()
    return {"message": "Message deleted successfully"}
