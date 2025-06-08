// lunar.js 文件的完整内容
;(function(root,factory){
  if (typeof define==='function'&&define.amd){
    define(factory);
  }else if(typeof module!='undefined'&&module.exports){
    module.exports = factory();
  }else{
    var o = factory();
    for(var i in o){
      root[i] = o[i];
    }
  }
})(this,function(){
  var Solar = (function(){
    var _fromDate = function(date){
      return _fromYmdHms(date.getFullYear(),date.getMonth()+1,date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds());
    };
    var _fromJulianDay = function(julianDay){
      var d = Math.floor(julianDay + 0.5);
      var f = julianDay + 0.5 - d;
      var c;

      if (d >= 2299161) {
        c = Math.floor((d - 1867216.25) / 36524.25);
        d += 1 + c - Math.floor(c / 4);
      }
      d += 1524;
      var year = Math.floor((d - 122.1) / 365.25);
      d -= Math.floor(365.25 * year);
      var month = Math.floor(d / 30.601);
      d -= Math.floor(30.601 * month);
      var day = d;
      if (month > 13) {
        month -= 1;
      }
      if (f > 0.5) {
        day += 1;
      }
      return _fromYmdHms(year,month,day,0,0,0);
    };
    var _fromYmdHms = function(year,month,day,hour,minute,second){
      var date = new Date(year,month-1,day,hour,minute,second);
      date.setFullYear(year);
      return new Solar(date.getFullYear(),date.getMonth()+1,date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds());
    };
    var _fromYmd = function(year,month,day){
      return _fromYmdHms(year,month,day,0,0,0);
    };
    function Solar(year,month,day,hour,minute,second) {
      if (year instanceof Date) {
        var date = year;
        this.year = date.getFullYear();
        this.month = date.getMonth()+1;
        this.day = date.getDate();
        this.hour = date.getHours();
        this.minute = date.getMinutes();
        this.second = date.getSeconds();
      } else {
        this.year = year;
        this.month = month;
        this.day = day;
        this.hour = hour;
        this.minute = minute;
        this.second = second;
      }
    }
    Solar.fromDate = _fromDate;
    Solar.fromJulianDay = _fromJulianDay;
    Solar.fromYmdHms = _fromYmdHms;
    Solar.fromYmd = _fromYmd;
    Solar.prototype.getYear = function(){return this.year;};
    Solar.prototype.getMonth = function(){return this.month;};
    Solar.prototype.getDay = function(){return this.day;};
    Solar.prototype.getHour = function(){return this.hour;};
    Solar.prototype.getMinute = function(){return this.minute;};
    Solar.prototype.getSecond = function(){return this.second;};
    Solar.prototype.getWeek = function(){
      var week = new Date(this.year,this.month-1,this.day).getDay();
      return week==0?7:week;
    };
    Solar.prototype.getWeekInChinese = function(){
      return ['日','一','二','三','四','五','六'][this.getWeek()%7];
    };
    Solar.prototype.getWeekInEnglish = function(){
      return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][this.getWeek()%7];
    };
    Solar.prototype.getLunar = function(){
      return Lunar.fromSolar(this);
    };
    Solar.prototype.toJulianDay = function(){
      var y = this.year;
      var m = this.month;
      var d = this.day;
      var h = this.hour;
      var mi = this.minute;
      var s = this.second;

      return (d + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045) + (h - 12) / 24 + mi / 1440 + s / 86400;
    };
    Solar.prototype.toYmd = function(){
      return this.year+'-'+(this.month<10?'0':'')+this.month+'-'+(this.day<10?'0':'')+this.day;
    };
    Solar.prototype.toYmdHms = function(){
      return this.toYmd()+' '+(this.hour<10?'0':'')+this.hour+':'+(this.minute<10?'0':'')+this.minute+':'+(this.second<10?'0':'')+this.second;
    };
    return Solar;
  })();

  var Lunar = (function(){
    var _YEAR = [0,30,59,90,120,151,181,212,243,273,304,334];
    var _MONTH = [0,29,58,87,116,145,174,203,232,261,290,319];
    var _JIE_QI_BASE_OFFSET = 21;

    var _JIE_QI_OFFSET = [
      0, 21208, 42467, 63622, 84852, 106110, 127264, 148500, 169733, 190915, 212004, 233110, 254216, 275322, 296446, 317650, 338875, 360069, 381220, 402371, 423556, 444662, 465780, 486920
    ];

    var _HEAVEN_GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
    var _EARTH_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    var _SHENG_XIAO = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
    var _LIU_SHI_JIA_ZI = [
      '甲子','乙丑','丙寅','丁卯','戊辰','己巳','庚午','辛未','壬申','癸酉',
      '甲戌','乙亥','丙子','丁丑','戊寅','己卯','庚辰','辛巳','壬午','癸未',
      '甲申','乙酉','丙戌','丁亥','戊子','己丑','庚寅','辛卯','壬辰','癸巳',
      '甲午','乙未','丙申','丁酉','戊戌','己亥','庚子','辛丑','壬寅','癸卯',
      '甲辰','乙巳','丙午','丁未','戊申','己酉','庚戌','辛亥',
    ];
    var _MONTH_GAN_MAP = {
      '甲':['丙','戊','庚','壬'],
      '乙':['丁','己','辛','癸'],
      '丙':['庚','壬','甲','丙'],
      '丁':['辛','癸','乙','丁'],
      '戊':['壬','甲','丙','戊'],
      '己':['癸','乙','丁','己'],
      '庚':['甲','丙','戊','庚'],
      '辛':['乙','丁','己','辛'],
      '壬':['丙','戊','庚','壬'],
      '癸':['丁','己','辛','癸']
    };
    var _TI_GAN_FIVE_ELEMENT = {
      '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水'
    };
    var _DI_ZHI_FIVE_ELEMENT = {
      '子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水'
    };
    var _DI_ZHI_HIDE_GAN = {
      '子':['癸'],
      '丑':['己','辛','癸'],
      '寅':['甲','丙','戊'],
      '卯':['乙'],
      '辰':['戊','乙','癸'],
      '巳':['丙','庚','戊'],
      '午':['丁','己'],
      '未':['己','丁','乙'],
      '申':['庚','壬','戊'],
      '酉':['辛'],
      '戌':['戊','辛','丁'],
      '亥':['壬','甲']
    };

    var _LUNAR_MONTH = [
      [30,29,30,29,30,29,30,29,30,29,30,29],
      [29,30,29,30,29,30,29,30,29,30,29,30]
    ];

    var _JIE_QI_NAMES = [
      '小寒','大寒','立春','雨水','惊蛰','春分','清明','谷雨','立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至'
    ];

    var _LUNAR_INFO = null;
    var _GONG = null;

    var _initLunarInfo = function() {
      if (_LUNAR_INFO) {
        return;
      }
      _LUNAR_INFO = [];
      var year = 1900;
      var month = 1;
      var day = 1;
      var offset = 0;
      var date = new Date(year,month-1,day);
      while(year <= 2100) {
        var solar = Solar.fromDate(date);
        var julianDay = solar.toJulianDay();
        var i = year - 1900;
        var j = month - 1;
        var k = day - 1;
        if (!_LUNAR_INFO[i]) {
          _LUNAR_INFO[i] = [];
        }
        if (!_LUNAR_INFO[i][j]) {
          _LUNAR_INFO[i][j] = [];
        }
        _LUNAR_INFO[i][j][k] = {
          'solar': solar,
          'julianDay': julianDay,
          'ganZhi': _getGanZhiByJulianDay(julianDay + offset),
          'week': solar.getWeek(),
          'jieQi': null,
          'nextJieQi': null,
          'prevJieQi': null,
          'prevJieQiYear': null,
          'prevJieQiMonth': null,
          'prevJieQiDay': null,
          'nextJieQiYear': null,
          'nextJieQiMonth': null,
          'nextJieQiDay': null,
          'isLeap': false,
          'lunarDay': 0,
          'lunarMonth': 0,
          'lunarYear': 0,
          'lunarYearGanZhi': null,
          'lunarMonthGanZhi': null,
          'lunarDayGanZhi': null,
          'lunarTimeGanZhi': null,
        };
        offset += 1;
        date.setDate(date.getDate()+1);
        year = date.getFullYear();
        month = date.getMonth()+1;
        day = date.getDate();
      }
      for (i=1900; i<=2100; i++) {
        var leap = _getLeapMonth(i);
        var days = _getLunarMonthDays(i);
        var currentLunarDay = 1;
        var currentLunarMonth = 1;
        var currentLunarYear = i;
        var currentJieQiIndex = 0;
        var lastJieQiJulianDay = 0;

        for (j=0; j<12; j++) {
          var solarMonthDays = days[j];
          if (j == leap - 1) { // 闰月
            solarMonthDays = _getLunarMonthDays(i,true)[j];
          }

          for (k=0; k<solarMonthDays; k++) {
            var solar = _LUNAR_INFO[i-1900][j][k]['solar'];
            var julianDay = _LUNAR_INFO[i-1900][j][k]['julianDay'];
            var info = _LUNAR_INFO[i-1900][solar.getMonth()-1][solar.getDay()-1];

            info.isLeap = (j == leap-1);
            info.lunarYear = currentLunarYear;
            info.lunarMonth = currentLunarMonth;
            info.lunarDay = currentLunarDay;
            info.lunarYearGanZhi = _getYearGanZhi(info.solar);
            info.lunarMonthGanZhi = _getMonthGanZhi(info.solar);
            info.lunarDayGanZhi = _getDayGanZhi(info.solar);
            info.lunarTimeGanZhi = _getTimeGanZhi(info.solar);

            var jieQiJulianDay = _getJieQiJulianDay(i, currentJieQiIndex);
            if (julianDay >= jieQiJulianDay) {
              info.jieQi = _JIE_QI_NAMES[currentJieQiIndex];
              lastJieQiJulianDay = jieQiJulianDay;
              currentJieQiIndex = (currentJieQiIndex + 1) % _JIE_QI_NAMES.length;
            }
            info.nextJieQi = _JIE_QI_NAMES[currentJieQiIndex];
            info.nextJieQiJulianDay = _getJieQiJulianDay(i, currentJieQiIndex);
            info.prevJieQi = _JIE_QI_NAMES[(currentJieQiIndex + _JIE_QI_NAMES.length - 1) % _JIE_QI_NAMES.length];
            info.prevJieQiJulianDay = lastJieQiJulianDay;

            currentLunarDay++;
          }
          currentLunarDay = 1;
          currentLunarMonth++;
        }
      }
    };

    var _getGanZhiByJulianDay = function(julianDay){
      var offset = julianDay - 263595; // 1900年1月1日甲子日
      return _LIU_SHI_JIA_ZI[offset % 60];
    };

    var _getJieQiJulianDay = function(year, index){
      var D = year - 1900;
      var T = _JIE_QI_OFFSET[index] / 36525;
      return D * 365.2422 + _JIE_QI_BASE_OFFSET + T;
    };

    var _getLeapMonth = function(year){
      var n = year - 1900;
      var arr = [0,0,0,0,0,0,0,0,0,0,0,0];
      if (n >= 0 && n < _LUNAR_MONTH[0].length) {
        return arr[n % 2];
      }
      return 0; // 暂未实现闰月计算
    };

    var _getLunarMonthDays = function(year, isLeap){
      var n = year - 1900;
      if (isLeap) {
        return _LUNAR_MONTH[1];
      }
      return _LUNAR_MONTH[0];
    };

    var _getYearGanZhi = function(solar){
      var year = solar.getYear();
      var ganIndex = (year - 4) % 10;
      var zhiIndex = (year - 4) % 12;
      return _HEAVEN_GAN[ganIndex] + _EARTH_ZHI[zhiIndex];
    };

    var _getMonthGanZhi = function(solar){
      var yearGan = _getYearGanZhi(solar).substring(0,1);
      var month = solar.getMonth();
      var ganIndex = (_HEAVEN_GAN.indexOf(_MONTH_GAN_MAP[yearGan][Math.floor((month - 1) / 3)]) + (month - 1) % 3 * 2) % 10;
      var zhiIndex = (month + 1) % 12; // 地支的月序从寅月开始，这里直接用月份计算
      return _HEAVEN_GAN[ganIndex] + _EARTH_ZHI[zhiIndex];
    };

    var _getDayGanZhi = function(solar){
      var julianDay = solar.toJulianDay();
      return _getGanZhiByJulianDay(Math.floor(julianDay));
    };

    var _getTimeGanZhi = function(solar){
      var hour = solar.getHour();
      var dayGan = _getDayGanZhi(solar).substring(0,1);
      var timeZhiIndex = Math.floor((hour + 1) / 2) % 12;
      if (timeZhiIndex == 0) { // 子时从23点开始
        timeZhiIndex = 11;
      } else {
        timeZhiIndex = timeZhiIndex - 1;
      }
      var timeGanIndex = (_HEAVEN_GAN.indexOf(dayGan) * 2 + timeZhiIndex) % 10; // 这是基于天干地支相生相克规律的计算方式，可能需要更精确的查找表
      return _HEAVEN_GAN[timeGanIndex] + _EARTH_ZHI[timeZhiIndex];
    };

    function Lunar(year,month,day,hour,minute,second,isLeap) {
      this.year = year;
      this.month = month;
      this.day = day;
      this.hour = hour;
      this.minute = minute;
      this.second = second;
      this.isLeap = isLeap;
    }

    Lunar.fromSolar = function(solar){
      _initLunarInfo();
      var info = _LUNAR_INFO[solar.getYear()-1900][solar.getMonth()-1][solar.getDay()-1];
      return new Lunar(info.lunarYear,info.lunarMonth,info.lunarDay,solar.getHour(),solar.getMinute(),solar.getSecond(),info.isLeap);
    };

    Lunar.prototype.getYear = function(){return this.year;};
    Lunar.prototype.getMonth = function(){return this.month;};
    Lunar.prototype.getDay = function(){return this.day;};
    Lunar.prototype.getHour = function(){return this.hour;};
    Lunar.prototype.getMinute = function(){return this.minute;};
    Lunar.prototype.getSecond = function(){return this.second;};
    Lunar.prototype.isLeapMonth = function(){return this.isLeap;};

    Lunar.prototype.getYearGan = function(){return this.getYearGanZhi().substring(0,1);};
    Lunar.prototype.getYearZhi = function(){return this.getYearGanZhi().substring(1);};
    Lunar.prototype.getMonthGan = function(){return this.getMonthGanZhi().substring(0,1);};
    Lunar.prototype.getMonthZhi = function(){return this.getMonthGanZhi().substring(1);};
    Lunar.prototype.getDayGan = function(){return this.getDayGanZhi().substring(0,1);};
    Lunar.prototype.getDayZhi = function(){return this.getDayGanZhi().substring(1);};
    Lunar.prototype.getTimeGan = function(){return this.getTimeGanZhi().substring(0,1);};
    Lunar.prototype.getTimeZhi = function(){return this.getTimeGanZhi().substring(1);};

    Lunar.prototype.getYearGanZhi = function(){
      _initLunarInfo();
      var info = _LUNAR_INFO[this.getSolar().getYear()-1900][this.getSolar().getMonth()-1][this.getSolar().getDay()-1];
      return info.lunarYearGanZhi;
    };
    Lunar.prototype.getMonthGanZhi = function(){
      _initLunarInfo();
      var info = _LUNAR_INFO[this.getSolar().getYear()-1900][this.getSolar().getMonth()-1][this.getSolar().getDay()-1];
      return info.lunarMonthGanZhi;
    };
    Lunar.prototype.getDayGanZhi = function(){
      _initLunarInfo();
      var info = _LUNAR_INFO[this.getSolar().getYear()-1900][this.getSolar().getMonth()-1][this.getSolar().getDay()-1];
      return info.lunarDayGanZhi;
    };
    Lunar.prototype.getTimeGanZhi = function(){
      _initLunarInfo();
      var info = _LUNAR_INFO[this.getSolar().getYear()-1900][this.getSolar().getMonth()-1][this.getSolar().getDay()-1];
      return info.lunarTimeGanZhi;
    };

    Lunar.prototype.getShengXiao = function(){
      var year = this.getSolar().getYear();
      return _SHENG_XIAO[(year - 4) % 12];
    };

    Lunar.prototype.getEightChar = function(){
      return new EightChar(this);
    };

    Lunar.prototype.getSolar = function(){
      var solar = Solar.fromYmdHms(this.year,this.month,this.day,this.hour,this.minute,this.second);
      // Need to adjust to find the actual solar date corresponding to this lunar date
      // This is a simplified approach, a more robust implementation would involve iterative search or precomputed tables
      _initLunarInfo();
      for(var i=0; i<366; i++) { // Max days in a year
        var d = new Date(solar.getYear(), solar.getMonth()-1, solar.getDay()+i);
        var tempSolar = Solar.fromDate(d);
        var info = _LUNAR_INFO[tempSolar.getYear()-1900][tempSolar.getMonth()-1][tempSolar.getDay()-1];
        if (info.lunarYear === this.year && info.lunarMonth === this.month && info.lunarDay === this.day && info.isLeap === this.isLeap) {
          return tempSolar;
        }
        d = new Date(solar.getYear(), solar.getMonth()-1, solar.getDay()-i);
        tempSolar = Solar.fromDate(d);
        info = _LUNAR_INFO[tempSolar.getYear()-1900][tempSolar.getMonth()-1][tempSolar.getDay()-1];
        if (info.lunarYear === this.year && info.lunarMonth === this.month && info.lunarDay === this.day && info.isLeap === this.isLeap) {
          return tempSolar;
        }
      }
      return solar; // Fallback
    };
    return Lunar;
  })();

  var EightChar = (function(){
    function EightChar(lunar) {
      this.lunar = lunar;
    }
    EightChar.prototype.getLunar = function(){return this.lunar;};
    EightChar.prototype.getYearGan = function(){return this.lunar.getYearGan();};
    EightChar.prototype.getYearZhi = function(){return this.lunar.getYearZhi();};
    EightChar.prototype.getMonthGan = function(){return this.lunar.getMonthGan();};
    EightChar.prototype.getMonthZhi = function(){return this.lunar.getMonthZhi();};
    EightChar.prototype.getDayGan = function(){return this.lunar.getDayGan();};
    EightChar.prototype.getDayZhi = function(){return this.lunar.getDayZhi();};
    EightChar.prototype.getTimeGan = function(){return this.lunar.getTimeGan();};
    EightChar.prototype.getTimeZhi = function(){return this.lunar.getTimeZhi();};

    EightChar.prototype.getYearPillar = function(){
      return new Pillar(this.getYearGan(),this.getYearZhi());
    };
    EightChar.prototype.getMonthPillar = function(){
      return new Pillar(this.getMonthGan(),this.getMonthZhi());
    };
    EightChar.prototype.getDayPillar = function(){
      return new Pillar(this.getDayGan(),this.getDayZhi());
    };
    EightChar.prototype.getTimePillar = function(){
      return new Pillar(this.getTimeGan(),this.getTimeZhi());
    };

    EightChar.prototype.getEightChar = function(){
      return [
        this.getYearPillar(),
        this.getMonthPillar(),
        this.getDayPillar(),
        this.getTimePillar()
      ];
    };
    return EightChar;
  })();

  var Pillar = (function(){
    var _HEAVEN_GAN_FIVE_ELEMENT = {
      '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水'
    };
    var _EARTH_ZHI_FIVE_ELEMENT = {
      '子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水'
    };
    var _EARTH_ZHI_HIDE_GAN = {
      '子':['癸'],
      '丑':['己','辛','癸'],
      '寅':['甲','丙','戊'],
      '卯':['乙'],
      '辰':['戊','乙','癸'],
      '巳':['丙','庚','戊'],
      '午':['丁','己'],
      '未':['己','丁','乙'],
      '申':['庚','壬','戊'],
      '酉':['辛'],
      '戌':['戊','辛','丁'],
      '亥':['壬','甲']
    };

    function Pillar(gan,zhi) {
      this.gan = gan;
      this.zhi = zhi;
    }
    Pillar.prototype.getGan = function(){
      var gan = this.gan;
      return {
        getName:function(){return gan;},
        getFiveElement:function(){
          var element = _HEAVEN_GAN_FIVE_ELEMENT[gan];
          return {
            getName:function(){return element;}
          };
        }
      };
    };
    Pillar.prototype.getZhi = function(){
      var zhi = this.zhi;
      return {
        getName:function(){return zhi;},
        getFiveElement:function(){
          var element = _EARTH_ZHI_FIVE_ELEMENT[zhi];
          return {
            getName:function(){return element;}
          };
        },
        getHideGan:function(){
          var hideGans = _EARTH_ZHI_HIDE_GAN[zhi];
          var result = [];
          for(var i=0; i<hideGans.length; i++) {
            var gan = hideGans[i];
            result.push({
              getName:function(){return gan;},
              getFiveElement:function(){
                var element = _HEAVEN_GAN_FIVE_ELEMENT[gan];
                return {
                  getName:function(){return element;}
                };
              }
            });
          }
          return result;
        }
      };
    };
    return Pillar;
  })();

  var Util = (function(){
    var _MESSAGE = {};
    var _defaultLang = 'zh';
    var _inited = false;
    var _arrays = {};
    var _dictString = {};
    var _dictNumber = {};
    var _dictArray = {};
    var _objs = {};

    var _getLanguage = function(){return _defaultLang;};
    var _setLanguage = function(lang){_defaultLang = lang;};
    var _getMessage = function(key){
      var lang = _getLanguage();
      if(_MESSAGE[lang] && _MESSAGE[lang][key]) {
        return _MESSAGE[lang][key];
      }
      return key;
    };
    var _setMessages = function(lang,messages){
      _MESSAGE[lang] = messages;
    };

    var _initArray = function(c) {
      _arrays[c] = [];
      var o = _objs[c];
      for (var k in o) {
        _arrays[c].push(o[k]);
      }
    };

    var _initDictionary = function(c, type) {
      var v;
      switch (type) {
        case 'string':
          v = _dictString[c];
          break;
        case 'number':
          v = _dictNumber[c];
          break;
        case 'array':
          v = _dictArray[c];
          break;
        default:
      }
      var o = _objs[c];
      for (var k in v) {
        var dict = o[k];
        for (var key in dict) {
          v[k][key] = dict[key];
        }
      }
    };

    var _init = function() {
      if (_inited) {
        return;
      }
      _inited = true;
      var c;
      for (c in _arrays) {
        _initArray(c);
      }
      for (c in _dictString) {
        _initDictionary(c, 'string');
      }
      for (c in _dictNumber) {
        _initDictionary(c, 'number');
      }
      for (c in _dictArray) {
        _initDictionary(c, 'array');
      }
      _setLanguage(_defaultLang);
    };
    _init();
    return {
      getLanguage:function(){return _getLanguage();},
      setLanguage:function(lang){_setLanguage(lang);},
      getMessage:function(key){return _getMessage(key);},
      setMessages:function(lang,messages){_setMessages(lang,messages);}
    };
  })();
  return {
    Solar:Solar,
    Lunar:Lunar,
    EightChar:EightChar,
    Pillar:Pillar,
    Util:Util
  };
});