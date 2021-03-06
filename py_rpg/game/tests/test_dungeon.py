from nose import with_setup
from nose.tools import eq_


#stdlib
import os

#Application
from py_rpg.game.dungeon import Room
from py_rpg.game.dungeon import Dungeon

from helpers import HERE

#Common data
MAP_FILE = HERE(__file__, "map_data.json")


"""
    using nose's with_setup decorator

    we're going to setup and then
    teardown a fixture for each test
    as needed.

    Behind the scenes, nose does something like

    setup_func()
    test_something()
    teardown_func()

"""

dungeon = None

def setup_func():
    global dungeon
    dungeon = Dungeon(MAP_FILE)

#Tell Nose that this is not a unit test
setup_func.__test__ = False

def teardown_func():
    global dungeon
    dungeon = None

#Tell Nose that this is not a unit test
teardown_func.__test__ = False


def test_dungeon__instantiates():
    dungeon = Dungeon(MAP_FILE)
    eq_(dungeon.starting_location, "room_1")
    assert isinstance(dungeon.rooms, dict)

@with_setup(setup_func, teardown_func)
def test_room__direction_list():
    room = dungeon.get("room_1")
    actual_directions = room.direction_list()
    expected_directions = ['east','south']

    eq_(expected_directions, actual_directions)

@with_setup(setup_func, teardown_func)
def test_room__directions():
    room = dungeon.get("room_1")
    actual_directions = room.directions
    expected_directions = "East, South"
    eq_(expected_directions, actual_directions)

@with_setup(setup_func, teardown_func)
def test_dungeon__get_returns_expected_value():
    room = dungeon.get("room_1")
    assert isinstance(room, Room), "Expecting a room, got {}".format(room)
    eq_(room.id, "room_1")

@with_setup(setup_func, teardown_func)
def test_dungeon__dungeon_rooms_is_correct_size():
    eq_(len(dungeon.rooms), 4)

@with_setup(setup_func, teardown_func)
def test_dungeon__all_rooms_are_unique():
    unique_values = set()
    total_values = []
    for room_id, _ignore in dungeon.rooms.items():
        unique_values.add(room_id)
        total_values.append(room_id)

    eq_(len(unique_values), len(total_values))
