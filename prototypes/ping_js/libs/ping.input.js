
ping.namespace("ping.Lib");
ping.Lib.initInput = function(){
            ping.Lib.Input = function(){
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
