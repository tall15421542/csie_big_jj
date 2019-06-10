from flask_login import UserMixin

class User(UserMixin):
	def __init__(self, name, userid, password):
		self.name = name
		self.id = userid
		self.password = password
		self.device = -1
		self.time = -1


