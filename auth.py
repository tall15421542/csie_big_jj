import functools, threading
from selenium import webdriver
from bs4 import BeautifulSoup
from csie_big_jj.user_t import User
BROWSER_PATH = "/Users/jimmy/Desktop/cnlFinal/csie_big_jj/csie_big_jj/chromedriver"
browser = webdriver.Chrome(BROWSER_PATH)

MAXDEVICE = 3
MAXUSER = 100001
USERS = []
DEVICES = []

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
			return redirect(url_for('auth.index'))
	elif(request.method == 'GET'):
		return render_template("auth/register.html")



@bp.route("/login", methods=("GET", "POST"))
def login():
	if(request.method == 'POST'):
		return redirect(url_for('auth.index'))
	elif(request.method == 'GET'):
		return render_template("auth/login.html")


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

@bp.route("/logout")
def logout():
    pass

