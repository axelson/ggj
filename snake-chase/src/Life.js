var cocos = require('cocos2d');
var geom = require('geometry');

var Life = cocos.nodes.Node.extend({
    init: function() {
        Life.superclass.init.call(this);

        var sprite = cocos.nodes.Sprite.create({
            file: '/resources/sprites.png',
            rect: new geom.Rect(80, 0, 16, 16)
        });

        sprite.set('anchorPoint', new geom.Point(0, 0));
        this.addChild({child: sprite});
        this.set('contentSize', sprite.get('contentSize'));
    }
});

exports.Life = Life;
