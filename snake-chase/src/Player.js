var cocos = require('cocos2d'),
    geom = require('geometry'),
    util = require('util');

var PLAYER_SPEED = 100;

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
