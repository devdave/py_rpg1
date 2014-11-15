
#from nose
from nose.util import eq_

#stdlib
import os

#Application
from py_rpg.game.room import Room
from py_rpg.game.dungeon import Dungeon


#shortcut aliases
ABP = os.path.abspath
J = os.path.join
DRN = os.path.dirname

#Common data
MAP_FILE = ABP(J(DRN(__file__), "map_data.json"))

#global fixture data
dungeon = None

"""
    These two functions are called by nose
    for every single test_ function in here

    They instantiate the Dungeon class, assign it to the global
       dungeon file, and then when a test is done, they set the global
       to None.

       The teardown is done so that each test won't interfere with the other
        no matter what.
"""

def setup_test():
    global dungeon
    dungeon = Dungeon(MAP_FILE)
setup_test.__test__ = False  #These tell Nose that this is not a unit test function

def teardown_test():
    global dungeon
    dungeon = None
teardown_test.__test__ = False



def test_instantiates():
    assert hasattr(dungeon, "get")
    assert hasattr(dungeon, "rooms")
    assert hasattr(dungeon, "starting_location")

    dungeon.starting_location = "Room1"


def test_get_room_returns_expected_value():
    room = dungeon.get("room1")
    assert isinstance(room, Room)

def test_assert_dungeon_size_is_correct():
    assert eq_(dungeon.rooms, 4)

def test_assert_all_rooms_are_unique():
    unique_values = set()
    total_values = []
    for room in dungeon.rooms:
        unique_values.add(room.id)
        total_values.append(room.id)

    assert eq_(len(unique_values), len(total_values))

