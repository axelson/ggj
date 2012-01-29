var cocos = require('cocos2d');
var geom = require('geometry');
var util = require('util');
var doublyLinkedList = require('./DoublyLinkedList');

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
        
        // We will add to parent to get initial
        
        var moves = new doublyLinkedList.DoublyLinkedList()

        // moves.add({
        //     x: -48,
        //     y: 0,
        //     vX: 0,
        //     vY: -1
        // });
        // moves.add({
        //     x: -48,
        //     y: -150,
        //     vX: +1,
        //     vY: 0
        // });
        // moves.add({
        //     x: -10,
        //     y: -150,
        //     vX: 0,
        //     vY: +1
        // });
        // moves.add({
        //     x: -10,
        //     y: -30,
        //     vX: -1,
        //     vY: 0
        // });
        // moves.add({
        //     x: -40,
        //     y: -30,
        //     vX: 0,
        //     vY: +1
        // });
        // moves.add({
        //     x: -40,
        //     y: 30,
        //     vX: +1,
        //     vY: 0
        // });
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

        this.set('posToMove', new geom.Point(-48,0));
        var posToMove = this.get('posToMove');
        console.log(posToMove.x + " " + posToMove.y);

        //this.set('step', 0);
        
        this.schedule({
            method: this.trackPlayer,
            interval: 1
        });
        
        this.scheduleUpdate();
    },
    
    trackPlayer: function() {   
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
        console.log('adding move');
        console.log(move);
        this.moves.add(move);
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
                        newY = xDir*move.y + yDir*(prevPos.y - 16*move.vY);
                        newX = yDir*move.x + xDir*(prevPos.x - 16*move.vX);
                    }

                    // If this is the last segment to reach the move, remove it
                    if(i+1 == body.size()) {
                        console.log("Going to remove, on " + j + "  moves: " + moves);
                        moves.remove(j);
                    }

                    // Don't need to check any other moves (never have two moves at same spot)
                    break;
                }
            }

            // Set and store the new position
            pos.x = newX;
            pos.y = newY;
            this.get('body').item(i).set('position', pos);
            var step2 = util.copy(this.get('step'));
            if(step2 % 10 == 0) {
                //console.log("step: " + step2 + " i: " + i + " newX: " + newX + " newY: "+ newY);
            }
        }

        var step = util.copy(this.get('step'));
        step += 1;
        this.set('step', step);
        //console.log("on step " + step);
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
