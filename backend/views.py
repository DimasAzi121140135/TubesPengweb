from pyramid.view import view_config
from pyramid.response import Response
from pyramid.security import authenticated_userid
from pyramid.httpexceptions import HTTPUnauthorized, HTTPNotFound, HTTPBadRequest
from pyramid_sqlalchemy import Session
from .models import User, Product
import json

def check_auth(request):
    if not authenticated_userid(request):
        raise HTTPUnauthorized('Authentication required')

@view_config(route_name='users_list', renderer='json', request_method='GET')
def users_list(request):
    check_auth(request)
    users = Session.query(User).all()
    return [{'id': u.id, 'username': u.username} for u in users]

@view_config(route_name='users_list', renderer='json', request_method='POST')
def users_create(request):
    check_auth(request)
    data = request.json_body
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return HTTPBadRequest('Username and password required')
    if Session.query(User).filter_by(username=username).first():
        return HTTPBadRequest('Username already exists')
    user = User(username=username)
    user.set_password(password)
    Session.add(user)
    Session.flush()
    return {'id': user.id, 'username': user.username}

@view_config(route_name='users_view', renderer='json', request_method='GET')
def user_view(request):
    check_auth(request)
    user = Session.query(User).get(request.matchdict['id'])
    if not user:
        raise HTTPNotFound()
    return {'id': user.id, 'username': user.username}

@view_config(route_name='users_view', renderer='json', request_method='PUT')
def user_update(request):
    check_auth(request)
    user = Session.query(User).get(request.matchdict['id'])
    if not user:
        raise HTTPNotFound()
    data = request.json_body
    username = data.get('username')
    password = data.get('password')
    if username:
        user.username = username
    if password:
        user.set_password(password)
    Session.flush()
    return {'id': user.id, 'username': user.username}

@view_config(route_name='users_view', renderer='json', request_method='DELETE')
def user_delete(request):
    check_auth(request)
    user = Session.query(User).get(request.matchdict['id'])
    if not user:
        raise HTTPNotFound()
    Session.delete(user)
    Session.flush()
    return {'status': 'deleted'}

# Similar views for products

@view_config(route_name='products_list', renderer='json', request_method='GET')
def products_list(request):
    check_auth(request)
    products = Session.query(Product).all()
    return [{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'quantity': p.quantity,
        'price': p.price
    } for p in products]

@view_config(route_name='products_list', renderer='json', request_method='POST')
def product_create(request):
    check_auth(request)
    data = request.json_body
    name = data.get('name')
    quantity = data.get('quantity', 0)
    price = data.get('price', 0)
    description = data.get('description', '')
    if not name:
        return HTTPBadRequest('Name required')
    product = Product(name=name, quantity=int(quantity), price=int(price), description=description)
    Session.add(product)
    Session.flush()
    return {
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'quantity': product.quantity,
        'price': product.price
    }

@view_config(route_name='products_view', renderer='json', request_method='GET')
def product_view(request):
    check_auth(request)
    product = Session.query(Product).get(request.matchdict['id'])
    if not product:
        raise HTTPNotFound()
    return {
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'quantity': product.quantity,
        'price': product.price
    }

@view_config(route_name='products_view', renderer='json', request_method='PUT')
def product_update(request):
    check_auth(request)
    product = Session.query(Product).get(request.matchdict['id'])
    if not product:
        raise HTTPNotFound()
    data = request.json_body
    name = data.get('name')
    quantity = data.get('quantity')
    price = data.get('price')
    description = data.get('description')
    if name:
        product.name = name
    if quantity is not None:
        product.quantity = int(quantity)
    if price is not None:
        product.price = int(price)
    if description is not None:
        product.description = description
    Session.flush()
    return {
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'quantity': product.quantity,
        'price': product.price
    }

@view_config(route_name='products_view', renderer='json', request_method='DELETE')
def product_delete(request):
    check_auth(request)
    product = Session.query(Product).get(request.matchdict['id'])
    if not product:
        raise HTTPNotFound()
    Session.delete(product)
    Session.flush()
    return {'status': 'deleted'}
