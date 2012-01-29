var cocos = require('cocos2d'),
    geom = require('geometry'),
    util = require('util');

var PLAYER_SPEED = 100;

var circleOverlap = function(rect1, rect2) {
    // Get radiuses and approximate the center.
    var rad1 = util.copy(rect1.size.width / 2),
        rad2 = util.copy(rect2.size.width / 2);
    var pos1 = util.copy(rect1.origin),
        pos2 = util.copy(rect2.origin);
        
    pos1.x += rad1;
    pos1.y += rad1;
    pos2.x += rad2;
    pos2.y += rad2;
    
    // Calculate distance between two centers.
    var dx = pos1.x - pos2.x;
    var dy = pos1.y - pos2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < rad1 + rad2) {
        // We have overlap
        return true;
    }
    
    return false;
}

var Player = cocos.nodes.Node.extend({
    velocity: null,

    init: function() {
        Player.superclass.init.call(this);

        var sprite = cocos.nodes.Sprite.create({
            file: '/resources/sprites.png',
            rect: new geom.Rect(80, 0, 16, 16)
        });

        sprite.set('anchorPoint', new geom.Point(0, 0));
        this.addChild({child: sprite});
        this.set('contentSize', sprite.get('contentSize'));
        this.set('velocity', new geom.Point(0, PLAYER_SPEED));
        this.scheduleUpdate();
    },

    setVelocity: function(vector) {
        vel = util.copy(this.get('velocity'));

        vector.x *= PLAYER_SPEED;
        vector.y *= PLAYER_SPEED;

        // Prevent reverse
        if ((vel.x == 0 || vel.x != vector.x * -1) &&
                (vel.y == 0 || vel.y != vector.y * -1)) {
            this.set('velocity', vector);
        }
    },

    update: function(dt) {
        var pos = util.copy(this.get('position')),
            vel = util.copy(this.get('velocity'));

        pos.x += dt * vel.x;
        pos.y += dt * vel.y;

        this.set('position', pos);
        this.testBounds();
        this.testDeathConditions();
    },

    testDeathConditions: function() {
        var vel = util.copy(this.get('velocity')),
            playerBox = this.get('boundingBox'),
            snakeBox = this.get('parent').get('snake').get('boundingBox');

        if (geom.rectOverlapsRect(snakeBox, playerBox)) {
            if (circleOverlap(snakeBox, playerBox)) {
                this.setVelocity(new geom.Point(0, 0));
                var deaths = parseInt($('#death-count').html());
                $('#death-count').html(deaths + 1);
                alert("you lose");
                this.get('parent').reset();
            }
        }
	},
	
	testBounds: function() {
	    var vel = util.copy(this.get('velocity')),
            box = this.get('boundingBox'),
            winSize = cocos.Director.get('sharedDirector').get('winSize');

            if (vel.x < 0 && geom.rectGetMinX(box) < 0) {
                //Flip X velocity
                vel.x = 0;
            }

            if (vel.x > 0 && geom.rectGetMaxX(box) > winSize.width) {
                vel.x = 0;
            }

            if (vel.y < 0 && geom.rectGetMinY(box) < 0) {
                vel.y *= 0;
            }

            if (vel.y > 0 && geom.rectGetMaxY(box) > winSize.height) {
                vel.y *= 0;
            }

            this.set('velocity', vel);
        }
});

exports.Player = Player;
