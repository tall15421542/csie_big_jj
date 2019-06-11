from flask_login import UserMixin
from flask_login import AnonymousUserMixin

class User(UserMixin):
	def __init__(self, name, userid, password):
		self.name = name
		self.id = userid
		self.password = password

class Book():
	def __init__(self, device, time, userid, wait):
		self.device = device
		self.userid = userid
		self.time = time
		self.wait = wait
		self.on = 0

class Anonymous(AnonymousUserMixin):
	def __init__(self):
		self.name = 'Admin'
		self.id = 0
		self.password = "bigjj"

