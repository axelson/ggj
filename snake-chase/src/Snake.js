var cocos = require('cocos2d');
var geom = require('geometry');

var Snake = cocos.nodes.Node.extend({
    init: function() {
        Snake.superclass.init.call(this);

        var spriteHead = cocos.nodes.Sprite.create({
            file: '/resources/sprites.png',
            rect: new geom.Rect(96, 0, 16, 16)
        });
        var sprite = cocos.nodes.Sprite.create({
            file: '/resources/sprites.png',
            rect: new geom.Rect(64, 0, 16, 16)
        });

        sprite.set('anchorPoint', new geom.Point(0, 0));
        spriteHead.set('anchorPoint', new geom.Point(-1, 0));
        this.addChild({child: sprite});
        this.addChild({child: spriteHead});
        this.set('contentSize', sprite.get('contentSize'));
        this.set('contentSize', spriteHead.get('contentSize'));
    }
});

exports.Snake = Snake;
