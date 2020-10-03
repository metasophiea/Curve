self.operator = new function(){
    {{include:a_library.js}}
    {{include:b_element.js}}
    {{include:c_arrangement.js}}
    {{include:d_render.js}}
    {{include:e_viewport.js}}
    {{include:f_stats.js}}
    {{include:g_callback.js}}

    this.meta = new function(){
        this.refresh = function(){
            return new Promise((resolve, reject) => {
                self.operator.render.refresh().then(() => {
                    self.operator.viewport.refresh();
                    resolve();
                });
            });
        };
    };
};