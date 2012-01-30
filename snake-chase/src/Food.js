var cocos = require('cocos2d');
var geom = require('geometry');

var Food = cocos.nodes.Node.extend({
    visible: false,
    
    init: function() {
        Food.superclass.init.call(this);

        var cherry = cocos.nodes.Sprite.create({
            file: '/resources/sprites.png',
            rect: new geom.Rect(112, 0, 16, 16)
        });
        this.addChild({child: cherry});
        this.set('contentSize', cherry.get('contentSize'));
        this.schedule({
            method: this.update
        })
    },
    
    update: function(dt) {
        // We check if someone is consuming us.
        if (this.visible) {
            var foodBox = this.get('boundingBox'),
                playerBox = this.get('parent').get('player').get('boundingBox');

            if (geom.rectOverlapsRect(foodBox, playerBox)) {
                this.get('parent').removeFood(this);
                
                console.log('pickup.play');
                var snd = new Audio("/__jah__/resources/pickup.wav");
                snd.play();
            }
        }
    }
});

exports.Food = Food;