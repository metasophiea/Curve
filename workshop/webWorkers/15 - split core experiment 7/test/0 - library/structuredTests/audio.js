console.log('%cTesting - library.audio', 'font-size:15px; font-weight:bold;');

//num2name
    console.log('%c- num2name', 'font-weight: bold;');
    tester(_canvas_.library.audio.num2name(24),'0C');
    tester(_canvas_.library.audio.num2name(25),'0C#');
    tester(_canvas_.library.audio.num2name(36),'1C');
    tester(_canvas_.library.audio.num2name(72),'4C');
    tester(_canvas_.library.audio.num2name(81),'4A');
    tester(_canvas_.library.audio.num2name(120),'8C');
    tester(_canvas_.library.audio.num2name(131),'8B');
    console.log('');

//num2freq
    console.log('%c- num2freq', 'font-weight: bold;');
    tester(_canvas_.library.audio.num2freq(24),16.35);
    tester(_canvas_.library.audio.num2freq(25),17.32);
    tester(_canvas_.library.audio.num2freq(36),32.7);
    tester(_canvas_.library.audio.num2freq(72),261.6);
    tester(_canvas_.library.audio.num2freq(81),440);
    tester(_canvas_.library.audio.num2freq(120),4186);
    tester(_canvas_.library.audio.num2freq(131),7902);
    console.log('');

//name2num
    console.log('%c- name2num', 'font-weight: bold;');
    tester(_canvas_.library.audio.name2num('0C'),24);
    tester(_canvas_.library.audio.name2num('0C#'),25);
    tester(_canvas_.library.audio.name2num('1C'),36);
    tester(_canvas_.library.audio.name2num('4C'),72);
    tester(_canvas_.library.audio.name2num('4A'),81);
    tester(_canvas_.library.audio.name2num('8C'),120);
    tester(_canvas_.library.audio.name2num('8B'),131);
    console.log('');
//name2freq
    console.log('%c- name2freq', 'font-weight: bold;');
    tester(_canvas_.library.audio.name2freq('0C'),16.35);
    tester(_canvas_.library.audio.name2freq('0C#'),17.32);
    tester(_canvas_.library.audio.name2freq('1C'),32.7);
    tester(_canvas_.library.audio.name2freq('4C'),261.6);
    tester(_canvas_.library.audio.name2freq('4A'),440);
    tester(_canvas_.library.audio.name2freq('8C'),4186);
    tester(_canvas_.library.audio.name2freq('8B'),7902);
    console.log('');

//freq2num
    console.log('%c- freq2num', 'font-weight: bold;');
    tester(_canvas_.library.audio.freq2num(16.35),24);
    tester(_canvas_.library.audio.freq2num(17.32),25);
    tester(_canvas_.library.audio.freq2num(32.7),36);
    tester(_canvas_.library.audio.freq2num(261.6),72);
    tester(_canvas_.library.audio.freq2num(440),81);
    tester(_canvas_.library.audio.freq2num(4186),120);
    tester(_canvas_.library.audio.freq2num(7902),131);
    console.log('');
//freq2name
    console.log('%c- freq2name', 'font-weight: bold;');
    tester(_canvas_.library.audio.freq2name(16.35),'0C');
    tester(_canvas_.library.audio.freq2name(17.32),'0C#');
    tester(_canvas_.library.audio.freq2name(32.7),'1C');
    tester(_canvas_.library.audio.freq2name(261.6),'4C');
    tester(_canvas_.library.audio.freq2name(440),'4A');
    tester(_canvas_.library.audio.freq2name(4186),'8C');
    tester(_canvas_.library.audio.freq2name(7902),'8B');
    console.log('');