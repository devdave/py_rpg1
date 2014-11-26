
/**
@namespace
*/
ping.Lib = ping.Lib || {};

/**
Likely keep this around as I can't remember how it works.
As for what it does, it provided a way to track
the arrow keys to see if they were pressed or unpressed (up or down);

@deprecated
@lends
*/
ping.Lib.initInput = function(){
    /**
    @function
    */
    ping.Lib.Input = new function(){
        var self = this;
        var map    = { 38: "U", 40: "D", 37: "L", 39: "R" };
        self.state = { U: false, D: false, L: false, R: false };
        self.keydown = function(evnt){
            var mKey = map[evnt.which];
            if(mKey != "undefined"){
                self.state[mKey] = true;
            }
        }

        self.keyup = function(evnt){
            var mKey = map[evnt.which];
            if(mKey){
                self.state[mKey] = false;
            }
        }

        $(document).keydown(self.keydown);
        $(document).keyup(self.keyup);
    }
}
