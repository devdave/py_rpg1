"""
    The flask app object/module for the project.

"""
from flask import Flask

#flask.g is a global data proxy, it's a way for objects to
# jump the train tracks and allow for separate parts of the application
# to share common data.  In this case, g is where the game state object is
# being assigned to make it available to the rest of the app.
from flask import g

from flask import session
#from flask import url_for, abort, flash
import game as gamelib
#TODO change game.py over to gamelib to make it easier to read later
# ie "Is it game the module, game the class, or game the instance?"
import game


#Briefly, we're creating our Flask application and telling flask where
# it is in correlation to the file system and the python package
# Per Flask documentation, it's better to use the package name then the
# fully qualified path.  In this case __name__ is `py_rpg.app`
# when we want just py_rpg.
app = Flask(__name__.split('.')[0])

#This tells flask that the web application itself is configured in this file
app.config.from_object(__name__)
#TODO - This needs to be changed but its not a super priority now as this
# is how you secure cookies from abuse by third parties and respect
# user privacy.
app.secret_key = 'some_secret'

#Not good behavior but we want to bond the gamelib module to the app
# Flask instance so it can be retrieved later.
app.gamelib = gamelib



# request handlers -- these two hooks are provided by flask and we will use them
# to create and tear down our game object.  NOTE until it's save'd the game is
# emphemeral or will go away each time it's reloaded.
@app.before_request
def before_request():
    """
        Before the py_rpg.views is even accessed, this is
        called.

        It should be quick and memory/cpu cheap.  Adding a lot of extra
        logic here will slow the entire application down and increase
        memory use for every single HTTP request.
    """
    g.game = game.GameState.Create_or_rebuild(session)


@app.after_request
def after_request(response):
    """
        After views are done doing their work, this is called.

        It's called a post-filter in some MVC architecture.  One of its uses is
        to check output destined for the browser ( ie running html tidy, scrubbing for
        specific words, or adding extra lines of code).  I, DevDave, frown on that
        last bit as it gets confusing and or hard to debug.

        In our case it allows us to do housekeeping, clean up work.  In this case
        it saves
    """
    g.game.save(session)
    return response
    #In the future.
    # Wrapping the game save logic in a try...finally ENSURES
    # the application doesn't crash and burn.
    # downside is that if there is something seriously wrong
    # it will take longer to figure out what is it.
    # a better approach would be to add an except clause and log the error.
    #try:
    #    g.game.save(session)
    #finally:
    #
