import functools
#from flask_sqlalchemy import SQLAlchemy


from flask import (
	Flask,
    Blueprint,
    flash,
    g,
    redirect,
    render_template,
    request,
    session,
    url_for,
	current_app
)
from werkzeug.security import check_password_hash, generate_password_hash

bp = Blueprint("auth", __name__, url_prefix="/auth")
'''
# Create database
db = SQLAlchemy()

class User(db.Model):
	name = db.Column(db.String(100))
	user_id = db.Column(db.String(100)) 
	password = db.Column(db.String(100))
	pin = db.Column(db.String(10))
	
	def __init__(self, name, user_id, password, pin):
		self.user_id = user_id
		self.name = name
		self.password = password
		self.pin = pin

database = Flask(__name__)
database.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.sqlite3'
with database.app_context():
	db.init_app(current_app)
	db.create_all()
	admin = User(name = 'admin', user_id = '0', password = 'admin', pin = '0')
	db.session.add(admin)
	db.session.commit()
	print(User.query.filter_by(username="admin").first())
'''
def login_required(view):
    pass 

@bp.before_app_request
def load_logged_in_user():
    pass

	

@bp.route("/register", methods=("GET", "POST"))
def register():
	if(request.method == 'POST'):
		if(not request.form['username'] or not request.form['password']):
			flash("please enter all fields", "error")
			return redirect(url_for('auth.register'))
		else:
			print(request.form['username'],"\n", request.form['password'])
			return redirect(url_for('auth.home'))
	elif(request.method == 'GET'):
		return render_template("auth/register.html")



@bp.route("/login", methods=("GET", "POST"))
def login():
	if(request.method == 'POST'):
		return redirect(url_for('auth.home'))
	elif(request.method == 'GET'):
		return render_template("auth/login.html")


@bp.route("/", methods=("GET", "POST"))
def home():
	if(request.method == 'POST'):
		if(request.form['submit'] == 'login'):
			return redirect(url_for('auth.login'))
		elif(request.form['submit'] == 'register'):
			return redirect(url_for('auth.register'))
		else:
			pass
	
	return render_template("auth/index.html")


@bp.route("/main", methods=("GET", "POST"))
def page1():
	return render_template("auth/page1.html")


@bp.route("/logout")
def logout():
    pass

#db.create_all(bind=none)
