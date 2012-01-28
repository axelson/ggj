"use strict"  // Use strict JavaScript mode

var cocos  = require('cocos2d')   // Import the cocos2d module
  , events = require('events')    // Import the events module
  , geo    = require('geometry')  // Import the geometry module
  , ccp    = geo.ccp              // Short hand to create points

var Bat = require('./Bat').Bat;

var Gamejam = cocos.nodes.Layer.extend(/** @lends Gamejam# */{
    /**
     * @class Initial application layer
     * @extends cocos.nodes.Layer
     * @constructs
     */
		bat: null,
    init: function () {
        // You must always call the super class version of init
        Gamejam.superclass.init.call(this);

				var bat = Bat.create();
				bat.set('position', new geo.Point(160, 280));
				this.addChild({child: bat});
				this.set('bat', bat);
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
    director.attachInView(document.getElementById('gamejam_app'))

    // Wait for the director to finish preloading our assets
    events.addListener(director, 'ready', function (director) {
        // Create a scene
        var scene = cocos.nodes.Scene.create()

        // Add our layer to the scene
        scene.addChild({ child: Gamejam.create() })

        // Run the scene
        director.replaceScene(scene)
    })

    // Preload our assets
    director.runPreloadScene()
}
