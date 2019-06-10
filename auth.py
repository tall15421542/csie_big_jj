import functools, threading, time
from selenium import webdriver
from bs4 import BeautifulSoup
from csie_big_jj.user_t import User
from flask_login import LoginManager, login_user, login_manager
import flask_login
import queue
BROWSER_PATH = "/Users/jimmy/Desktop/cnlFinal/csie_big_jj/csie_big_jj/chromedriver"
browser = webdriver.Chrome(BROWSER_PATH)

MAXDEVICE = 3
MAXUSER = 100001
USERS = []
DEVICES = [queue.Queue() for i in range(MAXDEVICE)]
TIMEVAL, DEFAULTTIME = 10, 600
usercount = 0;
a = User(name="admin",password="bigjj",userid=65536)
USERS.append(a)
### load users ###




def start(user, device_id):
	user.time = DEFAULTTIME
	user.device = device_id
	DEVICES[device_id].put(user)

def end(user):
	user.time = -1
	user.device = -1
	##send notification

def counter():
	while True:
		for q in DEVICES:
			if q.empty() == False:
				q[0].time -= TIMEVAL;
				if q[0].time <= 0:
					end(q.get())
		time.sleep(TIMEVAL)

def check_register(user, usercount):
	for i in range(usercount):
		if USERS[i].name == user.name:
			return False
	return True

def check_login(name, password):
	for u in USERS:
		if(u.name == name):
			if(u.password == password):
				return 1, u
			else:
				return -1, None
	return 0, None

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

login_manager = LoginManager()

@bp.record_once
def on_load(state):
    login_manager.init_app(state.app)


def login_required(view):
    pass 


@login_manager.user_loader
def user_loader(name):
	global USERS
	find = -1
	for u in USERS:
		if u.name == name:
			find = 1
			user = u
			user.id = user.id
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
			user.id = user.id

	if(find == -1):
		return

	user.is_authenticated = request.form['password'] == user.password
	return user

@bp.route("/register", methods=("GET", "POST"))
def register():
	if(request.method == 'POST'):
		if(not request.form['username'] or not request.form['password']):
			flash('Please enter all fields', 'warning')
			return redirect(url_for('auth.register'))
		else:
			global usercount
			global USERS
			newuser = User(name=request.form['username'], password=request.form['password'], userid=usercount)
			if check_register(newuser, usercount):
				USERS.append(newuser)
				usercount += 1
				### I want to set it pop up, but still not ###
				flash('Registered successfully!!', 'success')
				### yee ###
				return redirect(url_for('auth.index'))
			else:
				flash('Username is already registered, please try another one.', 'warning')
				return redirect(url_for('auth.register'))
	return render_template("auth/register.html")


@bp.route("/login", methods=("GET", "POST"))
def login():
	if(request.method == 'POST'):
		if(not request.form['username'] or not request.form['password']):
			flash('Please enter all fields', 'warning')
			return redirect(url_for('auth.login'))
		else:
			global USERS
			status, u = check_login(request.form['username'], request.form['password'])
			if(status == 1):
				login_user(u,remember=False, duration=None, force=False, fresh=True)
				print("login successfully")
				flash('Logged in successfully.')
				return redirect(url_for('auth.index'))
			elif (status == -1):
				print("incorrect password")
				flash('Incorrect password, please try again.')
				return redirect(url_for('auth.login'))
			elif (status == 0):
				print("not registered")
				flash('You are not registered.')
				return redirect(url_for('auth.register'))
	return render_template("auth/login.html")

@bp.route("/logout")
def logout():
    logout_user()

@bp.route("/", methods=("GET", "POST"))
def index():
	#browser = webdriver.Chrome(BROWSER_PATH)
	browser.get('https://ntusportscenter.ntu.edu.tw/#/')
	num = browser.find_element_by_xpath('//*[@id="home_index"]/div[1]/div[1]/div[3]/div/div/div[1]/div[2]/div[2]')
	#print(num.text.split("\n "))
	#for s in num.text.split("\n "):
		#print(s)
	if(request.method == 'POST'):
		if(request.form['submit'] == 'login'):
			return redirect(url_for('auth.login'))
		elif(request.form['submit'] == 'register'):
			return redirect(url_for('auth.register'))
		else:
			pass
	
	return render_template("auth/index.html", info=num.text.split("\n "))

##### Handle every html file in auth/ #####
@bp.route("/page1", methods=("GET", "POST"))
def page1():
	if(flask_login.current_user.is_active):
		print("hi ", current_user.name)
	if(request.method == 'POST'):
		if request.form['submit'] == 'leg':
			print('leg')
		elif request.form['submit'] == 'chest':
			print('chest')
		elif request.form['submit'] == 'bottomBody':
			print('bottomBody')
		else:
			print('no')
	else:
		print("get page1")
	print(flask_login.current_user.name)
	return render_template("auth/page1.html")


@bp.route("/bottomBody", methods=("GET", "POST"))
def bottomBody():
	return render_template("auth/bottomBody.html")

@bp.route("/bottomBodyCheck", methods=("GET", "POST"))
def bottomBodyCheck():
	return render_template("auth/bottomBodyCheck.html")

@bp.route("/chest", methods=("GET", "POST"))
def chest():
	return render_template("auth/chest.html")

@bp.route("/chestCheck", methods=("GET", "POST"))
def chestCheck():
	return render_template("auth/chestCheck.html")

@bp.route("/leg", methods=("GET", "POST"))
def leg():
	return render_template("auth/leg.html")

@bp.route("/legCheck", methods=("GET", "POST"))
def legCheck():
	return render_template("auth/legCheck.html")

@bp.route("/time", methods=("GET", "POST"))
def time():
	return render_template("auth/time.html")
##### end #####


