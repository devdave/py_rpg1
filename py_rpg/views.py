"""
    The application views file

    For much more complex apps, this would be the "controllers" for a web app
    but for this app, they are the middle men between the user and actual library code.

    There is a theological like debate over making views "Fat" vs making models & libraries "fat".
    By "fat" the issue is where does most of the complexity/code go?

    With how I am building this, the goal is to keep the views slim and almost strictly
    like a fuse panel or a network router.  The work isn't meant to be here, these are
    meant to be 10-15 line deals that can be quickly read and absorbed.
"""

from app import app
from flask import render_template #looks for a template in the templates directory
#to use when rendering a response

from flask import flash #A way of making temporary messages to send to the user

from flask import request #This is a Flask API to see how a HTTP request was made
#import attribute is request.form which is a dictionary of form inputs

from flask import redirect #used to tell flask to go to another view before
#return to the user's browser

from flask import url_for #slight overkill right now BUT it's a way of finding
#the correct url for a given view


from flask import g
#G is the global state variable, it's use should be minimized to common
# objects like a database connection/factory or in this case the game state

#Tell our flask app that the index|root path is handled by def home
@app.route("/")
def home():
    if g.game.is_new:
        flash("Welcome to Open PyRPG") #RPyG?  is that corny?  does it matter if it's corny?
        #Perhaps better out of the view, but not sure where just yet?
        g.game.location = app.game.ROOM1

    return render_template("home.html")

#similar to home, but also tell our app we accept HTTP post & get requests
@app.route("/do", methods=['POST', 'GET'] )
def do():
    """
        Handles player input
        Currently check for the form name "go" and just tells the user
        what they clicked
    """
    result = "Something went wrong in do()!"
    if "go" in request.form:
        result = app.game.RH.do_move(g.game, go = request.form['go'])
    else:
        result = "Uh oh, you asked me to do something but I don't know what to do! {} ".format(\
        str(request.form)) #should use pretty print for this!

    if isinstance(result, basestring):
        flash(result)
    else:
        for msg in result:
            flash(msg)


    return redirect(url_for("home"))
