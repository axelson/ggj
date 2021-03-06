var cocos = require('cocos2d'),
    geom = require('geometry'),
    util = require('util');

var PLAYER_SPEED = 120;

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
    
    // console.log(pos1);
    // console.log(pos2);
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
    flipped: false,
    
    init: function(opts) {
        Player.superclass.init.call(this);

        this.sprite = cocos.nodes.Sprite.create({
            file: '/resources/turtle.png',
            //rect: new geom.Rect(80, 0, 16, 16)
        });

        this.sprite.set('anchorPoint', new geom.Point(0, 0));
        
        this.addChild({child: this.sprite});
        this.set('contentSize', this.sprite.get('contentSize'));
        this.set('velocity', new geom.Point(0, PLAYER_SPEED));
        if (opts.velocity) {
            this.set('velocity', opts.velocity);
        }
        
        // Initialize death frames
        this.deathFrames = Array();
        var texture = cocos.Texture2D.create({
            file: '/resources/explosion.png'
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
                if ((vector.x < 0 && !this.flipped) || (vector.x > 0 && this.flipped) ) {
                    // console.log('flip');
                    this.flipped = !this.flipped;
                    var flip = cocos.actions.FlipX.create({
                        flipX: this.flipped
                    });
                    this.sprite.runAction(flip);
                }
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
            file: '/resources/turtle.png'
            //rect: new geom.Rect(80, 0, 16, 16)
        });

        this.sprite.set('anchorPoint', new geom.Point(0, 0));
        
        this.addChild({child: this.sprite});
    },

    testDeathConditions: function() {
        var vel = util.copy(this.get('velocity')),
            playerBox = this.get('boundingBox'),
            snakeBody = this.get('parent').get('snake').get('body'),
            snakePos = this.get('parent').get('snake').get('position');
            
        var i = 0;
        var segment = snakeBody.item(i);
        var segmentBox = null;
        // console.log(snakePos);
        while(segment !== null) {
            segmentBox = segment.get('boundingBox');
            if (circleOverlap(segmentBox, playerBox) && !this.dying) {
                console.log('die');
                this.die();
                break;
            }
            
            i += 1;
            segment = snakeBody.item(i);
        }
	},
	
	playStopEffect: function() {
	    console.log('stop.play');
        var snd = new Audio("/__jah__/resources/stop.wav");
        snd.play();
    },

	playDeadEffect: function() {
	    console.log('dead.play');
        var snd = new Audio("/__jah__/resources/dead.wav");
        snd.play();
    },
                  
	die: function() {
	    this.setVelocity(new geom.Point(0, 0));
        this.dying = true;
        // console.log(this.deathFrames);
        var animation = cocos.Animation.create({
            frames: this.deathFrames,
            delay: 0.1
        });
        // console.log(animation);
        var animate = cocos.actions.Animate.create({
            duration: 2.0,
            animation: animation
        });
        // console.log(animate);
        animate.startWithTarget(this);
        animate.layer = this.get('parent');
        // This function will be called when the animation is done.
        animate.stop = function() {
            // Update lives and reset
            this.layer.removeLife();
        }
        this.sprite.runAction(animate);
        
        this.playDeadEffect();
	},
	
	testBounds: function() {
	    var vel = util.copy(this.get('velocity')),
            box = this.get('boundingBox'),
            winSize = cocos.Director.get('sharedDirector').get('winSize');

            if (vel.x < 0 && geom.rectGetMinX(box) < 0) {
                //Flip X velocity
                vel.x = 0;
                if (vel.x == 0 && vel.y == 0) {
                  this.playStopEffect();
                }
            }

            if (vel.x > 0 && geom.rectGetMaxX(box) > winSize.width) {
                vel.x = 0;
                if (vel.x == 0 && vel.y == 0) {
                  this.playStopEffect();
                }                
            }

            if (vel.y < 0 && geom.rectGetMinY(box) < 0) {
                vel.y *= 0;
                if (vel.x == 0 && vel.y == 0) {
                  this.playStopEffect();
                }
            }

            if (vel.y > 0 && geom.rectGetMaxY(box) > winSize.height) {
                vel.y *= 0;
                if (vel.x == 0 && vel.y == 0) {
                  this.playStopEffect();
                }
            }

            this.set('velocity', vel);
            
        }
});

exports.Player = Player;
