var cocos = require('cocos2d');
var geom = require('geometry');
var util = require('util');
var doublyLinkedList = require('./DoublyLinkedList');

// Maximum size of the moves list.
var MAX_MOVES = 3;

var Snake = cocos.nodes.Node.extend({
    initialVelocity: new geom.Point(-1, 0),
    speed: 80,
    body: null,
    moves: null,
    head: null,
    startTime: null,
    posToMove: null,
    step: 0,
    parent: null,

    init: function(opts) {
        Snake.superclass.init.call(this);
        this.parent = opts.parent;
        var pos = new geom.Point(0, 0);
        if (opts.initialPos !== null) {
            pos = opts.initialPos;
        }
        
        var moves = new doublyLinkedList.DoublyLinkedList()
        this.set('moves', moves);

        var body = new doublyLinkedList.DoublyLinkedList()
        var sprite2 = cocos.nodes.Sprite.create({
            file: '/resources/snake-head.png',
            //rect: new geom.Rect(96, 0, 16, 16)
        });
        sprite2.set('position', pos);
        
        sprite2.set('velocity', util.copy(this.get('initialVelocity')));
        body.add(sprite2);
        this.parent.addChild({child: body.item(0)});

        this.set('body', body);
        this.addSection();
        this.addSection();
        this.addSection();
        this.addSection();
        this.addSection();
        body = this.get('body', body);
        this.set('body', body);

        var d = new Date();
        d.getTime();
        this.set('startTime', d);

        this.set('posToMove', new geom.Point(-100,0));
        var posToMove = this.get('posToMove');
        console.log(posToMove.x + " " + posToMove.y);

        //this.set('step', 0);
        
        this.schedule({
            method: this.trackPlayer,
            interval: 0.5
        });
        
        this.scheduleUpdate();
    },
    
    trackPlayer: function(dt) {   
        if (this.moves.size() == MAX_MOVES) {
            return;
        }
        
        // Find the player.
        var head = this.body.item(0);
        var myPos = this.body.item(0).get('position');
        var playerPos = this.get('parent').get('player').get('position');
        
        var dx = myPos.x - playerPos.x;
        var dy = myPos.y - playerPos.y;
        var myVel = head.get('velocity');
        var move = {
            x: myPos.x + myVel.x,
            y: myPos.y + myVel.y,
            type: "move",
            vX: 0,
            vY: 0
        }
        
        console.log(myVel.x);
        if (myVel.x == 0) {
            if (dx > 0) {
                move.vX = -1;
            }
            else {
                move.vX = 1;
            }
        }
        else {
            if (dy > 0) {
                move.vY = -1;
            }
            else {
                move.vY = 1;
            }
        }
        console.log('adding move x: '+ move.x + ' move.y: ' + move.y);
        console.log(move);
        this.moves.add(move);
    },
    
    trackWinConditions: function() {
        var body = this.get('body');
        var headRect = body.item(0).get('boundingBox');
        var bodyRect = null;
        for (var i = 3; i < body.size(); i++) {
            bodyRect = body.item(i).get('boundingBox');
            if (geom.rectOverlapsRect(bodyRect, headRect)) {
                this.get('parent').win();
                break;
            }
        }
    },
    
    update: function(dt) {
        //var pos = util.copy(this.get('position'));
        var body = this.get('body');

        var posToMove = this.get('posToMove');
        //if(new Date().getTime() > this.get('startTime').getTime() + 800) {
        //    body.item(0).set('velocity', new geom.Point(0, 60));
        //    var pos = util.copy(body.item(i).get('position'));
        //}
        if(new Date().getTime() > this.get('startTime').getTime() + 800) {
            var pos = util.copy(body.item(0).get('position'));
            //console.log(pos.x + " " + pos.y);
        }

        for(var i=0; i<body.size() ; i++) {
            var pos = util.copy(body.item(i).get('position'));
            var vel = util.copy(body.item(i).get('velocity'));
            //console.log("on " + i + " at " + pos.x + ", " + pos.y);

            // Calculate the position if keep moving forward
            var speed = util.copy(this.get('speed'));
            var dX = dt * vel.x*speed;
            var dY = dt * vel.y*speed;
            var newX = pos.x + dX;
            var newY = pos.y + dY;
            //console.log(pos.x + " " + pos.y);

            var moves = this.get('moves');
            for(var j=0; j<moves.size() ;j++) {
                var move = util.copy(moves.item(j));
                if(this.isBetween(pos.x, newX, move.x) && this.isBetween(pos.y, newY, move.y)) {
                    if(move.type !== "move") {
                        if(move.type === "grow") {
                            this.grow();
                            moves.remove(j);
                        }
                        if(move.type === "start") {
                            console.log("should start!");
                            this.start(newX, newY);
                            moves.remove(j);
                        }
                        if(move.type === "stop") {
                            // error out
                            stop.done();
                        }
                        continue;
                    }
                    console.log("set vel for " + i + " to " + move.vX + ", " + move.vY);
                    // Set new velocity
                    body.item(i).set('velocity', new geom.Point(move.vX,move.vY));

                    var xDir = Math.abs(move.vX);
                    var yDir = Math.abs(move.vY);
                    if(i == 0) {
                        // Give leftover velocity to the correct place
                        dX += dY - Math.abs(pos.y - move.y);
                        newX = move.x + (dX*xDir);

                        dY += dX - Math.abs(pos.x - move.x);
                        newY = move.y + (dY*yDir);
                    } else {
                        // Set variable being changed to be directly in line
                        // and other one directly behind previous segment
                        var prevPos = body.item(i - 1).get('position');
                        newX = yDir*move.x + xDir*(prevPos.x - 16*move.vX);
                        newY = xDir*move.y + yDir*(prevPos.y - 16*move.vY);
                    }

                    // If this is the last segment to reach the move, remove it
                    if(i+1 == body.size()) {
                        console.log("Going to remove, on " + j + "  moves: " + moves);
                        moves.remove(j);
                    }

                    // Don't need to check any other moves (never have two moves at same spot)
                    //break;
                }
            }

            // Set and store the new position
            var newPos = this.get('body').item(i).get('newPosition');
            //console.log("new pos: " + newPos);
            if(typeof newPos !== "undefined") {
                pos.x = newPos.x;
                pos.y = newPos.y;
                this.get('body').item(i).set('newPosition');
            } else {
                pos.x = newX;
                pos.y = newY;
            }
            this.get('body').item(i).set('position', pos);
            var step2 = util.copy(this.get('step'));
            if(step2 % 1 == 0) {
                //this.printMoves();
                if(i == 0) {
                    //console.log("step: " + step2 + " i: " + i + " newX: " + newX + " newY: "+ newY);
                }
            }
        }

        var step = util.copy(this.get('step'));
        step += 1;
        this.set('step', step);
        //console.log("on step " + step);
        
        this.trackWinConditions();
    },

    // Check if val is between min and max
    isBetween: function(min, max, val) {
        // If min and max are reversed, swap them
        if(min > max) {
            var tmp = min;
            min = max;
            max = tmp;
        }

        if(val >= min && val <= max) {
            return true;
        } else {
            return false;
        }
    },

    grow: function() {
        console.log("Growing!");
        var moves = this.get('moves');
        var body = this.get('body');

        var headPos = util.copy(body.item(0).get('position'));
        var headVel = util.copy(body.item(0).get('velocity'));
        //moves.add({
        //    x: -48,
        //    y: 0,
        //    type: "grow"
        //});
        moves.add({
            x: headPos.x + 16*headVel.x,
            y: headPos.y + 16*headVel.y,
            type: "start"
        });
        this.set('moves', moves);

        // Stop all body segments
        for(var i=1; i<body.size() ; i++) {
            body.item(i).set('prevVelocity', util.copy(body.item(i).get('velocity')));
            body.item(i).set('velocity', new geom.Point(0, 0));
        }

        var sprite = cocos.nodes.Sprite.create({
            file: '/resources/snake-body.png',
            //rect: new geom.Rect(64, 0, 16, 16)
        });


        var xDir = Math.abs(headVel.x);
        var yDir = Math.abs(headVel.y);
        var newX = headPos.x - 16*headVel.x;
        var newY = headPos.y - 16*headVel.y;
        var newPos = new geom.Point(newX, newY);
        //sprite.set('position', newPos);
        sprite.set('position', headPos);
        //sprite.set('velocity', headVel);
        sprite.set('prevVelocity', headVel);
        sprite.set('velocity', new geom.Point(0,0));
        body.addAt(1, sprite);
        this.addChild({child: body.item(1)});
    },

    start: function(newX, newY) {
        console.log("Starting!");
        var body = this.get('body');
        var headVel = util.copy(body.item(0).get('velocity'));
        // First needs to be head velocity
        body.item(1).set('velocity', headVel);
        for(var k=2; k<body.size() ; k++) {
            var moves = this.get('moves');
            var oldVel = util.copy(body.item(k).get('prevVelocity'));
            console.log("k: " + k + " old vel x: " + oldVel.x + " y: " + oldVel.y);
            body.item(k).set('velocity', util.copy(body.item(k).get('prevVelocity')));
            var prevPos = body.item(k - 1).get('position');
            var prevVel = body.item(k - 1).get('velocity');
            console.log(prevPos);
            var xDir = Math.abs(prevVel.x);
            var yDir = Math.abs(prevVel.y);
            newX = yDir*prevPos.x + xDir*(prevPos.x - 16*prevVel.x);
            newY = xDir*prevPos.y + yDir*(prevPos.y - 16*prevVel.y);
            var pos = util.copy(body.item(k).get('position'));
            pos.x = newX;
            pos.y = newY;
            //this.get('body').item(k).set('position', pos);

            var pos2 = util.copy(body.item(k).get('position'));
            for(var j=0; j<moves.size() ; j++) {
                var move = util.copy(moves.item(j));
                if(this.isBetween(pos2.x, newX, move.x) && this.isBetween(pos2.y, newY, move.y)) {
                    if(move.type === "move") {
                        console.log("Between! on Move! Set vel for " + k);
                        var curVel = util.copy(body.item(k).get('velocity'));
                        curVel.x = move.vX;
                        curVel.y = move.vY;
                        body.item(k).set('velocity', curVel);

                        var prevPos = body.item(k - 1).get('position');
                        newX = yDir*move.x + xDir*(prevPos.x - 16*move.vX);
                        newY = xDir*move.y + yDir*(prevPos.y - 16*move.vY);
                        body.item(k).set('newPosition', new geom.Point(newX, newY));
                    }
                }
            }
        }

    },

    printMoves: function() {
        var moves = this.get('moves');
        for(var i=0; i<moves.size() ; i++) {
            var move = util.copy(moves.item(i));
            console.log(i + " move type: " + move.type + " loc: " + move.x + ", " + move.y);
        }
    },

    addSection: function() {
        //var body = util.copy(this.get('body'));
        var body = this.get('body');

        var sprite = cocos.nodes.Sprite.create({
            file: '/resources/snake-body.png',
            //rect: new geom.Rect(64, 0, 16, 16)
        });
        var lastPos = body.last().get('position');
        sprite.set('position', new geom.Point(lastPos.x + 16, lastPos.y));
        sprite.set('velocity', this.get('initialVelocity'));
        body.add(sprite);
        this.parent.addChild({child: body.last()});
    }
});

exports.Snake = Snake;
