
import inspect

class Player(object):
    """
        Wrapper around the player session

        Currently provides the player's location
        and creates/reloads it from session
    """


    @classmethod
    def Create_Rebuild(klass, session):
        player = klass()
        return player.load(session)

    def __init__(self):
        self.location_id = None
        self.dungeon = None
        self.room = None


    @property
    def current_dungeon(self):
        return self.dungeon

    @current_dungeon.setter
    def current_dungeon(self, dungeon):


        #during development, ensure we're getting the input we want
        assert hasattr(dungeon, "starting_location")
        assert hasattr(dungeon, "get") and inspect.ismethod(dungeon.get)


        self.dungeon = dungeon
        if self.location_id:
            self.room = self.dungeon.get(self.location_id)
        else:
            self.location = self.dungeon.starting_location

    @property
    def location(self):
        return self.location_id

    @location.setter
    def location(self, my_location_id):
        self.location_id = my_location_id


        assert self.dungeon
        self.current_room = self.dungeon.get(self.location_id)


    @property
    def current_room(self, ):
        return self.room

    @current_room.setter
    def current_room(self, room):
        self.room = room


    def load(self, session):
        if session.get("player", False):
            #save a few keystrokes
            data = session['player']

            for varname in ['location_id']:
                setattr(self, varname, data[varname])

        return self


    def save(self, session):
        if session.get('player', False) == False:
            session['player'] = {}

        for varname in ['location_id']:
            session['player'][varname] = getattr(self, varname)
