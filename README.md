# [curve](http://metasophiea.com/curve)

<p align="centre">
    <img width="640" height="480" src="https://metasophiea.com/curve/gifs/openCreateMenu.gif">
</p>

## A Project In Two Parts
Curve is a musical workstation designed to be like real-world music making machines. There's synthesizers and effect units and keyboards and all sorts of stuff you can plug together and play with. 

Workspace is a interface framework that is being written alongside Curve. With it, one can create graphical objects and have them interact with eachother and the user, in a visual and natural way. All the basic and common stuff is taken care of, so you can focus on making what you actually want to make. It's not useful for all situations, but if you know that networking objects together will be a real factor in whatever you're doing; Workspace will be your friend. Just play around with Curve and you'll understand.

Neither of these things are anyway near finished yet, but have developed far enough that I feel confident in putting them online. They're also both intertwined pretty strongly; since Workspace is being developed to make Curve, as Curve is being created.

I write elsewhere, so updates will probably come in sudden bundles. Check the [log](docs/notes/log) to see what's been happening

## Structure
- 'main' is where the program itself is stored, seperated into four folders (which are also the four main globals) Theoretically; there is an order of dependency keeping things kinda clean, which goes "system -> part -> object -> control" however nothings perfect and things are still forming into that dream. You can probably guess by the names what each part does and how they fit together.
- 'workshop' is where most experimentation, development and testing happens.
- 'compliation' contains all the tools necessary to put the program together into a single js file which is stored in 'docs'. There's also closure in there for packing things into the "deployment" edition (workspace.min.js)
- 'docs' consists of all the other stuff; the help files, notes, demo files, gifs, etc. Along with the html files for the website and the produced program files.

## Compiling
You can use the 'comp' function in the compliation folder to quickly build together the latest version of Curve and play around with whatever I was working on last by opening the 'docs/test.html' file in a browser.
The command uses a little JavaScript compiler written in Python3 called Gravity, which can go through JS files looking for commands and execute them, ultimatly producing a single JS file. So far there's only one command - a straightforward include - but that's all I really need right now. The 'heavyComp' is used to produce "production" versions of the code. This version uses gravity to build together the program, then Clousure to pack it all up. This version is used in 'docs/index.html' and the demo links below.

## Compatibility
Though I'd really like it to work everywhere, currently the only browser that seems to be able to handle this is Chrome. Safari covers alot of things, but has trouble with a few of the WebAudio elements, and Firefox seems to be having problems with the SVG... honestly I'm not totally sure, and to be fair Chrome struggles with some things, but it's the best we have currently

## Demos
- [Demo 1](https://metasophiea.com/curve?demo=1) 
- [Demo 2](https://metasophiea.com/curve?demo=2)
