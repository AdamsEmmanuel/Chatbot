from sqlalchemy.orm import Session
from sqlalchemy import desc
from dump.models import User, Message, Session as ChatSession
from dump.schemas import UserCreate, MessageCreate, SessionCreate
from auth import get_password_hash
from typing import List, Optional

# User CRUD operations
def get_user(db: Session, user_id: int) -> Optional[User]:
    """Get user by ID."""
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """Get user by username."""
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email."""
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get all users with pagination."""
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate) -> User:
    """Create a new user."""
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Session CRUD operations
def create_chat_session(db: Session, user_id: int, session: SessionCreate) -> ChatSession:
    """Create a new chat session."""
    db_session = ChatSession(
        user_id=user_id,
        title=session.title or "New Chat"
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_user_sessions(db: Session, user_id: int, skip: int = 0, limit: int = 50) -> List[ChatSession]:
    """Get all sessions for a user."""
    return db.query(ChatSession).filter(
        ChatSession.user_id == user_id
    ).order_by(desc(ChatSession.started_at)).offset(skip).limit(limit).all()

def get_session(db: Session, session_id: int, user_id: int) -> Optional[ChatSession]:
    """Get a specific session for a user."""
    return db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == user_id
    ).first()

def end_session(db: Session, session_id: int, user_id: int) -> Optional[ChatSession]:
    """End a chat session."""
    session = get_session(db, session_id, user_id)
    if session:
        session.is_active = False
        session.ended_at = db.execute("SELECT NOW()").scalar()
        db.commit()
        db.refresh(session)
    return session

# Message CRUD operations
def create_message(db: Session, user_id: int, message: MessageCreate, response_text: str = None) -> Message:
    """Create a new message."""
    db_message = Message(
        user_id=user_id,
        message_text=message.message_text,
        response_text=response_text,
        session_id=message.session_id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_user_messages(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Message]:
    """Get all messages for a user."""
    return db.query(Message).filter(
        Message.user_id == user_id
    ).order_by(desc(Message.created_at)).offset(skip).limit(limit).all()

def get_session_messages(db: Session, session_id: int, user_id: int) -> List[Message]:
    """Get all messages for a specific session."""
    return db.query(Message).filter(
        Message.session_id == session_id,
        Message.user_id == user_id
    ).order_by(Message.created_at).all()

def get_all_messages(db: Session, skip: int = 0, limit: int = 100) -> List[Message]:
    """Get all messages (admin only)."""
    return db.query(Message).order_by(desc(Message.created_at)).offset(skip).limit(limit).all()

def update_message_response(db: Session, message_id: int, response_text: str) -> Optional[Message]:
    """Update message with bot response."""
    message = db.query(Message).filter(Message.id == message_id).first()
    if message:
        message.response_text = response_text
        db.commit()
        db.refresh(message)
    return message
