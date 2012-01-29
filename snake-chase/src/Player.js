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
    dying: false,
    deathFrames: null,
    sprite: null,
    
    init: function() {
        Player.superclass.init.call(this);

        this.sprite = cocos.nodes.Sprite.create({
            file: '/resources/turtle.png',
            //rect: new geom.Rect(80, 0, 16, 16)
        });

        this.sprite.set('anchorPoint', new geom.Point(0, 0));
        
        this.addChild({child: this.sprite});
        this.set('contentSize', this.sprite.get('contentSize'));
        this.set('velocity', new geom.Point(0, PLAYER_SPEED));
        
        // Initialize death frames
        this.deathFrames = Array();
        var texture = cocos.Texture2D.create({
            file: '/resources/explosion.jpg'
        });
        
        var frame = null;
        for (var i=0; i<4; i++) {
            for (var j=0; j<4; j++) {
                frame = cocos.SpriteFrame.create({
                    texture: texture,
                    rect: new geom.Rect(16 * i, 16 * j, 32, 32)
                });
                this.deathFrames.push(frame);
            }
        }
        this.scheduleUpdate();
    },

    setVelocity: function(vector) {
        if (this.dying) {
            this.set('velocity', new geom.Point(0, 0));
        }
        
        else {
            vel = util.copy(this.get('velocity'));

            vector.x *= PLAYER_SPEED;
            vector.y *= PLAYER_SPEED;

            // Prevent reverse
            if ((vel.x == 0 || vel.x != vector.x * -1) &&
                    (vel.y == 0 || vel.y != vector.y * -1)) {
                this.set('velocity', vector);
            }
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
    
    redrawSprite: function() {
        this.removeChild({child: this.sprite});
        
        this.sprite = cocos.nodes.Sprite.create({
            file: '/resources/turtle.png',
            //rect: new geom.Rect(80, 0, 16, 16)
        });

        this.sprite.set('anchorPoint', new geom.Point(0, 0));
        
        this.addChild({child: this.sprite});
    },

    testDeathConditions: function() {
        var vel = util.copy(this.get('velocity')),
            playerBox = this.get('boundingBox'),
            snakeBox = this.get('parent').get('snake').get('boundingBox');

        if (geom.rectOverlapsRect(snakeBox, playerBox)) {
            if (circleOverlap(snakeBox, playerBox) && !this.dying) {
                this.die();
            }
        }
	},
	
	die: function() {
	    this.setVelocity(new geom.Point(0, 0));
        this.dying = true;
        console.log(this.deathFrames);
        var animation = cocos.Animation.create({
            frames: this.deathFrames,
            delay: 0.1
        });
        console.log(animation);
        var animate = cocos.actions.Animate.create({
            duration: 2.0,
            animation: animation
        });
        console.log(animate);
        animate.startWithTarget(this);
        console.log(animate);
        animate.layer = this.get('parent');
        // This function will be called when the animation is done.
        animate.stop = function() {
            // Update lives and reset
            this.layer.removeLife();
        }
        this.sprite.runAction(animate);
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
