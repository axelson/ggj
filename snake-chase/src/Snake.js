var cocos = require('cocos2d');
var geom = require('geometry');
var util = require('util');
var doublyLinkedList = require('./DoublyLinkedList');

var Snake = cocos.nodes.Node.extend({
    velocity: null,
    initialVelocity: new geom.Point(60, 0),
    body: null,
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
            //console.log("on " + i);
            var pos = util.copy(body.item(i).get('position'));
            var vel = util.copy(body.item(i).get('velocity'));
            var dX = dt * -vel.x;
            var dY = dt * -vel.y;
            var newX = pos.x + dX;
            var newY = pos.y + dY;
            //console.log(pos.x + " " + pos.y);
            //if(pos.x <= posToMove.x

            var posToMove = this.get('posToMove');
            //console.log(posToMove);
            //if(pos.x <= posToMove.x &&  newX >= posToMove.x) {
            if(this.isBetween(pos.x, newX, posToMove.x) && this.isBetween(pos.y, newY, posToMove.y)) {
                //console.log('true');
                console.log("set vel for " + i);
                body.item(i).set('velocity', new geom.Point(0,60));

                dY += dX - Math.abs(pos.x - posToMove.x);
                newY = dt * -vel.y;
                pos.x = posToMove.x;
                pos.y = pos.y + dY;
            } else {
                pos.x = newX;
                pos.y = newY;
            }

            this.get('body').item(i).set('position', pos);
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
