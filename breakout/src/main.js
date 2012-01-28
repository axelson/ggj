// Import the cocos2d module
var cocos = require('cocos2d'),
// Import the geometry module
    geo = require('geometry');

// Create a new layer
var Breakout = cocos.nodes.Layer.extend({
    init: function() {
        // You must always call the super class version of init
        Breakout.superclass.init.call(this);

        // Get size of canvas
        var s = cocos.Director.get('sharedDirector').get('winSize');

        // Create label
        var label = cocos.nodes.Label.create({string: 'Breakout', fontName: 'Arial', fontSize: 76});

        // Add label to layer
        this.addChild({child: label, z:1});

        // Position the label in the centre of the view
        label.set('position', geo.ccp(s.width / 2, s.height / 2));
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
