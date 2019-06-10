import os
from flask import Flask, redirect, url_for
from flask_login import LoginManager
	

def create_app(test_config=None):
	"""Create and configure an instance of the Flask application."""
	app = Flask(__name__, instance_relative_config=True)

	#warning: it is not recommended to set configuration directly
	app.config["DEBUG"] = False
	app.config["SECRET_KEY"] = chr(1234)
	#print(app.config["DEBUG"])
	#print(app.config["SECRET_KEY"])


	'''
	#login session
	login_manager = LoginManager()
	login_manager.init_app(app)

	@login_manager.user_loader
	def user_loader(name):
		global USERS
		find = -1
		for u in USERS:
			if u.name == name:
				find = 1
				user = u
				user.id = user.userid
		if find == -1:
			return
	
		return user

	@login_manager.request_loader
	def request_loader(request):
		name = request.form.get('name')

		global USERS
		find = -1
		for u in USERS:
			if u.name == name:
				find = 1
				user = u
				user.id = user.userid

		if(find == -1):
			return

		user.is_authenticated = request.form['password'] == user.password
		return user
	'''

	# apply the blueprints to the app
	from csie_big_jj import auth
	app.register_blueprint(auth.bp)

	'''
	### login session ###
	@login_manager.user_loader
	def load_user(user_id):
		return User.get(user_id)
	'''

	@app.route("/")
	def to_bp_home():
		return redirect(url_for('auth.index'))

	
	return app
