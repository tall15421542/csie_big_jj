import functools, threading, time
from selenium import webdriver
from bs4 import BeautifulSoup
from csie_big_jj.user_t import User, Anonymous
from flask_login import LoginManager, login_user, login_manager, current_user
import flask_login
import queue
from datetime import timedelta
BROWSER_PATH = "/Users/jimmy/Desktop/cnlFinal/csie_big_jj/csie_big_jj/chromedriver"
browser = webdriver.Chrome(BROWSER_PATH)

MAXDEVICE = 3
MAXUSER = 100001
USERS = []
DEVICES = [queue.Queue() for i in range(MAXDEVICE)]
TIMEVAL, DEFAULTTIME, DEFAULTWAIT = 10, 600, 60
usercount = 1;
a = User(name="admin",password="bigjj",userid=65536)
USERS.append(a)
### load users ###




def start_wait(user, device_id):
	b = Book(time = DEFAULTTIME, wait = DEFAULTWAIT, userid = user.id, device = device_id)
	DEVICES[device_id].put(b)

def start(book):
	book.on = 1

def end(book):
	if(book.on == 1):
		send_signal(book.userid, "Sorry you are late, please book again!")
	elif(book.on == 0):
		send_signal(book.userid, "Time's up!")

def counter():
	while True:
		print("count time")
		for q in DEVICES:
			if q.empty() == False:
				if q[0].on == 1:
					q[0].time -= TIMEVAL
					if q[0].time <= 0:
						end(q.get())
				elif q[0].on == 0:
					q[0].wait -= TIMEVAL
					if q[0].wait <= 0:
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
login_manager.anonymous_user = Anonymous

@bp.record_once
def on_load(state):	
    login_manager.init_app(state.app)


def login_required(view):
    pass 


@login_manager.user_loader
def user_loader(request):
	print("this is request:",request)
	name="aa"
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
	name = request.form.get('username')

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
				print("login status:", login_user(u,remember=True, duration=timedelta(seconds=60), force=True, fresh=True))
				#u.is_authenticated = True
				session[u.name] = u.name
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
	print("logout")
	session.pop('username', None)

@bp.route("/", methods=("GET", "POST"))
def index():
	print("hi")
	print("logged as user ", current_user.is_authenticated)
	#print("authen:", current_user._get_current_object().name)

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
	#print(flask_login.current_user.name)
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

##### end #####

### counter thread ###
#t = threading.Thread(target=counter, name="routine", daemon=True)
#t.setDaemon(True)
#t.start()
