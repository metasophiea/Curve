_canvas_.core.render.active(true);


var cn_reg_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode_1', { x:10,  y:10 } );
var cn_reg_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode_2', { x:110, y:10 } );
var cn_reg_2 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode_3', { x:110, y:30 } );
var cn_reg_3 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode_4', { x:130, y:15 } );
var cn_reg_4 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode', 'test_connectionNode_5', { x:130, y:40 } );
_canvas_.system.pane.mm.append( cn_reg_0 );
_canvas_.system.pane.mm.append( cn_reg_1 );
_canvas_.system.pane.mm.append( cn_reg_2 );
_canvas_.system.pane.mm.append( cn_reg_3 );
_canvas_.system.pane.mm.append( cn_reg_4 );

var cn_sig_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_signal', 'test_connectionNode_signal_1', { x:10,  y:110 } );
var cn_sig_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_signal', 'test_connectionNode_signal_2', { x:110, y:110 } );
var cn_sig_2 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_signal', 'test_connectionNode_signal_3', { x:110, y:130 } );
var cn_sig_3 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_signal', 'test_connectionNode_signal_4', { x:130, y:115 } );
var cn_sig_4 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_signal', 'test_connectionNode_signal_5', { x:130, y:140 } );
_canvas_.system.pane.mm.append( cn_sig_0 );
_canvas_.system.pane.mm.append( cn_sig_1 );
_canvas_.system.pane.mm.append( cn_sig_2 );
_canvas_.system.pane.mm.append( cn_sig_3 );
_canvas_.system.pane.mm.append( cn_sig_4 );

var cn_vol_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_voltage', 'test_connectionNode_voltage_1', { x:10,  y:210 } );
var cn_vol_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_voltage', 'test_connectionNode_voltage_2', { x:110, y:210 } );
var cn_vol_2 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_voltage', 'test_connectionNode_voltage_3', { x:110, y:230 } );
var cn_vol_3 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_voltage', 'test_connectionNode_voltage_4', { x:130, y:215 } );
var cn_vol_4 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_voltage', 'test_connectionNode_voltage_5', { x:130, y:240 } );
_canvas_.system.pane.mm.append( cn_vol_0 );
_canvas_.system.pane.mm.append( cn_vol_1 );
_canvas_.system.pane.mm.append( cn_vol_2 );
_canvas_.system.pane.mm.append( cn_vol_3 );
_canvas_.system.pane.mm.append( cn_vol_4 );

var cn_dat_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_data', 'test_connectionNode_data_1', { x:10,  y:310 } );
var cn_dat_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_data', 'test_connectionNode_data_2', { x:110, y:310 } );
var cn_dat_2 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_data', 'test_connectionNode_data_3', { x:110, y:330 } );
var cn_dat_3 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_data', 'test_connectionNode_data_4', { x:130, y:315 } );
var cn_dat_4 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_data', 'test_connectionNode_data_5', { x:130, y:340 } );
_canvas_.system.pane.mm.append( cn_dat_0 );
_canvas_.system.pane.mm.append( cn_dat_1 );
_canvas_.system.pane.mm.append( cn_dat_2 );
_canvas_.system.pane.mm.append( cn_dat_3 );
_canvas_.system.pane.mm.append( cn_dat_4 );

var cn_aud_0 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_audio', 'test_connectionNode_audio_1', { x:10,  y:410 } );
var cn_aud_1 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_audio', 'test_connectionNode_audio_2', { x:110, y:410 } );
var cn_aud_2 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_audio', 'test_connectionNode_audio_3', { x:110, y:430 } );
var cn_aud_3 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_audio', 'test_connectionNode_audio_4', { x:130, y:415 } );
var cn_aud_4 = _canvas_.interface.part.builder( 'dynamic', 'connectionNode_audio', 'test_connectionNode_audio_5', { x:130, y:440, isAudioOutput:true } );
_canvas_.system.pane.mm.append( cn_aud_0 );
_canvas_.system.pane.mm.append( cn_aud_1 );
_canvas_.system.pane.mm.append( cn_aud_2 );
_canvas_.system.pane.mm.append( cn_aud_3 );
_canvas_.system.pane.mm.append( cn_aud_4 );


// cn_reg_0.allowConnections(false);
// cn_reg_0.allowDisconnections(false);