"use strict"  // Use strict JavaScript mode

var cocos  = require('cocos2d')   // Import the cocos2d module
  , events = require('events')    // Import the events module
  , geo    = require('geometry')  // Import the geometry module
  , ccp    = geo.ccp              // Short hand to create points
  , Player   = require('./Player').Player
  , Snake   = require('./Snake').Snake;
  
var KEYS = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
};

var SnakeChase = cocos.nodes.Layer.extend(/** @lends Snake-chase# */{
    /**
     * @class Initial application layer
     * @extends cocos.nodes.Layer
     * @constructs
     */
    init: function () {
        // You must always call the super class version of init
        SnakeChase.superclass.init.call(this);

        this.set('isKeyboardEnabled', true);
        // Get size of canvas
        // var s = cocos.Director.get('sharedDirector.winSize')
        // 
        // // Create label
        // var label = cocos.nodes.Label.create({ string: 'Snake Chase', fontName: 'Arial', fontSize: 76 })
        // 
        // // Add label to layer
        // this.addChild({ child: label, z:1 })
        // 
        // // Position the label in the centre of the view
        // label.set('position', ccp(s.width / 2, s.height / 2))
        var player = Player.create();
        player.set('position', new geo.Point(160, 250));
        this.addChild({child: player});
        this.set('player', player);

        var snake = Snake.create();
        snake.set('position', new geo.Point(280, 250));
        this.addChild({child: snake});
        this.set('snake', snake);
    },

    keyDown: function(event) {
        // var keys = [];
        // for(var key in event) {
        //     keys.push(key);
        // }
        //
        // console.log(keys);
        // left: 37 right: 39 up: 38 down: 40
        if (event.keyCode == KEYS.left) {
            alert('left');
        }
        else if (event.keyCode == KEYS.up) {
            alert('up');
        }
        else if (event.keyCode == KEYS.right) {
            alert('right');
        }
        else if (event.keyCode == KEYS.down) {
            alert('down');
        }
    }
})

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
        scene.addChild({ child: SnakeChase.create() })

        // Run the scene
        director.replaceScene(scene)
    })

    // Preload our assets
    director.runPreloadScene()
}
