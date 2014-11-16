
from nose.tools import eq_
from nose.tools import raises


from contextlib import contextmanager

from py_rpg.game.gamestate import GameState
from py_rpg.game.dungeon import Dungeon
from py_rpg.game.player import Player

from helpers import HERE
MAP_FILE = HERE(__file__, "map_data.json")


gamestate = None

@contextmanager
def my_app():
    """
        Simulates how py_rpg.app behaves

    """
    global gamestate
    gamestate = GameState()
    dungeon = Dungeon(MAP_FILE)
    gamestate.set_dungeon(dungeon)

    gamestate.set_player_class(Player)
    yield gamestate
    gamestate = None


def test_initialization():
    my_state = GameState()
    dungeon = Dungeon(MAP_FILE)
    my_state.set_dungeon(dungeon)


@raises(ValueError)
def test_set_dungeon_breaks():
    my_state = GameState()
    dungeon = Dungeon(MAP_FILE)
    my_state.set_dungeon(dungeon)
    my_state.set_dungeon(dungeon)

@raises(ValueError)
def test_set_player_class__breaks():
    my_state = GameState()
    my_state.set_player_class(Player)
    my_state.set_player_class(Player)

#Disabled due to something in flask calling restore 2x
#@raises(ValueError)
#def test_restore_breaks():
#    session = {}
#    with my_app() as gamestate:
#        gamestate.restore(session)
#        gamestate.restore(session)

def test_restore_AND_save():
    session = {
        "player": {
            "location_id":"room_1"
        }
    }
    new_session = {}
    with my_app() as gamestate:

        gamestate.restore(session)
        assert gamestate.player is not None
        #we should be in room_1
        eq_(gamestate.player.location, "room_1")

        #Move the player to room_2 now
        gamestate.player.location = "room_2"

        gamestate.save(new_session)


    assert new_session.get("player", False)
    player_obj = new_session['player']

    eq_(player_obj['location_id'], "room_2")


    with my_app() as gamestate:
        gamestate.restore(new_session)
        assert gamestate.player is not None
        eq_(gamestate.player.location, "room_2")


def test_gamestate_move_player():
    session = {}
    on_save_session = {}
    with my_app() as gamestate:
        gamestate.restore(session)
        eq_(gamestate.player.location, "room_1")

        gamestate.move_player("east")
        eq_(gamestate.player.location, "room_2")

        gamestate.save(on_save_session)


    eq_(on_save_session['player']['location_id'], "room_2")
    print str(on_save_session)

def test_player_current_dungeon():

    session = {}
    with my_app() as gamestate:
        gamestate.restore(session)
        my_dungeon = gamestate.dungeon
        my_player = gamestate.player
        eq_(my_dungeon, my_player.current_dungeon)

def test_player_current_dungeon():

    session = {}
    with my_app() as gamestate:
        gamestate.restore(session)
        my_dungeon = gamestate.dungeon
        my_player = gamestate.player
        eq_(my_dungeon, my_player.current_dungeon)
