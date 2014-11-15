import nose
with_setup = nose.with_setup
eq_ = nose.tools.eq_

import os
#shortcut aliases
ABP = os.path.abspath
J = os.path.join
DRN = os.path.dirname

from py_rpg.game.player import Player

def test_create_new_player():
    new_session = {}

    player = Player.Create_Rebuild(new_session)
    assert hasattr(player, "location_id")


def test_player_save():


    player = Player.Create_Rebuild({})

    session = {}
    player.save(session)

    assert 'player' in session
    assert 'location_id' in session['player']

def test_player_load():
    session = {}
    session['player'] = {}
    session['player']['location_id'] = "room_2"

    player = Player()
    player.load(session)
    eq_(player.location_id, "room_2")



def test_Create_Rebuild():

    session = {}
    session['player'] = {}
    session['player']['location_id'] = "room_2"

    player = Player.Create_Rebuild(session)

    eq_(player.location_id, "room_2")


