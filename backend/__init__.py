from pyramid.config import Configurator
from pyramid.security import Allow, Authenticated, Everyone
from pyramid.authentication import BasicAuthAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from sqlalchemy import engine_from_config
from .models import (
    DBSession,
    Base,
)

def groupfinder(userid, request):
    # For simplicity, all authenticated users belong to 'group:user'
    if userid:
        return ['group:user']
    return []

class RootFactory(object):
    __acl__ = [
        (Allow, Authenticated, 'view'),
        (Allow, 'group:user', 'edit'),
    ]

    def __init__(self, request):
        pass

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application."""
    authn_policy = BasicAuthAuthenticationPolicy(callback=groupfinder, realm='StockApp')
    authz_policy = ACLAuthorizationPolicy()
    config = Configurator(settings=settings,
                         root_factory=RootFactory)
    config.set_authentication_policy(authn_policy)
    config.set_authorization_policy(authz_policy)
    config.include('pyramid_sqlalchemy')
    config.include('.models')
    config.include('.routes')
    config.scan()
    return config.make_wsgi_app()

