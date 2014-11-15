from nose import with_setup


def test_create_new_player():
    new_session = {}
    global app
    app.player = gamelib.Player.Create_Rebuild(self, app.gamestate, new_session)

    assert hasattr(app.player, "location_id")
    assert hasattr(app.player, "go")
    assert hasattr(app.player, "current_room")

    assert isinstance(app.player.current_room, gamelib.Room)





def test_save_player():
    global app

    app.player = gamelib.Player.Create_Rebuild(app.gamestate, {})

    session = {}
    app.player.save(session)

    assert 'player' in session
    assert 'location' in session['player']


def test_reload_player():
    global app
    session['player'] = {}
    session['player']['location'] = "room_2"

    app.player = gamelib.Player.create_Rebuild(app.gamestate, session )

    assert app.player.location_id == "room_2"
    assert app.player.current_room.title == "Room2"
