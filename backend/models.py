from sqlalchemy import (
    Column,
    Integer,
    Text,
    String,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from pyramid_sqlalchemy import BaseObject, Session
from passlib.apps import custom_app_context as pwd_context

class User(BaseObject):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def set_password(self, password):
        self.password_hash = pwd_context.hash(password)

class Product(BaseObject):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    quantity = Column(Integer, nullable=False, default=0)
    price = Column(Integer, nullable=False, default=0)

