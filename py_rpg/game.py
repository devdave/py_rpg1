"""
    Gotta start somewhere

    A simple 4 room deal, with 2 directions per room

    room 1 <==> room 2
    ||           ||
    room 3 <==> room 4

    For now, all rooms return strings
"""

rooms = {
    "room1": {
        "title": "Room2",
        "connections": dict(east = "room2", south="room3")
    },
    "room2": {
        "title": "Room2",
        "connections": dict(west = "room1", south="room4")
    },
    "room3": {
        "title": "Room3",
        "connections": dict(east = "room4", north="room2")
    },
    "room4": {
        "title": "Room4",
        "connections": dict(west = "room3", north="room2")
    },
}


class RoomHelper(object):
    """
        Just an eventual collection of logic for handling
        entering rooms, interacting with them, and traveling between them
    """

    @classmethod
    def do_move(cls, game, go):
        assert game.location in rooms

        generic_room  = lambda x : "You've entered {}, it's empty".format(x['title'])
        describe_room = lambda x: x['description'] if 'description' in x else generic_room(x)
        tell_directions = lambda x: "You can go: {}".format(", ".join(x['connections'].keys()))


        current_room = rooms[game.location]

        if go and go in current_room['connections']:


            #check the current room's connections map
            #that gives us the room_id we want to go.
            room_id = rooms[game.location]['connections'][go]
            #update the game state to say we've moved!
            game.location = room_id

            #Grab the current ( the new room ) data
            new_room = rooms[game.location]

            msg = [
                    "You're heading {} to {}".format(go.capitalize(), game.location.capitalize()),
                    describe_room(new_room),
                    tell_directions(new_room)
                  ]
            return msg
        else:

            msgs = ["You can't go {}!\n".format(go)] if go else []

            msgs.extend([
                describe_room(current_room),
                tell_directions(current_room)
            ])
            return msgs

RH = RoomHelper

class GameState(object):
    """
        Provides a wrapper around a game session.

        This ideally makes it easier to add fundamental state information
        in a semi-flexible way.  Downside is that this is a glorified singleton
        which can get corrupted if not used carefully.
    """
    def __init__(self, session, new_game = None):

        if not new_game:
            #Ensure we have a location
            if 'location' not in session['game']:
                raise Exception("Uh oh, someone we lost our location!")

            self.state = {k:v for k,v in session['game'].items()}

        else: #it's a new GAME!
            self.state = {}
            self.state['new_game'] = True
            #Bad code smell, constant like this should be more configurable
            self.state['location'] = 'room1'
            #Depend on the game to set our initial location!



    @classmethod
    def Create_or_rebuild(cls, session):
        if 'game' not in session:
            return cls(session, new_game = True)
        else:
            return cls(session, new_game = False)

    def save(self, session_obj):
        """
            Save our game state back to flask's session object

            Ensure the new_game flag is not put into the session when saving.
        """

        if 'game' not in session_obj:
            session_obj['game'] = {}

        for key, val in self.state.items():
            #Skip new_game setting when saving
            if key == 'new_game': continue
            session_obj['game'][key] = val

    @property
    def location(self):
        return self.state['location'] if 'location' in self.state else 'uh-oh'

    @location.setter
    def location(self, value):
        self.state['location'] = value

    @property
    def is_new(self):
        return 'new_game' in self.state







