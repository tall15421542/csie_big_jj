import os

from flask import Flask, redirect, url_for

#from flask_sqlalchemy import SQLAlchemy
	

def create_app(test_config=None):
	"""Create and configure an instance of the Flask application."""
	app = Flask(__name__, instance_relative_config=True)

	# apply the blueprints to the app
	from csie_big_jj import auth

	#db.init_app(app)

	app.register_blueprint(auth.bp)

	@app.route("/")
	def to_bp_home():
		return redirect(url_for('auth.home'))

	
	return app
