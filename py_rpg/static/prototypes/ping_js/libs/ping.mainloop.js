ping.ns("ping.Lib");
ping.Lib.MainLoop = function(){                
                var self = this;
                var tickTime = 10; //How many times to rerun through the game loop in MS
                
                // Constant function queue                 
                self.constantList = [];
                
                //List of functions to be run per tick as needed                 
                self.runQueue = [];
                /**
                 *The logic loop's interval ID
                 */
                var runnerHandle = null;
                self.logicLoop = function(){
                    $.each(self.constantList, function(index, handler){
                        try{
                            handler();
                        }catch(err){
                            console.debug(err);
                            self.stop();
                        }
                    });
                                
                    if(self.runQueue.length > 0){                    
                        var func = runQueue.shift();
                        func();
                    }    
                }
                
                self.start = function(){
                    runnerHandle = setInterval(self.logicLoop, tickTime);    
                }
                self.stop = function(){
                    clearInterval(runnerHandle);
                }
            };