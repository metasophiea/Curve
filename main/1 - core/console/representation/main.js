{{include:b_element.js}}
{{include:c_arrangement.js}}
{{include:d_render.js}}
{{include:e_viewport.js}}
{{include:f_stats.js}}
{{include:g_callback.js}}

this.meta = new function(){
    this.refresh = function(){
        return interface.operator.meta.refresh();
    };
};