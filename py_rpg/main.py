from app import app
import views

from lib import HERE

if __name__ == '__main__':

    app.debug = True

    app.run(host="0.0.0.0",
        extra_files=[HERE(__file__, "maps/base_map.json")]
    )
