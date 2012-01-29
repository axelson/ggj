var cocos = require('cocos2d');
var geom = require('geometry');

var Background = cocos.nodes.Node.extend({
    visible: true,
    
    init: function() {
        Background.superclass.init.call(this);

        var bg = cocos.nodes.Sprite.create({
            file: '/resources/bg-tile.jpg',
            //rect: new geom.Rect(112, 0, 16, 16)
        });
        this.addChild({child: bg});
        this.set('contentSize', bg.get('contentSize'));
        this.set('zOrder', 0);
    },
    
});

exports.Background = Background;