from nose import with_setup
from py_rpg.game.player import Player


def test_create_new_player():
    new_session = {}

    app.player = gamelib.Player.Create_Rebuild(self, app.gamestate, new_session)

    assert hasattr(app.player, "location_id")
    assert hasattr(app.player, "go")
    assert hasattr(app.player, "current_room")

    assert isinstance(app.player.current_room, gamelib.Room)

def test_save_player():


    app.player = gamelib.Player.Create_Rebuild(app.gamestate, {})

    session = {}
    app.player.save(session)

    assert 'player' in session
    assert 'location' in session['player']


def test_reload_player():

    session = {}
    session['player'] = {}
    session['player']['location'] = "room_2"

    gamestate = type("GameState", (object,), {})

    app.player = Player.Create_Rebuild({}, session )

    assert app.player.location_id == "room_2"
    assert app.player.current_room.title == "Room2"
