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

#Tell our flask app that the index|root path is handled by def home
@app.route("/")
def home():
    return render_template("home.html")

#similar to home, but also tell our app we accept HTTP post & get requests
@app.route("/do", methods=['POST', 'GET'] )
def do():
    """
        Handles player input
        Currently check for the form name "go" and just tells the user
        what they clicked
    """
    if "go" in request.form:
        #For now just say which direction they went by taking
        #the form input "go", capitilizing it, and putting it
        #into a bigger string.
        #You could ALSO do something like
        #    my_direction = request.form['go'].capitilize()
        #    my_message = "You went %s" % my_direction
        #    flash(my_message)
        # but I like to compact things together

        #flash is a way of making very short term messages
        flash("You went {}!".format(request.form['go'].capitalize()))

        # Dirt example of how to check where they went.
        #if request.form['go'] == "north":
        #    flash("You went {}!".format(request.form['go'].capitilize())
        #elif request.form['go'] == "south":
        #    flash("You went {}!".format(request.form['go'].capitilize())
    else:
        flash(str(request.form))

    return redirect(url_for("home"))
