<p align="center">
    <a href="https://curve.metasophiea.com/"><img width="100%" src="https://curve.metasophiea.com/images/curve.png"></a>
</p>

## Demonstration Video
[https://youtu.be/vtJ5edNoNGA](https://youtu.be/vtJ5edNoNGA)


## A Project In Multiple Parts
- **_Core_** is a webGL-based graphical webWorker rendering engine written in a combination of JavaScript and Rust/WebAssembly to replace the project's reliance on SVG. It's a little shaky, and is certainly not the best replacement of SVG; though is in its 4th version now and for the needs of the project, works just fine. Core also comes with the ability to render single frames, so I'm also looking into it being used as a full-webpage display tool, for regular websites.

- **_Workspace_** is a interface framework that is being written alongside Curve. With it, one can create graphical objects and have them interact with one another and the user, in a visual and natural way. Just play around with Curve and you'll understand. "Workspace" consists of the layers between Core and Curve and is itself split into three parts;

    - ***System***
    this layer expands upon Core, adding in advanced mouse and keyboard functionality. It also sets up a number of drawing layers (or 'panes')
    - ***Interface***
    is all about what the user sees and interacts with. There's readouts and graphs and dials and sliders and all sorts of parts one can use to make interfaces. Atop that, it introduces the concept of 'units' which are modules of parts. These modules are treated as a single unit.
    Think of it like making a keyboard. You've got lots of buttons and lights; and they all come together into the _unit_ that is a keyboard. In addition, there's also a collection of 'circuits' which - as the name suggests - are objects used for processing data or audio
    - ***Control***
    sets the stage for the interactive world in which the parts and units from the Interface layer exist. This is pretty much Curve, but without all the pre-made units

- **_Curve_** is a musical sandbox designed to be like a collection of real-world music making machines. There's synthesizers and effect units and keyboards and all sorts of stuff you can plug together and play with. 

I write elsewhere, so updates will probably come in sudden bundles. Check the [log](docs/notes/log) to see what's been happening

## Structure
- __main__ is where the program itself is stored, separated into six folders (each of which are also the six main globals) There is an order of dependency which keeps things clean, which goes "library -> core -> system -> interface -> control -> curve". Each of these layers can only use layers which sit below it on the dependency queue. You can probably guess by the names what each part does and how they fit together.

- __workshop__ is where most experimentation, development and testing of new sections happens

- __test__ is where you can find test code for all the sections of the main system. Some of these are snazzy code testing code with pass/fail tests; other parts are more hand-wavy and require a person to determine whether something is working correctly or not.

- __compilation__ contains all the tools necessary to put the program together into the usable js and wasm files which are stored in 'docs'. The "comp.sh" script also has options for putting together the "production" version of the program (optimising the WebAssembly, removing development logging, compressing JavaScript files, etc)

- __docs__ consists of all the other stuff; help files, notes, demo files, images, sound, gifs, etc. Along with the html files for the website and the produced program files. There are program files for each of the three segments mentioned above (Curve, Workspace and Core) In this way, one could for example use the 'control.js' file and get all the functionality of the control code, but without any of the Curve units or menubar items.

## Compiling
You can use the 'comp' function (./compilation/comp.sh) in the compilation folder to quickly build together the latest version of Curve and play around with whatever I was working on last by opening the test html file in a browser. It comes with a number of options, so, do check it out to see what arguments you need.

The command uses a little JavaScript compiler written in Rust called Gravity, which goes through JS files looking for commands to execute, ultimately producing a single JS file. So far there's only one command - a straightforward include - but that's all I really need right now. One will likely need to compile a version of Gravity for their system, as the current version - the one I use for development - is built for MacOS. One can check the [Gravity repo](https://github.com/metasophiea/Gravity) (under target) to see if an appropriate version has been created for their system, and gather it using the "updateGravity" (./compilation/updateGravity.sh) script, with the "target" argument set. Otherwise, you will need to compile a version manually and import.

## Compatibility
Recently (30/09/2020) I finished the third rewrite of the rendering engine. This time converting most of the engine into WebAssembly, which brings higher speeds and liberation from the JavaScript engine. It's pretty nifty, though compatibility has gotten worse. We're pretty much down to just Chrome now, as most other browsers don't support the "offscreenCanvas" needed to run things this way. I have a feeling that the others will work out their problems eventually (it seems Firefox has it mostly implemented, but there are bugs apparently) but for now, we're stuck with Chrome.

This newer version does come with a number of small changes that makes it different to the version which came before - aside from the WebAssembly aspect of course. Check out the log entry for 2020-09-30 for details.

## Future
Rewriting the rendering engine in WebAssembly went pretty well - only took 6 months too. I've found that I've actually gotten pretty good at Rust, so I'm interested to discover where else it can be used around the system. The transfer between JS and WASM is too slow to be used for replacement of library functions, which is a bummer. Perhaps the custom audio processing code? Or for a more complex circuit? I've had some ideas about a sequencer and a mini-computer...


## Interesting Links
- [Dev Mode](https://curve.metasophiea.com?dev)
- [Curve Demo 1](https://curve.metasophiea.com?demo=1)
- [Curve Demo 2](https://curve.metasophiea.com?demo=2)
- [Curve Demo 3](https://curve.metasophiea.com?demo=3)
- [Curve Demo 4](https://curve.metasophiea.com?demo=4)
- [Curve Demo 5](https://curve.metasophiea.com?demo=5)
- [Curve Demo 6](https://curve.metasophiea.com?demo=6)