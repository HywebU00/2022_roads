$(function(){
  var _window = $(window);
  var ww = _window.width();
  var _body = $('body, html');
  var _webHeader = $('.webHeader');
  var hh = _webHeader.outerHeight();
  // 在小螢幕時，如果有 fixed 的版頭，點擊頁籤 scroll 向上的距離需要減掉fixed版頭的高度，以免頁籤項被版頭遮住。

  var wwSmall = 600;
  // 視窗寬度小於等於此值，頁籤項和頁籤內容改垂直排列，並以 slideup/slidedown 開合

  $('html').removeClass('no-js'); 



  var _tabs = $('.tabs');
  _tabs.each(function(){
    let _this = $(this);
    let _tabItem = _this.find('.tabItem');
    let _tabItemA = _tabItem.find('button');
    let _tabContent = _this.find('.tabContent');
    let tabwidth; // 整組頁籤寬度
    let tabItemHeight; // 頁籤項高度
    let tabContentHeight; // 顯示的頁籤內容高度
    let tabItemLength = _tabItem.length; // 頁籤項個數

    _tabItem.first().addClass('active').next().show();
    // 第一個頁籤項加上 'active'  class name，並顯示緊跟在後的頁籤內容區塊
    // 注意，這個顯示頁籤內容區塊的動作不要在 css 中設定，否則小螢幕時的 slideup/slidedown 動作會失效
    tabLocate();

    
    function tabLocate(){ // 定位頁籤項目和頁籤內容
      tabItemHeight = _tabItem.outerHeight(true);
      if(ww > wwSmall ){
        tabwidth = _this.width();
        // tabContentHeight = _tabContent.filter(':visible').innerHeight();
        _tabContent.css('top' , tabItemHeight + _tabItem.last().position().top );
        _this.height(_tabContent.filter(':visible').innerHeight() + tabItemHeight + _tabItem.last().position().top);
        // 整個頁籤區塊的高度 ＝ 可視的頁籤內容高度 ＋ 頁籤項目高度 ＋ 最後一個頁籤項目與整個頁籤區塊的上緣垂直距離
        // _tabItem.last().position().top 是頁籤項目折行時的修正。
        if ( _this.hasClass('equal')) { // 如果有 class 中有 equal，需計算頁籤項目平均寬度
          _tabItem.outerWidth(tabwidth / tabItemLength, true);
        }
      } else {
        _this.add(_tabItem).removeAttr('style');
      }
    }


    _tabItemA.focus(tabs);
    _tabItemA.click(tabs);

    
    function tabs(e) { // 點擊頁籤項目的回應動作
      let _tabItemNow = $(this).parent();
      let tabIndexNow = _tabItemNow.index() / 2;
      let tabsOffsetTop; // 整個頁籤區塊與頁面的垂直距離（小螢幕時）
      let scollDistance; // 點擊某個頁籤項目後，頁面要捲動的距離（小螢幕時）
      tabItemHeight = _tabItem.outerHeight(true); // 點擊頁籤項目時再次取得頁籤項目高度，因為大、小螢幕時的頁籤項目高度可能不同

      _tabItem.removeClass('active');
      _tabItemNow.addClass('active');
      
      if (ww <= wwSmall) {
        tabsOffsetTop = _this.offset().top;
        scollDistance = tabsOffsetTop + tabItemHeight * tabIndexNow - hh;
        _tabItem.not('.active').next().slideUp();
        _tabItemNow.next().slideDown();
        _body.stop(true, false).animate({ scrollTop: scollDistance });
      } else {
        _tabItem.not('.active').next().hide();
        _tabItemNow.next().show();
        _this.height(_tabItemNow.next().innerHeight() + tabItemHeight + _tabItem.last().position().top);
      }
      e.preventDefault();
    }


    let resizeTimer;
    _window.resize(function(){  
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function(){
        ww = _window.width();

        tabLocate(); 

      } , 100);
    });
  });


})