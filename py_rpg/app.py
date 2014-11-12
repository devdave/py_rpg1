"""
    The flask app object/module for the project.

"""
from flask import Flask

#flask.g is a global data proxy, it's a way for objects to
# jump the train tracks and allow for separate parts of the application
# to share common data.  In this case, g is where the game state object is
# being assigned to make it available to the rest of the app.
from flask import g

from flask import request
from flask import session
#from flask import url_for, abort, flash
import game as gamelib
#TODO change game.py over to gamelib to make it easier to read later
# ie "Is it game the module, game the class, or game the instance?"
import game


#Briefly, we're creating our Flask application and telling flask where
# it is in correlation to the file system and the python package
app = Flask(__name__)

app.config.from_object(__name__)
app.secret_key = 'some_secret'
app.gamelib = gamelib



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
