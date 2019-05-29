import os

from flask import Flask


def create_app(test_config=None):
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__, instance_relative_config=True)

    @app.route("/hello")
    def hello():
        return "Hello, World!"
    
    # apply the blueprints to the app
    from csie_big_jj import auth

    app.register_blueprint(auth.bp)

    return app
