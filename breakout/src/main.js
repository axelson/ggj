// Import the cocos2d module
var cocos = require('cocos2d'),
    // Import the geometry module
    geo = require('geometry');

    var Bat = require('Bat').Bat;
    var Ball = require('Ball').Ball;

    // Create a new layer
    var Breakout = cocos.nodes.Layer.extend({
        bat: null,
        ball: null,

        init: function() {
            // You must always call the super class version of init
            Breakout.superclass.init.call(this);

            var bat = Bat.create();
            bat.set('position', new geo.Point(160, 280));
            this.addChild({child: bat});
            this.set('bat', bat);

            this.set('isMouseEnabled', true);

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
