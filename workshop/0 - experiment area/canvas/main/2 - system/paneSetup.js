//add main panes to arrangement
    canvas.system.pane = {};

        //background
            var temp = canvas.core.element.create('group');
            temp.name = 'background'
            temp.static = true;
            temp.ignored = true;
            canvas.system.pane.background = canvas.core.arrangement.add( undefined, temp );

        //middleground
            var temp = canvas.core.element.create('group');
            temp.name = 'middleground'
            canvas.system.pane.middleground = canvas.core.arrangement.add( undefined, temp );

                //back
                    var temp = canvas.core.element.create('group');
                    temp.name = 'back'
                    canvas.system.pane.middleground.back = canvas.core.arrangement.add( canvas.system.pane.middleground, temp );
                
                //middle
                    var temp = canvas.core.element.create('group');
                    temp.name = 'middle'
                    canvas.system.pane.middleground.middle = canvas.core.arrangement.add( canvas.system.pane.middleground, temp );

                //front
                    var temp = canvas.core.element.create('group');
                    temp.name = 'front'
                    canvas.system.pane.middleground.front = canvas.core.arrangement.add( canvas.system.pane.middleground, temp );

        //foreground
            var temp = canvas.core.element.create('group');
            temp.name = 'foreground'
            temp.static = true;
            canvas.system.pane.foreground = canvas.core.arrangement.add( undefined, temp );


    //shortcuts
        canvas.system.pane.b = canvas.system.pane.background;
        canvas.system.pane.mb = canvas.system.pane.middleground.back;
        canvas.system.pane.mm = canvas.system.pane.middleground.middle;
        canvas.system.pane.mf = canvas.system.pane.middleground.front;
        canvas.system.pane.f = canvas.system.pane.foreground;