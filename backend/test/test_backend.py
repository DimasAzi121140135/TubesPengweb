import unittest
from pyramid import testing
from backend.models import User, Product
from backend.views import (
    users_list,
    users_create,
    user_view,
    user_update,
    user_delete,
    products_list,
    product_create,
    product_view,
    product_update,
    product_delete
)
from pyramid_sqlalchemy import Session

class DummyRequest:
    def __init__(self, method='GET', json_body=None, matchdict=None):
        self.method = method
        self.json_body = json_body or {}
        self.matchdict = matchdict or {}
        self._authenticated_userid = 1

    # mimic Pyramid's authenticated_userid
    @property
    def authenticated_userid(self):
        return self._authenticated_userid

def fake_check_auth(request):
    # override authentication for tests
    pass

class BackendTests(unittest.TestCase):

    def setUp(self):
        self.config = testing.setUp()
        # Use in-memory SQLite for tests
        from sqlalchemy import create_engine
        engine = create_engine('sqlite://')
        from backend.models import Base
        Base.metadata.create_all(engine)
        Session.configure(bind=engine)

    def tearDown(self):
        testing.tearDown()

    def test_user_crud(self):
        # Create user
        req = DummyRequest(method='POST', json_body={'username':'testuser','password':'pass'})
        from backend.views import user_create as create_view
        # Monkeypatch check_auth to skip authentication
        from backend.views import check_auth
        original_check_auth = check_auth
        setattr(__import__('backend.views'), 'check_auth', lambda r: None)
        user = users_create(req)
        self.assertEqual(user['username'], 'testuser')
        user_id = user['id']

        # Read user
        req = DummyRequest(method='GET', matchdict={'id':user_id})
        user_data = user_view(req)
        self.assertEqual(user_data['username'], 'testuser')

        # Update user
        req = DummyRequest(method='PUT', json_body={'username':'updated'}, matchdict={'id':user_id})
        updated = user_update(req)
        self.assertEqual(updated['username'], 'updated')

        # Delete user
        req = DummyRequest(method='DELETE', matchdict={'id':user_id})
        result = user_delete(req)
        self.assertEqual(result['status'], 'deleted')

        # Restore original check_auth
        setattr(__import__('backend.views'), 'check_auth', original_check_auth)

    def test_product_crud(self):
        # Create product
        req = DummyRequest(method='POST', json_body={'name':'Product1','quantity':10,'price':100})
        product = product_create(req)
        self.assertEqual(product['name'], 'Product1')
        prod_id = product['id']

        # Read product
        req = DummyRequest(method='GET', matchdict={'id':prod_id})
        product_data = product_view(req)
        self.assertEqual(product_data['name'], 'Product1')

        # Update product
        req = DummyRequest(method='PUT', json_body={'name':'Updated Product'}, matchdict={'id':prod_id})
        updated = product_update(req)
        self.assertEqual(updated['name'], 'Updated Product')

        # Delete product
        req = DummyRequest(method='DELETE', matchdict={'id':prod_id})
        result = product_delete(req)
        self.assertEqual(result['status'], 'deleted')

if __name__ == '__main__':
    unittest.main()
