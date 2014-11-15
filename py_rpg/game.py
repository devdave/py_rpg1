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
        "connections": dict(east = "room2", south="room3"),
        "start_in": True #tell map where the entrance is!
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

class Room(object):

    def __init__(self, parent_map, room_id, **kwargs):
        #Bad code idea, but it's brutally quick
        self.parent = parent_map
        self.my_id = room_id
        self.start_in = False

        assert hasattr(parent_map, "get_room")

        for k, value in kwargs.items():
            setattr(self, k, value)

        #Ensure we have the minimum's
        assert hasattr(self, "title")
        assert hasattr(self, "connections")

    #We use property decorators to protect
    #the room data.  We don't want to ever modify these
    #but instead have something like a creatures list like GameMap
    #and a entities/property list like GameStuff or GameLoot.

    @property
    def id(self):
        return self.my_id

    @property
    def whoami(self):
        return self.id

    @property
    def map(self):
        return self.parent_map

    def describe(self):
        """
            returns [description, directions] with text markup

            A list used to make it easier to do additional formatting later
                (eg add <br> or \n or something along those lines)
        """

        room_text = "You are in {}".format(self.title)

        directions_names = ", ".join(self.connections.keys())

        direction_list += """You can go: {}""".format(directions_names)

        return [room_text, direction_list]


    @property
    def directions(self):
        return self.connections.items()

    @property
    def describe(self):
        if hasattr(self, "description"):
            return """You are in {}

                You see {}
                """.format(self.title, self.description)
        else:
            return """
                You are in {}

                It is a completely empty place with nothing remarkable
                """

    def go(self, direction, game = None):
        """


            The room should be able to dictage if you can leave it.

            Say you're fighting an ExcessiveAbstractionMonster and you lose
            the role
        """
        #Need to replace this with a raise WrongDirection except
        assert direction in self.connections

        return self.parent.get(self.connections[direction])



class GameMap(object):
    def __init__(self, game_map):
        """

            room_id:
                title: string - require
                connections: map/dict
                    direction: room_id

            Not implemented yet keys

            room_id:
                description
                creatures: map of creatures
                    creature_id: spawn_chance (0-1 eg 50% would be .5)

        """
        self.raw_map = game_map
        self.rooms = {}
        self.starting_id = None

        self.validate_and_build()
        assert self.starting_id

    def validate_and_build(self):

        for room_id, raw_room in self.raw_map.items():
            new_room = Room(self, room_id, **raw_room)

            if new_room.start_in == True:
                self.starting_id = new_room.id

            self.rooms[room_id] = new_room


    def get(self, room_id):
        assert room_id in self.rooms
        return self.rooms[self.room_id]

class Player(object):

    def __init__(self, my_map, **kwargs):
        self.map = my_map
        self.my_location = None

        if 'location' in kwargs:
            self.my_location = location
        else:
            self.my_location = my_map.starting_room_id


    @classmethod
    def Create_or_rebuild(cls, session, my_map):

        if 'player' in session:
            return cls(my_map, **session['player'])
        else:
            return cls(my_map)



    def move(self, direction):
        new_room = my_map.get(self.my_location, direction)
        self.my_location = new_room.id

    def



def initialize_game(self, source_map_filename = None):
    """
        TODO use source_map_filename to load the map from a file!
    """
    #We don't need to use a global as we're not modifying the
    #global rooms variable.
    return GameMap(rooms)



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

#class GameState(object):
#    """
#        Provides a wrapper around a game session.
#
#        This ideally makes it easier to add fundamental state information
#        in a semi-flexible way.  Downside is that this is a glorified singleton
#        which can get corrupted if not used carefully.
#    """
#    def __init__(self, session, new_game = None, map_file = None):
#
#        self.state = {}
#        self.new_game = new_game or False
#        self.player = None
#
#        self.player = Player.Create_or_rebuild(session, self.state['map'] )
#
#
#
#
#
#    @classmethod
#    def Create_or_rebuild(cls, session, starting_map_filename = None):
#        if 'game' not in session:
#            return cls(session, new_game = True, map_file = starting_map_filename)
#        else:
#            return cls(session, new_game = False)
#
#    def save(self, session_obj):
#        """
#            Save our game state back to flask's session object
#
#            Ensure the new_game flag is not put into the session when saving.
#        """
#
#        if 'game' not in session_obj:
#            session_obj['game'] = {}
#
#        for key, val in self.state.items():
#            #Skip new_game setting when saving
#            if key == 'new_game': continue
#            session_obj['game'][key] = val
#
#    @property
#    def location(self):
#        return self.state['location'] if 'location' in self.state else 'uh-oh'
#
#    @location.setter
#    def location(self, value):
#        self.state['location'] = value
#
#    @property
#    def is_new(self):
#        return 'new_game' in self.state
