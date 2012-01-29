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
        this.scheduleUpdate();

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
    },

    update: function(dt) {
        //var pos = util.copy(this.get('position'));
        var body = this.get('body');

        for(var i=0; i<body.size() ; i++) {
            //console.log("on " + i);
            var pos = util.copy(body.item(i).get('position'));
            var vel = util.copy(body.item(i).get('velocity'));
            pos.x += dt * -vel.x;
            pos.y += dt * -vel.y;
            this.get('body').item(i).set('position', pos);
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
