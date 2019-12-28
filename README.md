# [curve](https://curve.metasophiea.com/)

## A Project In Three Parts
- **_Curve_** is a musical sandbox designed to be like real-world music making machines. There's synthesizers and effect units and keyboards and all sorts of stuff you can plug together and play with. 

- **_Workspace_** is a interface framework that is being written alongside Curve. With it, one can create graphical objects and have them interact with one another and the user, in a visual and natural way. Just play around with Curve and you'll understand.

- **_Core_** is a webGL-based graphical framework written to replace the project's reliance on SVG. It's a bit shaky, and is certainly not the best replacement of SVG, but for the needs of the project it works just fine and has already allowed the system to work on more browsers and machines much faster. Core also comes with the ability to render single frames, so I'm also looking into it being used as a full-webpage display tool, for regular websites.

None of these things are anyway near finished yet, but have developed far enough that I feel confident in putting them online. They're also all intertwined pretty strongly; Core is being developed to make Workspace, and Workspace is being developed to make Curve.

I write elsewhere, so updates will probably come in sudden bundles. Check the [log](docs/notes/log) to see what's been happening

## Structure
- __main__ is where the program itself is stored, seperated into six folders (each of which are also the six main globals) Theoretically; there is an order of dependency keeping things kinda clean, which goes "library -> core -> system -> interface -> control -> curve" however nothing is perfect and things are still forming into that dream. You can probably guess by the names what each part does and how they fit together.

- __workshop__ is where most experimentation, development and testing of new sections happens

- __test__ is where you can find test code for all the sections of the main system. Some of these are snazzy code testing code with pass/fail tests and stuff; other parts are more hand-wavy and require a person to determine whether something is working correctly or not.

- __compliation__ contains all the tools necessary to put the program together into a single js file which is stored in 'docs'. (There's also closure in there for packing things into the "deployment" edition (eg. workspace.min.js))

- __docs__ consists of all the other stuff; the help files, notes, demo files, images, sound, gifs, etc. Along with the html files for the website and the produced program files. There are program files for each of the three segments mentioned above (Curve, Workspace and Core) In this way, one could for example use the 'workspace.js' file and get all the functionality of the workspace code, but without any of the Curve units or menubar items.

## Compiling
You can use the 'comp' function (./compilation/comp.sh) in the compilation folder to quickly build together the latest version of Curve and play around with whatever I was working on last by opening the test html file in a browser.

The command uses a little JavaScript compiler written in Python3 called Gravity, which goes through JS files looking for commands to execute, ultimately producing a single JS file. So far there's only one command - a straightforward include - but that's all I really need right now. The 'heavyComp' is used to produce "production" versions of the code. This version uses gravity to build together the program, then Closure to pack it all up.

## Compatibility
Recently (24/4/2019) I finished my overhaul of the graphical backend of the project, taking out the Canvas aspect of core and replacing it with webGL. So far it's been pretty happy working on most browsers, but more testing is needed. Safari is still unable to handle WebAudio, so I recommend just sticking with Chrome (and maybe Firefox, but the mouse-wheel zooming doesn't work that well just yet, and the audio isn't great either) for now.

## The Future
I'm currently working on a webWorker version of the rendering engine, which should relieve the main thread from having to handle both rendering _and_ the actual events of created systems. Things are going pretty well so far, and you can check out the progress over in the workshop. Compatibility isn't great (it seems that only Chrome supports the "OffscreenCanvas" object that's central to the whole thing working) though I'm feeling good about it being fixed in future versions of Firefox and other browsers..hopefully.

This newer version does come with a number of changes that makes it noticeably different to the version which came before - aside from the webWorker of course - including lots more logging, an update to the compilation scripts, a removal of some older code which was used by 'legacy' components, and a number of other smaller changes. All great stuff.

## Interesting Links
- [Dev Mode](https://curve.metasophiea.com?dev)
- [Curve Demo 1](https://curve.metasophiea.com?demo=1)
- [Curve Demo 2](https://curve.metasophiea.com?demo=2)
- [Curve Demo 3](https://curve.metasophiea.com?demo=3)
- [Curve Demo 4](https://curve.metasophiea.com?demo=4)