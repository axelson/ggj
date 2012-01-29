var cocos = require('cocos2d');
var geom = require('geometry');
var util = require('util');
var doublyLinkedList = require('./DoublyLinkedList');

var Snake = cocos.nodes.Node.extend({
    velocity: null,
    initialVelocity: new geom.Point(60, 0),
    body: null,
    moves: null,
    head: null,
    startTime: null,
    posToMove: null,
    step: 0,

    init: function() {
        Snake.superclass.init.call(this);

        //var spriteHead = cocos.nodes.Sprite.create({
        //    file: '/resources/sprites.png',
        //    rect: new geom.Rect(96, 0, 16, 16)
        //});
        //var sprite = cocos.nodes.Sprite.create({
        //    file: '/resources/sprites.png',
        //    rect: new geom.Rect(64, 0, 16, 16)
        //});

        //sprite.set('anchorPoint', new geom.Point(0, 0));
        //spriteHead.set('anchorPoint', new geom.Point(-1, 0));
        //this.addChild({child: sprite});
        //this.addChild({child: spriteHead});
        //this.set('contentSize', sprite.get('contentSize'));
        //this.set('contentSize', spriteHead.get('contentSize'));

        //this.set('head', spriteHead);

        this.set('velocity', new geom.Point(60, 120));

        var moves = new doublyLinkedList.DoublyLinkedList()
        moves.add({
            x: -48,
            y: 0,
            vX: 0,
            vY: 60
        });
        moves.add({
            x: -48,
            y: -150,
            vX: 60,
            vY: 0
        });
        this.set('moves', moves);

        var body = new doublyLinkedList.DoublyLinkedList()
        var sprite2 = cocos.nodes.Sprite.create({
            file: '/resources/sprites.png',
            rect: new geom.Rect(96, 0, 16, 16)
        });
        sprite2.set('position', new geom.Point(0, 0));
        sprite2.set('velocity', new geom.Point(60, 0));
        body.add(sprite2);
        this.addChild({child: body.item(0)});

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

        this.scheduleUpdate();
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
            //console.log("on " + i + " at " + pos.x + ", " + pos.y);
            var vel = util.copy(body.item(i).get('velocity'));
            var dX = dt * -vel.x;
            var dY = dt * -vel.y;
            var newX = pos.x + dX;
            var newY = pos.y + dY;
            //console.log(pos.x + " " + pos.y);
            //if(pos.x <= posToMove.x

            var moves = this.get('moves');
            // Still move if there are no planned moves
            if(moves.size() == 0) {
                pos.x = newX;
                pos.y = newY;
                this.get('body').item(i).set('position', pos);
            }
            for(var j=0; j<moves.size() ;j++) {
                var move = moves.item(j);
                //console.log(move);
                //if(pos.x <= move.x &&  newX >= move.x) {
                if(this.isBetween(pos.x, newX, move.x) && this.isBetween(pos.y, newY, move.y)) {
                    //console.log('true');
                    console.log("set vel for " + i + " to " + move.vX + ", " + move.vY);
                    body.item(i).set('velocity', new geom.Point(move.vX,move.vY));

                    //dY += dX - Math.abs(pos.x - move.x);
                    newY = dt * -vel.y;
                    console.log(i + ": setting pos x ("+pos.x+") to move x "+ move.x);
                    pos.x = move.x;
                    console.log(i + ": setting pos x ("+pos.x+") to move x "+ move.x);
                    pos.y = pos.y + dY;
                    this.get('body').item(i).set('position', pos);
                    var pos2 = util.copy(body.item(i).get('position'));
                    console.log(i + " New: "+ pos2.x + ", "+ pos2.y);

                    // If this is the last segment to reach the move, remove it
                    if(i+1 == body.size()) {
                        console.log("Going to remove, on " + j + "  moves: " + moves);
                        moves.remove(j);
                        console.log("Going to remove, on " + j + "  moves: " + moves);
                    }

                } else {
                    pos.x = newX;
                    pos.y = newY;
                    this.get('body').item(i).set('position', pos);
                }

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
            file: '/resources/sprites.png',
            rect: new geom.Rect(64, 0, 16, 16)
        });
        var lastPos = body.last().get('position');
        sprite.set('position', new geom.Point(lastPos.x + 16, 0));
        sprite.set('velocity', this.get('initialVelocity'));
        body.add(sprite);
        this.addChild({child: body.last()});
    }
});

exports.Snake = Snake;
