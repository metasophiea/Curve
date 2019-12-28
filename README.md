# [curve](https://curve.metasophiea.com/)

## A Project In Multiple Parts
- **_Core_** is a webGL-based graphical webWorker rendering engine written to replace the project's reliance on SVG. It's a little shaky, and is certainly not the best replacement of SVG; though is in its 3rd version now and for the needs of the project, works just fine. Core also comes with the ability to render single frames, so I'm also looking into it being used as a full-webpage display tool, for regular websites.

- **_Workspace_** is a interface framework that is being written alongside Curve. With it, one can create graphical objects and have them interact with one another and the user, in a visual and natural way. Just play around with Curve and you'll understand. "Workspace" consistes of the layers between Core and Curve and is itself split into three parts;

    - ***System***
    this layer expands upon Core, adding in advanced mouse and keyboard functionality. It also sets up a number of drawing layers (or 'panes')
    - ***Interface***
    it all about what the user sees and interacts with. There's readouts and graphs and dials and sliders and all sorts of parts one can use to make interfaces. Atop that, it introduces the concept of 'units' which are modules of parts. These modules are trated as a single unit.
    Think of it like making a keyboard. You've got lots of buttons and lights; and they all come together into the _unit_ that is a keyboard. In addition, there's also a collection of 'circuits' which - as the name suggests - are objects used for processing data 
    - ***Control***
    sets the stage for the interactive world in which the parts and units from the Interface layer exist. This is pretty much Curve, but without all the pre-made units

- **_Curve_** is a musical sandbox designed to be like real-world music making machines. There's synthesizers and effect units and keyboards and all sorts of stuff you can plug together and play with. 

I write elsewhere, so updates will probably come in sudden bundles. Check the [log](docs/notes/log) to see what's been happening

## Structure
- __main__ is where the program itself is stored, seperated into six folders (each of which are also the six main globals) Theoretically; there is an order of dependency keeping things mostly clean, which goes "library -> core -> system -> interface -> control -> curve". You can probably guess by the names what each part does and how they fit together.

- __workshop__ is where most experimentation, development and testing of new sections happens

- __test__ is where you can find test code for all the sections of the main system. Some of these are snazzy code testing code with pass/fail tests and stuff; other parts are more hand-wavy and require a person to determine whether something is working correctly or not.

- __compliation__ contains all the tools necessary to put the program together into a single js file which is stored in 'docs'. (There's also closure in there for packing things into the "deployment" edition (eg. curve.min.js))

- __docs__ consists of all the other stuff; the help files, notes, demo files, images, sound, gifs, etc. Along with the html files for the website and the produced program files. There are program files for each of the three segments mentioned above (Curve, Workspace and Core) In this way, one could for example use the 'control.js' file and get all the functionality of the control code, but without any of the Curve units or menubar items.

## Compiling
You can use the 'comp' function (./compilation/comp.sh) in the compilation folder to quickly build together the latest version of Curve and play around with whatever I was working on last by opening the test html file in a browser.

The command uses a little JavaScript compiler written in Python3 called Gravity, which goes through JS files looking for commands to execute, ultimately producing a single JS file. So far there's only one command - a straightforward include - but that's all I really need right now. The 'heavyComp' is used to produce "production" versions of the code. This version uses gravity to build together the program, then Closure to pack it all up.

## Compatibility
Recently (28/12/2019) I finished the second rewrite of the rendering engine. This time pushing the main rendering work to a webWorker, which allows the rendering work to be done on a sepreate thread to the rest of the program. It's pretty nifty, though compatibility has gotten worse. We're pretty much down to just Chrome now, as most other browsers don't support the "offscreenCanvas" needed to run things this way. I have a feeling that the others will work out their problems eventually (it seems Firefox has it mostly implimented, but there are bugs apparently) but for now, we're stuck with Chrome.

This newer version does come with a number of changes that makes it noticeably different to the version which came before - aside from the webWorker aspect of course - including lots more logging, an update to the compilation scripts, a removal of some older code which was used by 'legacy' components, and a number of other smaller changes. All great stuff.

## Future
Perhaps a webASM backend for Core? Due to the system now using a webWorker for the rendering; a clear division has been formed between the main program and the webWorker. As communication between the two is only possible by string (or a handful of specific data types) it seems reasonable to me that one could re-write the webWorker in pure webASM and not affect the rest of the system at all, while garnering a serious preformance boost.
For now though, I think I'll just keep to working on Curve itself.

## Interesting Links
- [Dev Mode](https://curve.metasophiea.com?dev)
- [Curve Demo 1](https://curve.metasophiea.com?demo=1)
- [Curve Demo 2](https://curve.metasophiea.com?demo=2)
- [Curve Demo 3](https://curve.metasophiea.com?demo=3)
- [Curve Demo 4](https://curve.metasophiea.com?demo=4)