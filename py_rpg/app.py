"""
    The flask app object/module for the project.

"""
#Flask dependancy imports
from flask import Flask
from flask import session

#Our utility helpers
from lib import HERE

#Game logic imports
from game import (GameState, Player, Dungeon,)

#Setup our web application
#Briefly, we're creating our Flask application and telling flask where
# it is in correlation to the file system and the python package
# Per Flask documentation, it's better to use the package name then the
# fully qualified path.  In this case __name__ is `py_rpg.app`
# when we want just py_rpg.
app = Flask(__name__.split('.')[0])

#This tells flask that the web application itself is configured in this file
app.config.from_object(__name__)
#TODO - This needs to be changed but its not a super priority now.  This
# is how you secure cookies from abuse by third parties and protect
# user privacy.
app.secret_key = 'some_secret'



@app.before_first_request
def setup_the_game():
    """
        This is the game in a nutshell,
          Setup our Game state
          add a default dungeon
          tell GameState how to create new players.

          before_first_request ensures this is only called once.
    """
    app.game = GameState()
    app.game.set_dungeon(Dungeon(HERE(__file__, "maps/base_map.json")))
    app.game.set_player_class(Player)



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
    app.game.restore(session)


@app.after_request
def after_request(response):
    """
        After views are done doing their work, this is called.

        It's called a post-filter in some MVC architecture. One of its uses is
        to check output destined for the browser ( ie running html tidy,
        scrubbing for specific words, or adding extra lines of code). I,
        DevDave, frown on that last bit as it gets confusing and or hard to
        debug.

        In our case it allows us to do housekeeping, clean up work. In this case
        it saves
    """
    app.game.save(session)
    return response
    #In the future.
    # Wrapping the game save logic in a try...finally ENSURES
    # the application doesn't crash and burn.
    # downside is that if there is something seriously wrong
    # it will take longer to debug what has gone wrong.
    # a better approach would be to add an except clause and log the error.
    #try:
    #    g.game.save(session)
    #except Exception as e:
    #    log.error(e)
    #finally:
    #
