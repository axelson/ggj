var cocos = require('cocos2d');
var geom = require('geometry');

var Bat = cocos.nodes.Node.extend({
    init: function() {
              Bat.superclass.init.call(this);
              this.addChild({child: sprite});
              this.set('contentSize', sprite.get('contentSize'));
          }
});

var sprite = cocos.nodes.Sprite.create({
    file: '/resources/sprites.png',
    rect: new geom.Rect(0, 0, 64, 16)
});
sprite.set('anchorPoint', new geom.Point(0, 0));

exports.Bat = Bat;
