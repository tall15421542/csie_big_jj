# csie_big_jj

## usage
### install flask
```
# csie_big_jj/
python3 -m venv venv
. venv/bin/activate
pip install Flask flask-login flask-wtf
```

### run the app
```
. venv/bin/activate
cd ..
export FLASK_APP=csie_big_jj
export FLASK_ENV=development
flask run --no-reload
```

## develop new page
### Take auth/register for example
1. write jinja template in templates/auth/register.html(front end)
2. write view function in auth.py(backend)
```python
...
# auth.py
bp = Blueprint("auth", __name__, url_prefix="/auth")
...
@bp.route("/register", methods=("GET", "POST"))
def register():
    ...
    return render_template("auth/register.html")

```
3. register bp in app in __init__.py
```python
...
from csie_big_jj import auth
app.register_blueprint(auth.bp)
...
```
