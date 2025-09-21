from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Message Schemas
class MessageBase(BaseModel):
    message_text: str

class MessageCreate(MessageBase):
    session_id: Optional[int] = None

class MessageResponse(MessageBase):
    id: int
    user_id: int
    response_text: Optional[str]
    session_id: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Session Schemas
class SessionBase(BaseModel):
    title: Optional[str] = "New Chat"

class SessionCreate(SessionBase):
    pass

class SessionResponse(SessionBase):
    id: int
    user_id: int
    started_at: datetime
    ended_at: Optional[datetime]
    is_active: bool
    messages: List[MessageResponse] = []
    
    class Config:
        from_attributes = True

# Chat Schemas
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[int] = None

class ChatResponse(BaseModel):
    message_id: int
    user_message: str
    bot_response: str
    session_id: int
    timestamp: datetime
