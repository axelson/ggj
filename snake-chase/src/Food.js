var cocos = require('cocos2d');
var geom = require('geometry');

var Food = cocos.nodes.Node.extend({
    visible: false,
    added: false,
    
    init: function(parent) {
        Food.superclass.init.call(this);

        var cherry = cocos.nodes.Sprite.create({
            file: '/resources/sprites.png',
            rect: new geom.Rect(112, 0, 16, 16)
        });
        this.addChild({child: cherry});
        this.set('contentSize', cherry.get('contentSize'));
        //var moves = this.get('parent').get('snake').get('moves');
        this.schedule({
            method: this.update
        })
    },
    
    update: function(dt) {
        // We check if someone is consuming us.
        if (this.visible) {
            var foodBox = this.get('boundingBox'),
                playerBox = this.get('parent').get('player').get('boundingBox');
            var snake = this.get('parent').get('snake');
            //var snakeBox = this.get('parent').get('snake').get('body').item(0).get('boundingBox');
            var snakeBox = snake.get('body').item(0).get('boundingBox');

            if (geom.rectOverlapsRect(foodBox, snakeBox)) {
                this.get('parent').removeFood(this);
                
                console.log('pickup.play');
                var snd = new Audio("/__jah__/resources/pickup.wav");
                snd.play();
                //var parent = this.get('parent');
                console.log('got parent');
                //var snake = parent.get('snake');
                console.log('got snake');
                snake.grow();
                console.log('snake grow');
            }
            if(this.get('added') === false) {
                var pos = this.get('position');
                //var moves = parent.get('snake').get('moves');
                var moves = this.get('parent').get('snake').get('moves');
                console.log("adding food at " + pos.x + ", " + pos.y);
                //moves.add({
                //    x: pos.x,
                //    y: pos.y,
                //    type: "bogus"
                //});
                var parent = this.get('parent');
                var snake = parent.get('snake');
                var moves = snake.set('moves', moves);
                this.set('added', true);
            }
        }
    }
});

exports.Food = Food;
