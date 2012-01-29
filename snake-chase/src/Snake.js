var cocos = require('cocos2d');
var geom = require('geometry');
var util = require('util');
var doublyLinkedList = require('./DoublyLinkedList');

var Snake = cocos.nodes.Node.extend({
    velocity: null,
    body: null,
    head: null,

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
        sprite2.set('position', new geom.Point(1, 0));
        body.add(sprite2);
        this.addChild({child: body.item(0)});

        var sprite3 = cocos.nodes.Sprite.create({
            file: '/resources/sprites.png',
            rect: new geom.Rect(64, 0, 16, 16)
        });
        sprite3.set('position', new geom.Point(16, 0));
        body.add(sprite3);
        this.addChild({child: body.item(1)});

        var sprite4 = cocos.nodes.Sprite.create({
            file: '/resources/sprites.png',
            rect: new geom.Rect(64, 0, 16, 16)
        });
        sprite4.set('position', new geom.Point(32, 0));
        body.add(sprite4);
        this.addChild({child: body.item(2)});

        body.add(new geom.Point(2, 0));
        body.add(new geom.Point(3, 0));



        this.set('body', body);
    },

    update: function(dt) {
        //var pos = util.copy(this.get('position'));
        var vel = util.copy(this.get('velocity'));
        //var posTest = util.copy(this.get('head').get('position'));
        var posTest2 = util.copy(this.get('body').item(0).get('position'));
        var posTest3 = util.copy(this.get('body').item(1).get('position'));
//        var test = util.copy(this.get('head'));
//        test.set('anchorPoint', new geom.Point(-2, 0));
        //var test2 = this.get('head');
        //test2.set('anchorPoint', new geom.Point(-3, 0));
        var test3 = this.get('anchorPoint');
        //console.log("getting" + test3);

        posTest2.x += dt * -vel.x;
        posTest2.y += dt * -vel.y;
        posTest3.x += dt * -vel.x;
        posTest3.y += dt * vel.y;
        console.log("body pos x="+ posTest2.x + " and y="+ posTest2.y);
        //posTest.x += dt * vel.x;
        //posTest.y += dt * vel.y;
        //pos.x += dt * vel.x;
        //pos.y += dt * vel.y;

        //this.get('head').set('position', posTest);
        this.get('body').item(0).set('position', posTest2);
        this.get('body').item(1).set('position', posTest3);
        //this.set('position', pos);
//        this.set('head', test);
    }
});

exports.Snake = Snake;
