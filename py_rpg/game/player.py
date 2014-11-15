

class Player(object):


    @classmethod
    def Create_Rebuild(klass, session ):
        player = klass()
        return self.load(session)

    def __init__(self, gamestate):
        self.location_id = None

    def save(self, session):
        if not 'player' in session:
            session['player']

        for varname in ['location_id']:
            session['player'][varname] = getattr(self, varname)

    def load(self, session):
        if 'player' in session:
            for varname in ['location_id']:
                setattr(self, varname, session['player'])

        return self
