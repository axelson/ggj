var cocos = require('cocos2d');
var geom = require('geometry');

var Food = cocos.nodes.Node.extend({
    init: function() {
        Food.superclass.init.call(this);

        var cherry = cocos.nodes.Sprite.create({
            file: '/resources/sprites.png',
            rect: new geom.Rect(112, 0, 16, 16)
        });
        this.addChild({child: cherry});
        this.set('contentSize', cherry.get('contentSize'));
    }
});

exports.Food = Food;