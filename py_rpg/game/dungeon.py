import json

class Room(object):

    def __init__(self, my_id, my_data):
        self.id = my_id
        self.title = my_data.get("title", my_id.capitalize())
        self.connections = my_data.get("connections", {})
        assert len(self.connections) > 0, "Room has no way out!"


class Dungeon(object):


    def __init__(self, map_filename):
        self.rooms = {}
        self.starting_location = None

        with open(map_filename, "rb") as my_file:
            raw_data = json.load(my_file)

        for room_id, data in raw_data.items():
            self.rooms[room_id] = Room(room_id, data)

            if data.get('start_in', False) != False:
                self.starting_location = room_id

    def get(self, room_id):
        return self.rooms.get(room_id)


