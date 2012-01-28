// Import the cocos2d module
var cocos = require('cocos2d'),
    // Import the geometry module
    geo = require('geometry');

    var Bat = require('Bat').Bat;

    // Create a new layer
    var Breakout = cocos.nodes.Layer.extend({
        bat: null,

        init: function() {
            // You must always call the super class version of init
            Breakout.superclass.init.call(this);

            var bat = Bat.create();
            bat.set('position', new geo.Point(160, 280));
            this.addChild({child: bat});
            this.set('bat', bat);
        }
    });

exports.main = function() {
    // Initialise application

    // Get director
    var director = cocos.Director.get('sharedDirector');

    // Attach director to our <div> element
    director.attachInView(document.getElementById('breakout_app'));

    // Create a scene
    var scene = cocos.nodes.Scene.create();

    // Add our layer to the scene
    scene.addChild({child: Breakout.create()});

    // Run the scene
    director.runWithScene(scene);
};
