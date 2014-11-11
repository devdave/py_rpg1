from flask import Flask
from flask import g
#from flask import redirect
from flask import request
#from flask import session
#from flask import url_for, abort, flash

app = Flask(__name__)
app.config.from_object(__name__)
app.secret_key = 'some_secret'

