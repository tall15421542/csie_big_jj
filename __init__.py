import os

from flask import Flask, redirect, url_for

	

def create_app(test_config=None):
	"""Create and configure an instance of the Flask application."""
	app = Flask(__name__, instance_relative_config=True)

	#warning: it is not recommended to set configuration directly
	app.config["DEBUG"] = False
	print(app.config["DEBUG"])

	# apply the blueprints to the app
	from csie_big_jj import auth


	app.register_blueprint(auth.bp)

	@app.route("/")
	def to_bp_home():
		return redirect(url_for('auth.index'))

	
	return app
