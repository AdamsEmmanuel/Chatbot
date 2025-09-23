from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas import ChatRequest, ChatResponse, MessageResponse, SessionCreate, SessionResponse
from crud import (
    create_message, create_chat_session, get_user_sessions, 
    get_session, get_session_messages, end_session
)
from auth import get_current_active_user
from chatbot import chatbot
from models import User

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/send", response_model=ChatResponse)
async def send_message(
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Send a message to the chatbot and get a response."""
    
    # If no session_id provided, create a new session
    session_id = chat_request.session_id
    if not session_id:
        new_session = create_chat_session(
            db, 
            current_user.id, 
            SessionCreate(title=f"Chat - {chat_request.message[:30]}...")
        )
        session_id = new_session.id
    else:
        # Verify session belongs to current user
        session = get_session(db, session_id, current_user.id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )
    
    # Generate bot response
    user_context = {
        "username": current_user.username,
        "user_id": current_user.id
    }
    bot_response = await chatbot.generate_response(chat_request.message, user_context)
    
    # Save message and response to database
    message = create_message(
        db,
        current_user.id,
        MessageCreate(message_text=chat_request.message, session_id=session_id),
        response_text=bot_response
    )
    
    return ChatResponse(
        message_id=message.id,
        user_message=message.message_text,
        bot_response=message.response_text,
        session_id=session_id,
        timestamp=message.created_at
    )

@router.get("/sessions", response_model=List[SessionResponse])
async def get_chat_sessions(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all chat sessions for the current user."""
    sessions = get_user_sessions(db, current_user.id, skip, limit)
    
    # Load messages for each session
    for session in sessions:
        session.messages = get_session_messages(db, session.id, current_user.id)
    
    return sessions

@router.get("/sessions/{session_id}", response_model=SessionResponse)
async def get_chat_session(
    session_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific chat session with all messages."""
    session = get_session(db, session_id, current_user.id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    session.messages = get_session_messages(db, session_id, current_user.id)
    return session

@router.post("/sessions", response_model=SessionResponse)
async def create_new_session(
    session_data: SessionCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new chat session."""
    session = create_chat_session(db, current_user.id, session_data)
    session.messages = []
    return session

@router.put("/sessions/{session_id}/end")
async def end_chat_session(
    session_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """End a chat session."""
    session = end_session(db, session_id, current_user.id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    return {"message": "Session ended successfully"}

@router.get("/history", response_model=List[MessageResponse])
async def get_chat_history(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get chat history for the current user."""
    from dump.crud import get_user_messages
    messages = get_user_messages(db, current_user.id, skip, limit)
    return messages
