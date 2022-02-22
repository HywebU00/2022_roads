$(function(){

  var _html = $('html');
  var _body = $('body');
  var _window = $(window);

  var ww = _window.width();
  var wh = _window.height();
  var wwNew = ww;

  const wwSlim = 480;
  const wwMedium = 700; //此值以下是手機
  const wwNormal = 960;  //此值以上是電腦
  const wwMaximum = 1200;

  var _menu = $('.webHeader .menu');
  var _menuCtrl = $('.menuCtrl');
  var _sidebar = $('.sidebar');
  var _webHeader = $('.webHeader');


  _html.removeClass('no-js');


  // 製作側欄選單遮罩
  _body.append('<div class="sidebarMask"></div>');

  // 找出_menu中有次選單的li
  _menu.find('li').has('ul').addClass('hasChild');

  // 寬版「主選單」開合
  const _sideStripeWidth = 100;
  _menuCtrl.click(function(){
    ww = _window.width();
    if (_menu.is(':visible')) {
      $(this).removeClass('closeIt');
      // _menu.removeClass('reveal');
      if (ww >= wwMaximum) {
        _menu.animate({left: -1*wwMaximum }, 800, function(){
          _menu.hide();
        })

      } else {
        _menu.animate({left: '-100vw'}, 800, function(){
          _menu.hide();
        })
      }
    } else {
      $(this).addClass('closeIt');
      // _menu.addClass('reveal');
      _menu.show().animate({left: _sideStripeWidth}, 800);
    }
  })


  // 行動版側欄選單
  //複製「主選單」到側欄給行動版用
  _menu.clone().prependTo(_sidebar);
  _menuCtrl.clone().appendTo(_webHeader).addClass('sidebarCtrl').removeClass('menuCtrl');
  // _sidebar.find('.menuCtrl').addClass('sidebarCtrl');
  $('.topNav').clone().appendTo(_sidebar);
  var _sidebarCtrl = _webHeader.find('.sidebarCtrl');
  var _sidebarMenu = _sidebar.find('.menu');
  var _hasChild = _sidebarMenu.find('.hasChild>a');
  var _sidebarMask = $('.sidebarMask');
  _hasChild.click(
    function(e){
      e.preventDefault();

      let _this = $(this);
      let _subMenu = _this.next('ul');

      if (_subMenu.is(':hidden')) {
        _subMenu.stop(true, false).slideDown();
        _this.parent().addClass('closeIt');
      } else {
        _subMenu.stop(true, false).slideUp();
        _this.parent().removeClass('closeIt');
      }
    }
  )


  _sidebarCtrl.click(function(){
    if (_sidebar.hasClass('reveal')) {
      _sidebar.removeClass('reveal');
      _sidebarCtrl.removeClass('closeIt');
      _sidebarMask.fadeOut(400);
      _body.removeClass('noScroll');
    } else {
      _sidebar.addClass('reveal');
      _sidebarCtrl.addClass('closeIt');
      _sidebarMask.fadeIn(400);
      _body.addClass('noScroll')
    }
  })
  _sidebarMask.click(function(){
    _sidebar.removeClass('reveal');
    _sidebarCtrl.removeClass('closeIt');
    _body.removeClass('noScroll');
    $(this).fadeOut(400);
  })

  let winResizeTimer0;
  _window.resize(function () {
    clearTimeout(winResizeTimer0);
    ww = _window.width();
    winResizeTimer = setTimeout(function () {
      if(ww >= wwNormal) {
        _sidebarMask.hide();
        _body.removeClass('noScroll');
        _sidebar.removeClass('reveal');
        _sidebarCtrl.removeClass('closeIt');
      } else {
        _menu.hide().removeAttr('style');
        _menuCtrl.removeClass('closeIt');
      }
    }, 200);
  });



  // 查詢區開合 -----------------------------------------------------
  var _searchCtrl = $('.searchCtrl');
  var _search = $('.search');
  var _closeSearch = _search.find('.closeThis');
  _searchCtrl.click(function(){
    if( _search.hasClass('reveal')) {
      searchHide();
    } else {
      _search.show(0, function(){
        $(this).addClass('reveal');
      });
    }
  })
  _closeSearch.click(function () {
    searchHide();
  })
  function searchHide(){
    _search.removeClass('reveal');
    setTimeout(function(){_search.removeAttr('style')}, 800);
  }


  // fatfooter 開合 -----------------------------------------------------
  var _fatFootCtrl = $('.fatFootCtrl');
  var _footSiteTree = $('.fatFooter').find('.siteTree>ul>li>ul');
  const text1 = _fatFootCtrl.text();
  const text2 = _fatFootCtrl.attr('data-altText');

  _fatFootCtrl.click(function(){
    if ( _footSiteTree.is(':visible')) {
      _footSiteTree.slideUp();
      $(this).addClass('closed').text(text2);
    } else {
      _footSiteTree.slideDown();
      $(this).removeClass('closed').text(text1);
    }
  })


  // 向上捲動箭頭 -----------------------------------------------------
	var _goTop = $('.goTop');
  _goTop.click(function(){
    _html.stop(true,false).animate({scrollTop: 0}, 800);
  });
	_window.scroll(function() {
		if ( $(this).scrollTop() > 200){
			_goTop.addClass('show');
		} else {
      _goTop.removeClass('show');
		}
	});


  // 右側點點快速連結 -----------------------------------------------------
  var _main = $('.main');
  var _mainRow = _main.children('.row');
  var roleCount = _mainRow.length;
  var rowDotLi = '';
  _body.append('<nav class="mpNav"><ul></ul></nav>');
  var _navDotsUl = $('.mpNav>ul');

  // 產生<li><a>元件
  for (let n = 0; n < roleCount; n++) {
    let rowtext = _mainRow.eq(n).find('.blockHeader>h2').text();
    rowDotLi = rowDotLi + `<li><a href="#row${n}" title="${rowtext}"></a></li>`;
    _mainRow.eq(n).attr('id', 'row' + n);
  }
  _navDotsUl.append(rowDotLi);
  var _navDots = _navDotsUl.find('li');
  var navDotTop;

  _navDots.children('a').focus( function(e){
    e.preventDefault();
    let _dotliNow = $(this).parent();
    _dotliNow.addClass('focused').siblings().removeClass('focused');

  })
  _navDots.children('a').click(function(e){
    e.preventDefault();
    let _dotliNow = $(this).parent();
    _dotliNow.addClass('focused').siblings().removeClass('focused');

    navDotTop = _mainRow.eq(_dotliNow.index()).offset().top;

    _html.stop(true, false).animate({'scrollTop': navDotTop }, 800, function(){
      setTimeout(() => {
        _navDots.removeClass('focused');
      }, 1000);
    });
  })


  // 大圖自動輪播 -----------------------------------------------------
  var _bigBanner = $('.bigBanner');
  _bigBanner.each( function() {
    let _this = $(this);
    let _floxBox = _this.find('.flowBox');
    let _flowList = _floxBox.find('.flowList');
    let _flowItem = _flowList.children('li');
    let count = _flowItem.length;
    let _btnRight = _this.find('.diskBtn.next');
    let _btnLeft = _this.find('.diskBtn.prev');
    const speed = 900;
    const duration = 4000;
    const actClassName = 'active';
    let i = 0;
    let j;
    let _dots = '';
    let _indicatItem;
    
    if (count > 1){
      // 產生 indicator
      _floxBox.append('<div class="flowNav"><ul></ul></div>');
      let _indicator = _this.find(".flowNav>ul");
      for (let n = 0; n < count; n++) {
        _dots = _dots + '<li></li>';
      }
      _indicator.append(_dots);
      _indicatItem = _indicator.find('li');
      _indicatItem.eq(i).addClass(actClassName);
    } else {
      _btnRight.add(_btnLeft).hide();
    }

    // 開始自動輪播
    let autoLoop = setInterval( slideForward , duration);


    // 滑鼠移入、移出輪播區
    _floxBox.mouseenter(function(){
      clearInterval(autoLoop);
    });
    _floxBox.mouseleave(function(){
      autoLoop = setInterval( slideForward , duration);
    });

    function slideForward() {
      j = (i + 1) % count;
      _flowItem.eq(i).stop(true, false).animate({'left': '-100%'}, speed, function(){
        $(this).css('left', '100%');
      })
      _flowItem.eq(j).stop(true, false).animate({ 'left': 0}, speed);
      _indicatItem.eq(i).removeClass(actClassName);
      _indicatItem.eq(j).addClass(actClassName);
      i = j;
    }

    function slideBackward() {
      j = (i - 1) % count;
      _flowItem.eq(j).css('left', '-100%').stop(true, true).animate({left: 0} , speed);
      _flowItem.eq(i).stop(true, true).animate({'left': '100%'}, speed );
      _indicatItem.eq(i).removeClass(actClassName);
      _indicatItem.eq(j).addClass(actClassName);
      i = j;
    }

    // 點擊向右箭頭
    _btnRight.click(function () { 
      clearInterval(autoLoop);
      slideForward();
    });

    // 點擊向左箭頭
    _btnLeft.click(function () {
      clearInterval(autoLoop);
      slideBackward();
    });
    _btnRight.add(_btnLeft).focus(function(){
      clearInterval(autoLoop);
    })

    // touch and swipe 左右滑動
    _floxBox.swipe({
      swipeRight: function () {slideBackward();},
      swipeLeft: function () {slideForward();},
      threshold: 20,
    });      


    // 改變視窗大小時，暫停自動輪播
    let winResizeTimer;
    _window.resize(function () {
      clearTimeout(winResizeTimer);
      winResizeTimer = setTimeout(function () {
        clearInterval(autoLoop);
        autoLoop = setInterval( slideForward , duration);
      }, 200);
    });

    // tab 鍵遊走
    _flowItem.children('a').focus(function(){
      clearInterval(autoLoop);
      $(this).parent().css('left', 0).siblings().css('left', '-100%');
      i = $(this).parent().index();
      _indicatItem.removeClass(actClassName).eq(i).addClass(actClassName);
    })
    _flowItem.last().children('a').blur( function(){
      _flowItem.css('left', '100%');
      _flowItem.last().css('left', 0);
      i = count - 1;
      j = (i + 1) % count;
    })
    _floxBox.focusout( function(){
      clearInterval(autoLoop);
      autoLoop = setInterval( slideForward , duration);
    })


  })


  // 點選左右箭頭滑動（非自動輪播） -----------------------------------------
  // .flow1：寬版顯示三筆，每筆等寬 -----------------------------------------
  var _flow1 = $('.flow1');
  _flow1.each(function () {
    let _this = $(this);
    let _floxBox = _this.find('.flowBox');
    let _flowList = _floxBox.find('.flowList');
    let _flowItem = _flowList.children('li');
    let slideDistance = _flowItem.first().outerWidth(true);
    let slideCount = _flowItem.length;
    let _btnRight = _this.find('.diskBtn.next');
    let _btnLeft = _this.find('.diskBtn.prev');
    const speed = 600;
    const actClassName = 'active';
    let i = 0;
    let j;
    let _dots = '';

    // 產生 indicator
    _floxBox.append('<div class="flowNav"><ul></ul></div>');
    let _indicator = _this.find(".flowNav>ul");
    for (let n = 0; n < slideCount; n++) {
      _dots = _dots + '<li></li>';
    }
    _indicator.append(_dots);
    let _indicatItem = _indicator.find('li');
    _indicatItem.eq(i).addClass(actClassName);

    // 依據可視的 slide 項目，決定 indicator 樣式
    indicatReady();
    function indicatReady() {
      _indicatItem.removeClass(actClassName);
      _indicatItem.eq(i).addClass(actClassName);
      if (ww < wwMedium) {
        if (slideCount > 1) {
          flownavShow();
        } else {
          flownavHide();
        }
      }
      if (ww >= wwMedium) {
        if (slideCount <= 2) {
          flownavHide();
        } else {
          flownavShow();
          _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
        }
      }
      if (ww >= wwNormal) {
        if (slideCount <= 3) {
          flownavHide();
        } else {
          flownavShow();
          _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
          _indicatItem.eq((i + 2) % slideCount).addClass(actClassName);
        }
      }
    }
    function flownavShow(){
      _indicator.add(_btnRight).add(_btnLeft).show();
    }
    function flownavHide(){
      _indicator.add(_btnRight).add(_btnLeft).hide();
    }

    function slideForward(){
      _flowList.stop(true, false).animate({'margin-left': -1 * slideDistance }, speed, function(){
        j = (i + 1) % slideCount;
        _flowItem.eq(i).appendTo(_flowList);
        _indicatItem.eq(i).removeClass(actClassName);
        _indicatItem.eq(j).addClass(actClassName);
        _flowList.css('margin-left', 0);
        if (ww >= wwMedium) {
          _indicatItem.eq((j + 1) % slideCount).addClass(actClassName);
        }
        if (ww >= wwNormal) {
          _indicatItem.eq((j + 1) % slideCount).addClass(actClassName);
          _indicatItem.eq((j + 2) % slideCount).addClass(actClassName);
        }
        i = j;
      });
    }
    function slideBackward() {
      j = (i - 1) % slideCount;
      _flowItem.eq(j).prependTo(_flowList);
      _flowList.css("margin-left", -1 * slideDistance);

      _flowList.stop(true, false).animate({ "margin-left": 0 }, speed, function () {
          _indicatItem.eq(j).addClass(actClassName);
          if (ww >= wwNormal) {
            _indicatItem.eq((i + 2) % slideCount).removeClass(actClassName);
          } else if (ww >= wwMedium) {
            _indicatItem.eq((i + 1) % slideCount).removeClass(actClassName);
          } else {
            _indicatItem.eq(i).removeClass(actClassName);
          }
          i = j;
        });
    }

    // 點擊向右箭頭
    _btnRight.click(function () { slideForward(); });

    // 點擊向左箭頭
    _btnLeft.click(function () { slideBackward(); });

    // touch and swipe 左右滑動
    _floxBox.swipe({
      swipeRight: function () {slideBackward();},
      swipeLeft: function () {slideForward();},
      threshold: 20,
    });

    // tab focus
    let tabCount = 0;
    _flowItem.children('a').focus(function (e) { 
      e.preventDefault();
      if ( tabCount > 0 && tabCount <= slideCount) {
        slideForward();
      }
      tabCount++
      if(tabCount > slideCount) {
        _btnLeft.focus();
        tabCount = 0;
      }
    });

    let winResizeTimer;
    _window.resize(function () {
      clearTimeout(winResizeTimer);
      winResizeTimer = setTimeout(function () {
        ww = _window.width();
        slideDistance = _flowItem.first().outerWidth(true);
        indicatReady();
      }, 200);
    });
  });


  // .flow2：寬版顯示三筆，中間圖放大且與其他項排版不同 --------------------
  var _flowCenter = $('.flow2');
  _flowCenter.each(function () {
    let _this = $(this);
    let _floxBox = _this.find('.flowBox');
    let _flowList = _floxBox.find('.flowList');
    let _flowItem = _flowList.children('li');
    let slideDistance = _flowItem.eq(0).outerWidth(true);
    let slideCount = _flowItem.length;
    let _btnRight = _this.find('.diskBtn.next');
    let _btnLeft = _this.find('.diskBtn.prev');
    const speed = 800;
    const actClassName = 'active';
    let i = 0;
    let j = 1;
    let _dots = '';

    // 產生 indicator
    _flowList.after('<div class="flowNav"><ul></ul></div>');
    let _indicator = _this.find(".flowNav>ul");
    for (let n = 1; n <= slideCount; n++) {
      _dots = _dots + '<li><span>' + n + '</span></li>';
    }
    _indicator.append(_dots);
    let _indicatItem = _indicator.find('li');
    _indicatItem.removeClass(actClassName).eq(1).addClass(actClassName);
    _flowItem.removeClass(actClassName).eq(1).addClass(actClassName);

    function slideForward() {
      j = (i + 1) % slideCount;
      _flowItem.eq(j).removeClass(actClassName);
      _flowItem.eq((j + 1) % slideCount).addClass(actClassName);

      _flowList.stop(true, false).animate({'left': -1 * slideDistance}, speed, function () {
        _flowList.css('left', 0);
        _flowItem.eq(i).appendTo(_flowList);
        _indicatItem.eq(j).removeClass(actClassName);
        _indicatItem.eq((j + 1) % slideCount).addClass(actClassName);
        i = j;
      });
    }

    function slideBackward() {
      j = (i - 1) % slideCount;
      _flowItem.eq((i + 1) % slideCount).removeClass(actClassName);
      _flowItem.eq(i).addClass(actClassName);
      _flowItem.eq(j).prependTo(_flowList);
      _flowList.css('left', -1 * slideDistance);

      _flowList.stop(true, false).animate({ 'left': 0  }, speed, function () {
        _indicatItem.removeClass(actClassName).eq(i).addClass(actClassName);
        i = j;
      });
    }

    // 點擊向右箭頭
    _btnRight.click(function () { slideForward(); });

    // 點擊向左箭頭
    _btnLeft.click(function () { slideBackward(); });

    // touch and swipe 左右滑動
    _floxBox.swipe({
      swipeRight: function () {slideBackward();},
      swipeLeft: function () {slideForward();},
      threshold: 20,
    });

    // tab focus
    let tabCount = 0;
    _flowItem.children('a').focus(function(e){
      e.preventDefault();
      if (tabCount == 0) {
        slideBackward();
        tabCount++;
      } else if ( tabCount < slideCount) {
        slideForward();
        tabCount++;
      } else {
        _btnLeft.focus();
        tabCount = 0;
      }
    })



    // 點擊數字 ＊＊＊未完成
    // _indicatItem.children('button').click(function(){
    //   let k = $(this).parent().index();
    //   $(this).parent().addClass(actClassName).siblings().removeClass(actClassName);
    //   _flowItem.eq(k).addClass(actClassName).siblings().removeClass(actClassName);

    //   if (k > j) {
    //     _flowList.stop(true, false).animate({'left': (j - k) * slideDistance}, speed, function () {
    //       _flowList.css('left', 0);
    //       _flowItem.eq(i).appendTo(_flowList);
    //       j = k;
    //     });
    //   }

    // })

    

    let winResizeTimer;
    _window.resize(function () {
      clearTimeout(winResizeTimer);
      winResizeTimer = setTimeout(function () {
        slideDistance = _flowItem.not('.active').outerWidth(true);
      }, 200);
    });
  });


  // .flow3：寬版顯示兩筆完整，第三筆顯示局部 ------------------------------
  var _flow3 = $('.flow3');
  _flow3.each(function () {
    let _this = $(this);
    let _floxBox = _this.find('.flowBox');
    let _flowList = _floxBox.find('.flowList');
    let _flowItem = _flowList.children('li');
    let slideDistance = _flowItem.first().outerWidth(true);
    let slideCount = _flowItem.length;
    let _btnRight = _this.find('.diskBtn.next');
    let _btnLeft = _this.find('.diskBtn.prev');
    const speed = 600;
    const actClassName = 'active';
    let i = 0;
    let j;
    let _dots = '';

    // 產生 indicator
    _floxBox.append('<div class="flowNav"><ul></ul></div>');
    let _indicator = _this.find(".flowNav>ul");
    for (let n = 0; n < slideCount; n++) {
      _dots = _dots + '<li></li>';
    }
    _indicator.append(_dots);
    let _indicatItem = _indicator.find('li');
    _indicatItem.eq(i).addClass(actClassName);

    // 依據可視的 slide 項目，決定 indicator 樣式
    indicatReady();
    function indicatReady() {
      _indicatItem.removeClass(actClassName);
      _indicatItem.eq(i).addClass(actClassName);
      if (ww < wwMedium ) {
        if ( slideCount > 1) {
          flownavShow();
        } else {
          flownavHide()
        }
      }
      if (ww >= wwMedium) {
        if (slideCount <= 2) {
          flownavHide();
        } else {
          flownavShow();
          _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
        }
      }
    }
    function flownavShow(){
      _indicator.add(_btnRight).add(_btnLeft).show();
    }
    function flownavHide(){
      _indicator.add(_btnRight).add(_btnLeft).hide();
    }


    function slideForward() {
      _flowList.stop(true, false).animate({ 
        'margin-left': -1 * slideDistance }, speed, function () {
          j = (i + 1) % slideCount;
          _flowItem.eq(i).appendTo(_flowList);
          _indicatItem.eq(i).removeClass(actClassName);
          _indicatItem.eq(j).addClass(actClassName);
          _flowList.css('margin-left', 0);

          // if (ww >= wwMedium) {
          //   _indicatItem.eq((j + 1) % slideCount).addClass(actClassName);
          // }
          if (ww >= wwNormal) {
            _indicatItem.eq((j + 1) % slideCount).addClass(actClassName);
            // _indicatItem.eq((j + 2) % slideCount).addClass(actClassName);
          }
          i = j;
        });
    }
    function slideBackward() {
      j = (i - 1) % slideCount;
      _flowItem.eq(j).prependTo(_flowList);
      _flowList.css('margin-left', -1 * slideDistance);

      _flowList.stop(true, false).animate({ 'margin-left': 0 }, speed, function () {
          _indicatItem.eq(j).addClass(actClassName);
          if (ww >= wwNormal) {
            // _indicatItem.eq(i).removeClass(actClassName);
            _indicatItem.eq((i + 1) % slideCount).removeClass(actClassName);
          // } else if (ww >= wwMedium) {
          //   _indicatItem.eq((i + 1) % slideCount).removeClass(actClassName);
          } else {
            _indicatItem.eq(i).removeClass(actClassName);
          }
          i = j;
        });
    }

    // 點擊向右箭頭
    _btnRight.click(function () { slideForward(); });

    // 點擊向左箭頭
    _btnLeft.click(function () { slideBackward(); });

    // touch and swipe 左右滑動
    _floxBox.swipe({
      swipeRight: function () {slideBackward();},
      swipeLeft: function () {slideForward();},
      threshold: 20,
    });

    // tab focus
    let tabCount = 0;
    _flowItem.children('a').focus(function (e) { 
      e.preventDefault();
      if ( tabCount > 0 && tabCount <= slideCount) {
        slideForward();
      }
      tabCount++
      if(tabCount > slideCount) {
        _btnLeft.focus();
        tabCount = 0;
      }
    });
    var winResizeTimer;
    _window.resize(function () {
      clearTimeout(winResizeTimer);
      winResizeTimer = setTimeout(function () {
        ww = _window.width();
        slideDistance = _flowItem.first().outerWidth(true);
        indicatReady();
      }, 200);
    });


  });

  // .photoflow：cp頁的照片 -----------------------------------------
  var _photoflow = $('.photoflow');
  _photoflow.each(function () {
    let _this = $(this);
    let _floxBox = _this.find('.flowBox');
    let _flowList = _floxBox.find('.flowList');
    let _flowItem = _flowList.children('li');
    let slideDistance = _flowItem.first().outerWidth(true);
    let slideCount = _flowItem.length;
    let _btnRight = _this.find('.diskBtn.next');
    let _btnLeft = _this.find('.diskBtn.prev');
    const speed = 400;
    const actClassName = 'active';
    let i = 0;
    let j;
    let _dots = '';

    // 產生 indicator
    _floxBox.append('<div class="flowNav"><ul></ul></div>');
    let _indicator = _this.find(".flowNav>ul");
    for (let n = 0; n < slideCount; n++) {
      _dots = _dots + '<li></li>';
    }
    _indicator.append(_dots);
    let _indicatItem = _indicator.find('li');
    _indicatItem.eq(i).addClass(actClassName);
    _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);

    // 依據可視的 slide 項目，決定 indicator 樣式
    indicatReady();
    function indicatReady() {
      _indicatItem.removeClass(actClassName);
      _indicatItem.eq(i).addClass(actClassName);
      _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
      if (ww < wwMedium) {
        if (slideCount > 2) {
          flownavShow();
        } else {
          flownavHide();
        }
      }
      if (ww >= wwMedium) {
        if (slideCount <= 3) {
          flownavHide();
        } else {
          flownavShow();
          _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
          _indicatItem.eq((i + 2) % slideCount).addClass(actClassName);
        }
      }
      if (ww >= wwNormal) {
        if (slideCount <= 4) {
          flownavHide();
        } else {
          flownavShow();
          _indicatItem.eq((i + 1) % slideCount).addClass(actClassName);
          _indicatItem.eq((i + 2) % slideCount).addClass(actClassName);
          _indicatItem.eq((i + 3) % slideCount).addClass(actClassName);
        }
      }
    }
    function flownavShow(){
      _indicator.add(_btnRight).add(_btnLeft).show();
    }
    function flownavHide(){
      _indicator.add(_btnRight).add(_btnLeft).hide();
    }

    function slideForward(){
      _flowList.stop(true, false).animate({'margin-left': -1 * slideDistance }, speed, function(){
        j = (i + 1) % slideCount;
        _flowItem.eq(i).appendTo(_flowList);
        _indicatItem.eq(i).removeClass(actClassName);
        _indicatItem.eq(j).addClass(actClassName);
        _indicatItem.eq((j + 1) % slideCount).addClass(actClassName);
        _flowList.css('margin-left', 0);
        if (ww >= wwMedium) {
          _indicatItem.eq((j + 2) % slideCount).addClass(actClassName);
        }
        if (ww >= wwNormal) {
          _indicatItem.eq((j + 3) % slideCount).addClass(actClassName);
        }
        i = j;
      });
    }
    function slideBackward() {
      j = (i - 1) % slideCount;
      _flowItem.eq(j).prependTo(_flowList);
      _flowList.css("margin-left", -1 * slideDistance);

      _flowList.stop(true, false).animate({ "margin-left": 0 }, speed, function () {
          _indicatItem.eq(j).addClass(actClassName);
          if (ww >= wwNormal) {
            _indicatItem.eq((i + 3) % slideCount).removeClass(actClassName);
          } else if (ww >= wwMedium) {
            _indicatItem.eq((i + 2) % slideCount).removeClass(actClassName);
          } else {
            _indicatItem.eq((i + 1) % slideCount).removeClass(actClassName);
            _indicatItem.eq(i).removeClass(actClassName);
          }
          i = j;
        });
    }

    // 點擊向右箭頭
    _btnRight.click(function () { slideForward(); });

    // 點擊向左箭頭
    _btnLeft.click(function () { slideBackward(); });

    // touch and swipe 左右滑動
    _floxBox.swipe({
      swipeRight: function () {slideBackward();},
      swipeLeft: function () {slideForward();},
      threshold: 20,
    });

    // tab focus
    let tabCount = 0;
    _flowItem.children('a').focus(function (e) { 
      e.preventDefault();
      if ( tabCount > 0 && tabCount <= slideCount) {
        slideForward();
      }
      tabCount++
      if(tabCount > slideCount) {
        _btnLeft.focus();
        tabCount = 0;
      }
    });

    let winResizeTimer;
    _window.resize(function () {
      clearTimeout(winResizeTimer);
      winResizeTimer = setTimeout(function () {
        ww = _window.width();
        slideDistance = _flowItem.first().outerWidth(true);
        indicatReady();
      }, 200);
    });
  });

  // cp頁的照片開啟的燈箱內的大圖，點選滑動 -----------------------------------------------------
  var _bigPhotoShow = $('.bigPhotoShow');
  _bigPhotoShow.each( function() {
    let _this = $(this);
    let _floxBox = _this.find('.flowBox');
    let _flowList = _floxBox.find('.flowList');
    let _flowItem = _flowList.children('li');
    let count = _flowItem.length;
    let _btnRight = _this.find('.diskBtn.next');
    let _btnLeft = _this.find('.diskBtn.prev');
    const speed = 900;
    const actClassName = 'active';
    let i = 0;
    let j;
    

    function slideForward() {
      j = (i + 1) % count;
      _flowItem.eq(i).stop(true, false).animate({'left': '-100%'}, speed, function(){
        $(this).css('left', '100%');
      })
      _flowItem.eq(j).stop(true, false).animate({ 'left': 0}, speed);
      i = j;
    }

    function slideBackward() {
      j = (i - 1) % count;
      _flowItem.eq(j).css('left', '-100%').stop(true, true).animate({left: 0} , speed);
      _flowItem.eq(i).stop(true, true).animate({'left': '100%'}, speed );
      i = j;
    }

    // 點擊向右箭頭
    _btnRight.click(function () { 
      slideForward();
    });

    // 點擊向左箭頭
    _btnLeft.click(function () {
      slideBackward();
    });

    // touch and swipe 左右滑動
    _floxBox.swipe({
      swipeRight: function () {slideBackward();},
      swipeLeft: function () {slideForward();},
      threshold: 20,
    });      





  })





  // ======================================================================
  // ======================================================================
  // ======================================================================

  // ----------------------------------- 外掛套件 slick 參數設定
  // slick 參數設定：結束



  // 燈箱 --- 
  var _showLightbox =  $('.showLightbox');
  var _lightbox = $('.lightbox');
  // _lightbox.filter('.courtsList').append('<div class="overlayForClose"></div>');
  var _hideLightbox = _lightbox.find('.closeThis, .hideLightbox');
  var _lightboxNow;
  const speed = 400;

  _lightbox.before('<div class="coverAll"></div>');
  var _cover = $('.coverAll');
  
  _showLightbox.click(function(){
    let boxID = $(this).attr('data-id');
    _lightboxNow = _lightbox.filter( function(){ return $(this).attr('data-id') === boxID} );
    _lightboxNow.stop(true, false).fadeIn(speed).addClass('show');
    _lightboxNow.prev(_cover).fadeIn(speed);
    _body.addClass('noScroll');
  })

  _hideLightbox.click(function(){
    let _targetLbx = $(this).parents('.lightbox');
    _targetLbx.stop(true, false).fadeOut(speed,
      function(){
        _targetLbx.removeClass('show');
        // if( _targetLbx.has('.tabs')){
        //   _targetLbx.removeAttr('style');
        // }
      }
    );
    _targetLbx.prev(_cover).fadeOut(speed);
    _body.removeClass('noScroll');
  })

  _cover.click(function(){
    let _targetLbx = $(this).next('.lightbox');
    $(this).fadeOut(speed);
    _targetLbx.fadeOut(speed,
      function(){
        _targetLbx.removeClass('show');
        // if( _targetLbx.has('.tabs')){
        //   _targetLbx.removeAttr('style');
        // }
      }
    );
    _body.removeClass('noScroll');
  })




  // // 條列頁 active 樣式
  // var _category = $('.category');
  // _category.each(function(){
  //   let _item = $(this).find('li');
  //   _item.click(function(){
  //     $(this).addClass('active').siblings().removeClass('active');
  //   })
  // })


  // // 開合區 slideToggle
  // var _slideToggle = $('.slideToggle');
  // _slideToggle.each(function(){
  //   let _this = $(this);
  //   let _ctrl = _this.find('.slideCtrl');
  //   let _drawer = _this.find('.drawer');
  //   let text1 = _ctrl.text();
  //   let text2 = _ctrl.attr('data-altTitle');

  //   if(_drawer.is(':hidden')) {
  //     _ctrl.addClass('openIt').text(text2);
  //   } else {
  //     _ctrl.removeClass('openIt').text(text1);
  //   }

  //   _ctrl.click(function(){
  //     if (_drawer.is(':visible')) {
  //       _drawer.slideUp();
  //       $(this).addClass('openIt').text(text2);
  //     } else {
  //       _drawer.slideDown();
  //       $(this).removeClass('openIt').text(text1);
  //     }
  //   })
  // })





})