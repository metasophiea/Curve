console.log('%cTesting - system.utility.element', 'font-size:15px; font-weight:bold;');
    console.log('%c-- getTransform', 'font-weight: bold;');
    var sudoElement = {style:{transform:'translate(-1.25px, 2.5px) scale(1) rotate(0rad)'}};
    tester(system.utility.element.getTransform(sudoElement),{x: -1.25, y: 2.5, s: 1, r: 0});

    var sudoElement = {style:{transform:'translate(0px, 9.75e-05px) scale(1) rotate(0rad)'}};
    tester(system.utility.element.getTransform(sudoElement),{x: 0, y: 0.0000975, s: 1, r: 0});

    console.log('%c-- styleExtractor', 'font-weight: bold;');
    tester(system.utility.element.styleExtractor('stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;'),{stroke:"rgba(0,255,0,1)", 'stroke-width': "0.5", 'stroke-linecap': "round"});
    tester(system.utility.element.styleExtractor('stroke:rgba(0,255,0,1);stroke-width:0.5;stroke-linecap:round;'),{stroke:"rgba(0,255,0,1)", 'stroke-width': "0.5", 'stroke-linecap': "round"});