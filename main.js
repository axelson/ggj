(function(){
__jah__.resources["/Background.js"] = {data: function (exports, require, module, __filename, __dirname) {
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
}, mimetype: "application/javascript", remote: false}; // END: /Background.js


__jah__.resources["/Food.js"] = {data: function (exports, require, module, __filename, __dirname) {
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
            }
        }
    }
});

exports.Food = Food;
}, mimetype: "application/javascript", remote: false}; // END: /Food.js


__jah__.resources["/Life.js"] = {data: function (exports, require, module, __filename, __dirname) {
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

}, mimetype: "application/javascript", remote: false}; // END: /Life.js


__jah__.resources["/main.js"] = {data: function (exports, require, module, __filename, __dirname) {
"use strict"  // Use strict JavaScript mode

var cocos  = require('cocos2d')   // Import the cocos2d module
  , events = require('events')    // Import the events module
  , geo    = require('geometry')  // Import the geometry module
  , ccp    = geo.ccp              // Short hand to create points
  , util   = require('util')
  , Player = require('./Player').Player
  , Life = require('./Life').Life
  , Food   = require('./Food').Food
  , Snake  = require('./Snake').Snake
  , Background  = require('./Background').Background;
  
var KEYS = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
};

var MAX_FOOD = 5;

var SnakeChase = cocos.nodes.Layer.extend(/** @lends Snake-chase# */{
    /**
     * @class Initial application layer
     * @extends cocos.nodes.Layer
     * @constructs
     */
    player: null,
    snake: null,
    food: null,
    tick: null,
    timeLabel: null,
    level: null,
    points: null,
    
    init: function (opts) {
        // You must always call the super class version of init
        this.level = opts.level;
        this.points = opts.points;
        
        SnakeChase.superclass.init.call(this);

        this.set('isKeyboardEnabled', true);
        
        // Set up lives on the right side.
        this.lives = Array();
        this.resetLives(opts.lives);
        
        // Set up timer on the left side.
        var timeLabel = cocos.nodes.Label.create({string: "Time: 0:00", fontSize: 16});
        timeLabel.set('anchorPoint', new geo.Point(0, 0));
        timeLabel.set('position', new geo.Point(15, 10));
        this.addChild({child: timeLabel});
        this.timeLabel = timeLabel;
        
        this.tick = 0;
        this.schedule({
            method: this.updateTimer,
            interval: 1
        });
        
        // Set up level label
        var winSize = cocos.Director.get('sharedDirector').get('winSize');
        var levelLabel = cocos.nodes.Label.create({string: "Level: " + this.level, fontSize: 16});
        levelLabel.set('anchorPoint', new geo.Point(0, 0));
        levelLabel.set('position', new geo.Point(winSize.width / 2 - winSize.width / 4 , 10));
        this.addChild({child: levelLabel});

        // Set up point label
        var winSize = cocos.Director.get('sharedDirector').get('winSize');
        var pointLabel = cocos.nodes.Label.create({string: "Points: " + this.points, fontSize: 16});
        pointLabel.set('anchorPoint', new geo.Point(0, 0));
        pointLabel.set('position', new geo.Point(winSize.width / 2 , 10));
        this.addChild({child: pointLabel});

        var background = Background.create();
        background.set('position', new geo.Point(720,580));
        this.addChild({child: background});
        this.set('background', background);
        
        var player = Player.create();
        player.set('position', new geo.Point(160, 250));
        this.addChild({child: player});
        this.set('player', player);

        var snake = Snake.create();
        snake.set('position', new geo.Point(280, 250));
        this.addChild({child: snake});
        this.set('snake', snake);
        
        this.food = new BArray();
        var food = null;
        for (var i=0; i<MAX_FOOD; i++) {
            this.food.push(Food.create());
        }
        console.log(this.food);
        this.schedule({
            method: this.addFood,
            interval: 3
        });
    },
    
    reset: function() {
        this.player.redrawSprite();
        this.player.dying = false;
        this.player.set('position', new geo.Point(160, 250));
        this.snake.set('position', new geo.Point(280, 250));
        this.player.setVelocity(new geo.Point(0, 0));
    },
    
    updateTimer: function(dt) {
        this.tick += 1;
        
        var minutes = Math.floor(this.tick / 60);
        var seconds = this.tick % 60;
        var timeString = 'Time: ' + minutes + ':';
        if (seconds < 10) {
            timeString += '0' + seconds;
        }
        else {
            timeString += '' + seconds;
        }
        
        this.timeLabel.set('string', timeString);
    },
    
    addFood: function() {
        var food = null;
        for(var i=0; i<MAX_FOOD; i++) {
            food = this.food.array[i];
            if (!food.visible) {
                // Generate random location within bounds.
                var winSize = cocos.Director.get('sharedDirector').get('winSize');
                // We add and subtract 16 to compensate for the size of the food.
                var x = Math.floor(16 + Math.random() * (winSize.width - 16));
                var y = Math.floor(16 + Math.random() * (winSize.height - 16));
                food.set('position', new geo.Point(x, y));
                this.food.push(food);
                food.visible = true;
                this.addChild({child: food});
                break;
            }
        }
    },
    
    removeFood: function(food) {
        //Find the food to be removed.
        for(var i=0; i<this.food.array.length; i++) {
            if (this.food.array[i] == food) {
                this.food.array[i].visible = false;
                this.removeChild({child: this.food.array[i]});
                // Test code: commented out for now.
                // this.win();
            }
        }
    },
    
    resetLives: function(lives) {
        // Get size of canvas.
        var s = cocos.Director.get('sharedDirector.winSize');
        
        var life = null;
        for (var i=0; i<lives; i++) {
            life = Life.create();
            life.set('position', new geo.Point(s.width - 20 * (i + 1), 20));
            this.addChild({child: life});
            this.lives.push(life);
        }
    },

    keyDown: function(event) {
        // console.log(event.keyCode);
        var player = this.get('player');
        var pos = player.get('position');
        
        if (event.keyCode == KEYS.left) {
            player.setVelocity(new geo.Point(-1, 0));
        }
        else if (event.keyCode == KEYS.up) {
            player.setVelocity(new geo.Point(0, -1));
        }
        else if (event.keyCode == KEYS.right) {
            player.setVelocity(new geo.Point(1, 0));
        }
        else if (event.keyCode == KEYS.down) {
            player.setVelocity(new geo.Point(0, 1));
        }
    },
    
    removeLife: function() {
        // console.log(this.lives);
        if (this.lives.length > 0) {
            var life = this.lives.pop();
            // console.log(life);
            this.removeChild({child: life});
            this.reset();
        }
        else {
            // Game over!
            var director = cocos.Director.get('sharedDirector');
            var scene = cocos.nodes.Scene.create();
            scene.addChild({child: GameOver.create()});
            director.replaceScene(scene);
        }
    },
    
    win: function() {
        var director = cocos.Director.get('sharedDirector');
        var scene = cocos.nodes.Scene.create();
        var next = NextLevel.create({
            nextLevel: this.level + 1,
            time: this.tick,
            points: this.points + 100,
            lives: this.lives.length
        });
        scene.addChild({child: next});
        director.replaceScene(scene);
    }
});

var Menu = cocos.nodes.Layer.extend({
    init: function() {
        Menu.superclass.init.call(this);
        
        var s = cocos.Director.get('sharedDirector').get('winSize');
        
        var label = cocos.nodes.Label.create({string: 'Snake Chase!', fontSize: 32});
        this.addChild({child: label, z:1});
        label.set('position', geo.ccp(s.width / 2 - 100, 30));
        label.set('position', geo.ccp(s.width / 2, s.height / 4));
        
        this.set('isMouseEnabled', true);
        
        var itemPlay = cocos.nodes.MenuItemImage.create({
            normalImage: '/resources/title.png',
            selectedImage: '/resources/start.png',
            callback: util.callback(this, 'playCallback')
        });
        
        var menu = cocos.nodes.Menu.create({
            items: [itemPlay],
        });
        itemPlay.set('position', geo.ccp(s.width / 2, s.height / 2));
        menu.set('position', ccp(0, 0));
        this.addChild({child: menu, z: 1});
    },
    
    playCallback: function() {
        console.log('Play!');
        var director = cocos.Director.get('sharedDirector');
        var scene = cocos.nodes.Scene.create();
        scene.addChild({child: SnakeChase.create({level: 1, points: 0, lives: 3})});
        director.replaceScene(scene);
    }
});

var GameOver = cocos.nodes.Layer.extend({
    init: function() {
        GameOver.superclass.init.call(this);
        
        var s = cocos.Director.get('sharedDirector').get('winSize');
        
        var label = cocos.nodes.Label.create({string: 'Game Over!', fontSize: 32});
        this.addChild({child: label, z:1});
        label.set('position', geo.ccp(s.width / 2 - 100, 30));
        label.set('position', geo.ccp(s.width / 2, s.height / 4));
        
        this.set('isMouseEnabled', true);
        
        var itemPlay = cocos.nodes.MenuItemImage.create({
            normalImage: '/resources/try-again.png',
            selectedImage: '/resources/try-again.png',
            callback: util.callback(this, 'playCallback')
        });
        
        var menu = cocos.nodes.Menu.create({
            items: [itemPlay],
        });
        itemPlay.set('position', geo.ccp(s.width / 2, s.height / 2));
        menu.set('position', ccp(0, 0));
        this.addChild({child: menu, z: 1});
    },
    
    playCallback: function() {
        console.log('Play!');
        var director = cocos.Director.get('sharedDirector')
        var scene = cocos.nodes.Scene.create();
        scene.addChild({child: SnakeChase.create({level: 1, points: 0, lives: 3})});
        director.replaceScene(scene);
    }
});

var NextLevel = cocos.nodes.Layer.extend({
    time: null,
    points: null,
    nextLevel: null,
    lives: null,
    
    init: function(opts) {
        NextLevel.superclass.init.call(this);
        this.time = opts.time;
        this.points = opts.points;
        this.nextLevel = opts.nextLevel;
        this.lives = opts.lives;
        console.log(opts.lives);
        var s = cocos.Director.get('sharedDirector').get('winSize');
        
        var msg = 'You finished in ' + this.time + ' seconds!';
        var label = cocos.nodes.Label.create({string: msg, fontSize: 32});
        this.addChild({child: label, z:1});
        label.set('position', geo.ccp(s.width / 2 - 100, 30));
        label.set('position', geo.ccp(s.width / 2, s.height / 4));
        
        this.set('isMouseEnabled', true);
        
        var itemPlay = cocos.nodes.MenuItemImage.create({
            normalImage: '/resources/next.png',
            selectedImage: '/resources/next.png',
            callback: util.callback(this, 'nextCallback')
        });
        
        var menu = cocos.nodes.Menu.create({
            items: [itemPlay],
        });
        itemPlay.set('position', geo.ccp(s.width / 2, s.height / 2));
        menu.set('position', ccp(0, 0));
        this.addChild({child: menu, z: 1});
    },
    
    nextCallback: function() {
        console.log('Play!');
        var director = cocos.Director.get('sharedDirector')
        var scene = cocos.nodes.Scene.create();
        scene.addChild({child: SnakeChase.create({
            level: this.nextLevel,
            points: this.nextLevel * 100,
            lives: this.lives
        })});
        director.replaceScene(scene);
    }
});

/**
 * Entry point for the application
 */
exports.main = function () {
    // Initialise application

    // Get director
    var director = cocos.Director.get('sharedDirector')

    // Attach director to our <div> element
    director.attachInView(document.getElementById('snake_chase_app'))

    // Wait for the director to finish preloading our assets
    events.addListener(director, 'ready', function (director) {
        // Create a scene
        var scene = cocos.nodes.Scene.create()

        // Add our layer to the scene
        scene.addChild({ child: Menu.create() })

        // Run the scene
        director.replaceScene(scene)
    })

    // Preload our assets
    director.runPreloadScene();
}

}, mimetype: "application/javascript", remote: false}; // END: /main.js


