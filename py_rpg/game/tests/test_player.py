import nose
with_setup = nose.with_setup
eq_ = nose.tools.eq_


from py_rpg.game.player import Player

def test_player__create_rebuild_instantiates():
    """
        This is a REALLY simple test, if nothing throws an
           exception, it passes!
    """
    new_session = {}
    player = Player.Create_Rebuild(new_session)


def test_player__save():

    player = Player.Create_Rebuild({})

    session = {}
    player.save(session)

    assert session.get('player', False)
    assert session['player'].get('location_id', False) != False, str(session)


def test_player__load():
    session = {}
    session['player'] = {}
    session['player']['location_id'] = "room_2"

    player = Player()
    player.load(session)
    eq_(player.location_id, "room_2")



def test_player__Create_Rebuild():

    session = {}
    session['player'] = {}
    session['player']['location_id'] = "room_2"

    player = Player.Create_Rebuild(session)

    eq_(player.location_id, "room_2")


def test_player_save__works_with_and_without_player_in_session():
    player = Player.Create_Rebuild({})
    player.save({})

    player.save({"player":{"location_id":"room_1"}})
