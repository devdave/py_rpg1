from flask import Flask
from flask import g
#from flask import redirect
from flask import request
from flask import session
#from flask import url_for, abort, flash
import game

app = Flask(__name__)
app.config.from_object(__name__)
app.secret_key = 'some_secret'
app.game = game



# request handlers -- these two hooks are provided by flask and we will use them
# to create and tear down our game object.  NOTE until it's save'd the game is
# emphemeral or will go away.
@app.before_request
def before_request():
    g.game = game.GameState.Create_or_rebuild(session)

@app.after_request
def after_request(response):
    g.game.save(session)
    return response