__jah__.resources["/Player.js"] = {data: function (exports, require, module, __filename, __dirname) {
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

}, mimetype: "application/javascript", remote: false}; // END: /Player.js


__jah__.resources["/resources/bg-tile.jpg"] = {data: __jah__.assetURL + "/resources/bg-tile.jpg", mimetype: "image/jpeg", remote: true};
__jah__.resources["/resources/cherries.png"] = {data: __jah__.assetURL + "/resources/cherries.png", mimetype: "image/png", remote: true};
__jah__.resources["/resources/dead.wav"] = {data: __jah__.assetURL + "/resources/dead.wav", mimetype: "audio/x-wav", remote: true};
__jah__.resources["/resources/explosion.png"] = {data: __jah__.assetURL + "/resources/explosion.png", mimetype: "image/png", remote: true};
__jah__.resources["/resources/next.png"] = {data: __jah__.assetURL + "/resources/next.png", mimetype: "image/png", remote: true};
__jah__.resources["/resources/pickup.wav"] = {data: __jah__.assetURL + "/resources/pickup.wav", mimetype: "audio/x-wav", remote: true};
__jah__.resources["/resources/snake-body.png"] = {data: __jah__.assetURL + "/resources/snake-body.png", mimetype: "image/png", remote: true};
__jah__.resources["/resources/snake-chase-bg.mp3"] = {data: __jah__.assetURL + "/resources/snake-chase-bg.mp3", mimetype: "audio/mpeg", remote: true};
__jah__.resources["/resources/snake-head.png"] = {data: __jah__.assetURL + "/resources/snake-head.png", mimetype: "image/png", remote: true};
__jah__.resources["/resources/sprites.png"] = {data: __jah__.assetURL + "/resources/sprites.png", mimetype: "image/png", remote: true};
__jah__.resources["/resources/start.png"] = {data: __jah__.assetURL + "/resources/start.png", mimetype: "image/png", remote: true};
__jah__.resources["/resources/stop.wav"] = {data: __jah__.assetURL + "/resources/stop.wav", mimetype: "audio/x-wav", remote: true};
__jah__.resources["/resources/title.png"] = {data: __jah__.assetURL + "/resources/title.png", mimetype: "image/png", remote: true};
__jah__.resources["/resources/try-again.png"] = {data: __jah__.assetURL + "/resources/try-again.png", mimetype: "image/png", remote: true};
__jah__.resources["/resources/turtle-left.png"] = {data: __jah__.assetURL + "/resources/turtle-left.png", mimetype: "image/png", remote: true};
__jah__.resources["/resources/turtle-right.png"] = {data: __jah__.assetURL + "/resources/turtle-right.png", mimetype: "image/png", remote: true};
__jah__.resources["/resources/turtle.png"] = {data: __jah__.assetURL + "/resources/turtle.png", mimetype: "image/png", remote: true};
__jah__.resources["/Snake.js"] = {data: function (exports, require, module, __filename, __dirname) {
var cocos = require('cocos2d');
var geom = require('geometry');

var Snake = cocos.nodes.Node.extend({
    init: function() {
        Snake.superclass.init.call(this);

        var spriteHead = cocos.nodes.Sprite.create({
            file: '/resources/snake-head.png',
            //rect: new geom.Rect(96, 0, 16, 16)
        });
        var sprite = cocos.nodes.Sprite.create({
            file: '/resources/snake-body.png',
            //rect: new geom.Rect(64, 0, 16, 16)
        });

        sprite.set('anchorPoint', new geom.Point(0, 0));
        spriteHead.set('anchorPoint', new geom.Point(-1, 0));
        this.addChild({child: sprite});
        this.addChild({child: spriteHead});
        this.set('contentSize', sprite.get('contentSize'));
        this.set('contentSize', spriteHead.get('contentSize'));
    }
});

exports.Snake = Snake;

}, mimetype: "application/javascript", remote: false}; // END: /Snake.js


})();