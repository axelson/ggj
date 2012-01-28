"use strict"  // Use strict JavaScript mode

var cocos  = require('cocos2d')   // Import the cocos2d module
  , events = require('events')    // Import the events module
  , geo    = require('geometry')  // Import the geometry module
  , ccp    = geo.ccp              // Short hand to create points

var Bat = require('./Bat').Bat;
var Ball = require('./Ball').Ball;

var Breakout = cocos.nodes.Layer.extend(/** @lends Breakout# */{
    /**
     * @class Initial application layer
     * @extends cocos.nodes.Layer
     * @constructs
     */
    bat: null,
    ball: null,
    
    init: function () {
        // You must always call the super class version of init
        Breakout.superclass.init.call(this)

        this.set('isMouseEnabled', true);
        
        var bat = Bat.create();
        bat.set('position', new geo.Point(160, 280));
        this.addChild({child: bat});
        this.set('bat', bat);
        
        var ball = Ball.create();
        ball.set('position', new geo.Point(160, 250));
        this.addChild({child: ball});
        this.set('ball', ball);
    },
    
    mouseMoved: function(evt) {
        var bat = this.get('bat');
 
        var batPos = bat.get('position');
        batPos.x = evt.locationInCanvas.x;
        bat.set('position', batPos);
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
    director.attachInView(document.getElementById('breakout_app'))

    // Wait for the director to finish preloading our assets
    events.addListener(director, 'ready', function (director) {
        // Create a scene
        var scene = cocos.nodes.Scene.create()

        // Add our layer to the scene
        scene.addChild({ child: Breakout.create() })

        // Run the scene
        director.replaceScene(scene)
    })

    // Preload our assets
    director.runPreloadScene()
}
