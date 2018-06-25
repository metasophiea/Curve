# [curve](http://metasophiea.com/curve)
## A Project In Two Parts
Curve is a musical workstation designed to be like real-world music making machines. There's synthesizers and effect units and keyboards and all sorts of stuff you can plug together and play with. 

Workspace is a interface framework that is being written alongside Curve. With it, one can create graphical objects and have them interact with eachother and the user, in a visual and natural way. All the basic and common stuff is taken care of, so you can focus on making what you actually want to make. It's not useful for all situations, but if you know that networking objects together will be a real factor in whatever you're doing; Workspace will be your friend. Just play around with Curve and you'll understand.

Neither of these things are anyway near finished yet, but have developed far enough that I feel confident in putting them online. They're also both intertwined pretty strongly; since Workspace is being developed to make Curve, as Curve is being created.

I write elsewhere, so updates will probably come in sudden bundles.

## Structure
Workspace can be found essentially everywhere. Curve is currently only in the 'testSituations' folder, with some Curve-related objects in the 'objects' folder. The 'testSituations' folder is like a workshop for code that eventually makes it way out into the framework. 

## Compiling
You can use the 'comp' function to quickly build together the latest version of Curve and play around with whatever I was working on last by opening the 'docs/index.html' file in a browser.
The command uses a little JavaScript compiler written in Python3 called Gravity, which can go through JS files looking for commands and execute them, ultimatly producing a single JS file. So far there's only one command - a straightforward include - but that's all I really need right now

## Compatibility
Though I'd really like it to work everywhere, currently the only browser that seems to be able to handle this is Chrome. Safari covers alot of things, but has trouble with a few of the WebAudio elements, and Firefox seems to be having problems with the SVG... honestly I'm not totally sure, so just use Chrome for now

## Demos
[- Demo 1](https://metasophiea.com/curve/demos/1)