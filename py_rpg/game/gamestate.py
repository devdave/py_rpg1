


"""
    Game state is created when the flask Application
      is created.
"""


class GameState(object):

    def __init__(self):
        self.dungeon = None
        self.player_cls = None

        self.player = None


    def set_dungeon(self, dungeon):
        if self.dungeon is not None:
            raise ValueError("Dungeon has already been set, it cannot be assigned to again!")
        self.dungeon = dungeon

    def set_player_class(self, player_cls):
        if self.player_cls is not None:
            raise ValueError("The Player class has already been set, it cannot be assigned to again!")
        self.player_cls = player_cls


    def restore(self, session):
        self.player = self.player_cls.Create_Rebuild(session)
        self.player.current_dungeon = self.dungeon


    def save(self, session):
        self.player.save(session)

        #TODO do whatever we need to ensure all of the
        # session/request specific stuff is gone
        self.player = None

    def move_player(self, direction):
        """
            Here's where we could BLOCK movement

            Does the player have a required item or
            Is there a hostile creature and they failed escape?
            or does the game just not want them to move?
        """


        new_room = self.player.current_room.get(direction)
        self.player.location_id = new_room.id
        return new_room
