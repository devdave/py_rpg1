

class Player(object):
    """
        Wrapper around the player session

        Currently provides the player's location
        and creates/reloads it from session
    """


    @classmethod
    def Create_Rebuild(klass, session ):
        player = klass()
        return player.load(session)

    def __init__(self):
        self.location_id = None

    def save(self, session):
        if not 'player' in session:
            session['player'] = {}

        for varname in ['location_id']:
            session['player'][varname] = getattr(self, varname)

    def load(self, session):
        if 'player' in session:
            #save a few keystrokes
            data = session['player']

            for varname in ['location_id']:
                if varname in data:
                    setattr(self, varname, data[varname])

        return self
