## Status: ##
HTML5 Canvas SVG is currently in Alpha 2.0 and is available in the source. It is not ready for stable use as it is not feature complete. We are looking for people to contribute code and if you would like to jump on board email Alex Rhea.

### Release Notes: ###
**Alpha 1.0:** Initial proof of concept and algorithm production

**Alpha 2.0:** Complete rewrite to sandbox code to not interfere with other libraries and to add the ability for extensibility. Also, it brought a 45% faster SVG output speed.

## Requirements: ##
The beauty is that there are none. SVG Canvas runs entirely on its own with no dependencies.

## How To Use: ##
Uses your existing canvas code to generate an SVG on the fly. Using your native toDataURL to return you xml.

```

var context = new SVGCanvas( 'canvasID' );

// Canvas drawing here

var xml = context.toDataURL( 'image/svg+xml' );

```