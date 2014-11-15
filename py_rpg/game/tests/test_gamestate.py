def setup_gamestate():
    global app
    file_name = AB(J(DRN(__file__), 'map_data.json'))
    app.gamestate = game.initialize(map_filename=file_name)

def teardown_gamestate():
    global app
    app.gamestate = None


def test_initialization():
    global app
    #Don't use setup_gamestate as a fixture
    setup_gamestate()

    assert hasattr(app.gamestate, "dungeon")
    assert hasattr(app.gamestate.dungeon, "start_location")
