from app import app
import views


if __name__ == '__main__':

    app.debug = True
    app.run(host="0.0.0.0")
