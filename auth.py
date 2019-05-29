import functools

from flask import (
    Blueprint,
    flash,
    g,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from werkzeug.security import check_password_hash, generate_password_hash


bp = Blueprint("auth", __name__, url_prefix="/auth")


def login_required(view):
    pass 

@bp.before_app_request
def load_logged_in_user():
    pass 

@bp.route("/register", methods=("GET", "POST"))
def register():
    default_username = "tall1542"
    print(default_username)
    return render_template("auth/register.html")


@bp.route("/login", methods=("GET", "POST"))
def login():
    default_username = "tall1542"
    return render_template("auth/login.html")


@bp.route("/logout")
def logout():
    pass
