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

  
  _body.append('<div class="sidebarMask"></div>')

  _menu.find('li').has('ul').addClass('hasChild');

  // 寬版「主選單」開合
  _menuCtrl.click(function(){
    if (_menu.hasClass('reveal')) {
      $(this).removeClass('closeIt');
      _menu.removeClass('reveal');
    } else {
      $(this).addClass('closeIt');
      _menu.addClass('reveal');
    }
  })


  // 行動版側欄選單
  //複製「主選單」到側欄給行動版用
  _menu.add(_menuCtrl).clone().prependTo(_sidebar);
  _sidebar.find('.menuCtrl').addClass('sidebarCtrl');
  $('.topNav').clone().appendTo(_sidebar);
  var _sidebarCtrl = _sidebar.find('.sidebarCtrl');
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


  // 查詢
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


  // -----------------------------------------------------向上捲動箭頭
	var _goTop = $('.goTop');
  _goTop.click(function(){
    _html.stop(true,false).animate({scrollTop: 0}, 800);
  });










  // ======================================================================
  //  ----------------------------------------- 點選左右箭頭滑動（非自動輪播）
  // 寬版顯示三筆，每筆等寬
  var _flow = $('.flow1');
  _flow.each(function () {
    let _this = $(this);
    let _floxBox = _this.find('.flowBox');
    let _flowList = _floxBox.find('.flowList');
    let _flowItem = _flowList.children('li');
    let slideDistance = _flowItem.outerWidth(true);
    let slideCount = _flowItem.length;
    let _btnRight = _this.find('.diskBtn.next');
    let _btnLeft = _this.find('.diskBtn.prev');
    const speed = 600;
    let i = 0;
    let j;
    let _dots = '';

    // 產生 indicator
    _floxBox.append('<div class="flowNav"><ul></ul></div>');
    let _indicator = _this.find(".flowNav>ul");
    for (let n = 0; n < slideCount; n++) {
      _dots = _dots + '<li><button type="botton"></button></li>';
    }
    _indicator.append(_dots);
    let _indicatItem = _indicator.find('li');
    _indicatItem.eq(i).addClass('now');

    // 依據可視的 slide 項目，決定 indicator 樣式
    indicatReady();
    function indicatReady() {
      ww = _window.width();
      _indicatItem.removeClass('now');
      _indicatItem.eq(i).addClass('now');
      if (ww < wwMedium && slideCount > 1) {
        _indicator.show();
      }
      if (ww >= wwMedium) {
        if (slideCount <= 2) {
          _indicator.hide();
        } else {
          _indicator.show();
          _indicatItem.eq((i + 1) % slideCount).addClass("now");
        }
      }
      if (ww >= wwNormal) {
        if (slideCount <= 3) {
          _indicator.add(_btnRight).add(_btnLeft).hide();
        } else {
          _indicatItem.eq((i + 1) % slideCount).addClass("now");
          _indicatItem.eq((i + 2) % slideCount).addClass("now");
        }
      }
    }

    function slideForward() {
      _flowList.stop(true, false).animate({ 
        'margin-left': -1 * slideDistance }, speed, function () {
          j = (i + 1) % slideCount;
          _flowItem.eq(i).appendTo(_flowList);
          _indicatItem.eq(i).removeClass('now');
          _indicatItem.eq(j).addClass('now');
          _flowList.css('margin-left', 0);

          // if (ww >= wwMedium) {
          //   _indicatItem.eq((j + 1) % slideCount).addClass('now');
          // }
          if (ww >= wwNormal) {
            _indicatItem.eq((j + 1) % slideCount).addClass('now');
            _indicatItem.eq((j + 2) % slideCount).addClass('now');
          }
          i = j;
        });
    }
    function slideBackward() {
      j = (i - 1) % slideCount;
      _flowItem.eq(j).prependTo(_flowList);
      _flowList.css("margin-left", -1 * slideDistance);

      _flowList.stop(true, false).animate({ "margin-left": 0 }, speed, function () {
          _indicatItem.eq(j).addClass("now");
          if (ww >= wwNormal) {
            _indicatItem.eq((i + 2) % slideCount).removeClass("now");
          // } else if (ww >= wwMedium) {
          //   _indicatItem.eq((i + 1) % slideCount).removeClass("now");
          } else {
            _indicatItem.eq(i).removeClass("now");
          }
          i = j;
        });
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

    var winResizeTimer2;
    _window.resize(function () {
      clearTimeout(winResizeTimer2);
      winResizeTimer2 = setTimeout(function () {
        slideDistance = _flowItem.outerWidth(true);
        _flowList.width(slideDistance * slideCount);
        indicatReady();
      }, 210);
    });


  });

  // 寬版顯示三筆，中間圖放大且與其他li排版不同
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
    const speed = 600;
    let i = 0;
    let j;
    let _dots = '';

    // 產生 indicator
    _flowList.after('<div class="flowNav"><ul></ul></div>');
    let _indicator = _this.find(".flowNav>ul");
    for (let n = 1; n <= slideCount; n++) {
      _dots = _dots + '<li><button type="botton">' + n + '</button></li>';
    }
    _indicator.append(_dots);
    let _indicatItem = _indicator.find('li');
    _indicatItem.removeClass('active').eq(1).addClass('active');
    _flowItem.removeClass('active').eq(1).addClass('active');

    function slideForward() {
      j = (i + 1) % slideCount;
      _flowItem.eq(j).removeClass('active');
      _flowItem.eq((j + 1) % slideCount).addClass('active');

      _flowList.stop(true, false).animate({'left': -1 * slideDistance}, speed, function () {
        _flowList.css('left', 0);
        _flowItem.eq(i).appendTo(_flowList);
        _indicatItem.eq(j).removeClass('active');
        _indicatItem.eq((j + 1) % slideCount).addClass('active');
        i = j;
      });
    }

    function slideBackward() {
      j = (i - 1) % slideCount;
      _flowItem.eq((i + 1) % slideCount).removeClass('active');
      _flowItem.eq(i).addClass('active');
      _flowItem.eq(j).prependTo(_flowList);
      _flowList.css('left', -1 * slideDistance);

      _flowList.stop(true, false).animate({ 'left': 0  }, speed, function () {
        // _flowList.css('left', -1 * slideDistance);
        _indicatItem.removeClass('active').eq(i).addClass('active');
        i = j;
      });
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

    let winResizeTimer;
    _window.resize(function () {
      clearTimeout(winResizeTimer);
      winResizeTimer = setTimeout(function () {
        slideDistance = _flowItem.not('.active').outerWidth(true);
      }, 200);
    });
  });

  // 寬版顯示兩筆完整，第三筆顯示局部
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
    let i = 0;
    let j;
    let _dots = '';

    // 產生 indicator
    _floxBox.append('<div class="flowNav"><ul></ul></div>');
    let _indicator = _this.find(".flowNav>ul");
    for (let n = 0; n < slideCount; n++) {
      _dots = _dots + '<li><button type="botton"></button></li>';
    }
    _indicator.append(_dots);
    let _indicatItem = _indicator.find('li');
    _indicatItem.eq(i).addClass('now');

    // 依據可視的 slide 項目，決定 indicator 樣式
    indicatReady();
    function indicatReady() {
      ww = _window.width();
      _indicatItem.removeClass('now');
      _indicatItem.eq(i).addClass('now');
      if (ww < wwMedium && slideCount > 1) {
        _indicator.show();
      }
      if (ww >= wwNormal) {
        if (slideCount <= 2) {
          _indicator.add(_btnRight).add(_btnLeft).hide();
        } else {
          _indicatItem.eq((i + 1) % slideCount).addClass("now");
          // _indicatItem.eq((i + 2) % slideCount).addClass("now");
        }
      }
    }

    function slideForward() {
      _flowList.stop(true, false).animate({ 
        'margin-left': -1 * slideDistance }, speed, function () {
          j = (i + 1) % slideCount;
          _flowItem.eq(i).appendTo(_flowList);
          _indicatItem.eq(i).removeClass('now');
          _indicatItem.eq(j).addClass('now');
          _flowList.css('margin-left', 0);

          // if (ww >= wwMedium) {
          //   _indicatItem.eq((j + 1) % slideCount).addClass('now');
          // }
          if (ww >= wwNormal) {
            _indicatItem.eq((j + 1) % slideCount).addClass('now');
            // _indicatItem.eq((j + 2) % slideCount).addClass('now');
          }
          i = j;
        });
    }
    function slideBackward() {
      j = (i - 1) % slideCount;
      _flowItem.eq(j).prependTo(_flowList);
      _flowList.css("margin-left", -1 * slideDistance);

      _flowList.stop(true, false).animate({ "margin-left": 0 }, speed, function () {
          _indicatItem.eq(j).addClass("now");
          if (ww >= wwNormal) {
            // _indicatItem.eq(i).removeClass("now");
            _indicatItem.eq((i + 1) % slideCount).removeClass("now");
          // } else if (ww >= wwMedium) {
          //   _indicatItem.eq((i + 1) % slideCount).removeClass("now");
          } else {
            _indicatItem.eq(i).removeClass("now");
          }
          i = j;
        });
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

    var winResizeTimer;
    _window.resize(function () {
      clearTimeout(winResizeTimer);
      winResizeTimer = setTimeout(function () {
        slideDistance = _flowItem.first().outerWidth(true);
        indicatReady();
      }, 210);
    });


  });





  // ======================================================================
  // ======================================================================
  // ======================================================================

  // ----------------------------------- 外掛套件 slick 參數設定
  // slick 參數設定：結束








  // 燈箱 --- 【所屬單位清單】 顯示／隱藏 ，【登入區】顯示／隱藏 ，【進階查詢】 顯示／隱藏 ，
  var _showLightbox =  $('.showLightbox');
  var _lightbox = $('.lightbox');
  _lightbox.filter('.courtsList').append('<div class="overlayForClose"></div>');
  var _hideLightbox = _lightbox.find('.closeThis, .hideLightbox, .overlayForClose');
  var _lightboxNow;
  const speed = 400;

  _lightbox.before('<div class="cover"></div>');
  var _cover = $('.cover');
  
  _showLightbox.click(function(){
    let boxID = $(this).attr('data-id');
    _lightboxNow = _lightbox.filter( function(){ return $(this).attr('data-id') === boxID} );
    _lightboxNow.stop(true, false).slideDown(speed).addClass('show');
    _lightboxNow.prev(_cover).fadeIn(speed);
    _body.addClass('noScroll');
  })

  _hideLightbox.click(function(){
    let _targetLbx = $(this).parents('.lightbox');
    _targetLbx.stop(true, false).slideUp(speed,
      function(){
        _targetLbx.removeClass('show');
        if( _targetLbx.has('.tabs')){
          _targetLbx.removeAttr('style');
        }
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
        if( _targetLbx.has('.tabs')){
          _targetLbx.removeAttr('style');
        }
      }
    );
    _body.removeClass('noScroll');
  })





  //go top and bottom------------------------------------------
	var _goTop = $('.goTop');
  _goTop.click(function(e){
    e.preventDefault();
    _body.stop(true,false).animate({scrollTop: 0}, 600);
  });

	$(window).scroll(function() {
		if ( $(this).scrollTop() > 200){
			_goTop.addClass('show');
		} else {
      _goTop.removeClass('show');
		}
	});

  // 條列頁 active 樣式
  var _category = $('.category');
  _category.each(function(){
    let _item = $(this).find('li');
    _item.click(function(){
      $(this).addClass('active').siblings().removeClass('active');
    })
  })


  // 開合區 slideToggle
  var _slideToggle = $('.slideToggle');
  _slideToggle.each(function(){
    let _this = $(this);
    let _ctrl = _this.find('.slideCtrl');
    let _drawer = _this.find('.drawer');
    let text1 = _ctrl.text();
    let text2 = _ctrl.attr('data-altTitle');

    if(_drawer.is(':hidden')) {
      _ctrl.addClass('openIt').text(text2);
    } else {
      _ctrl.removeClass('openIt').text(text1);
    }

    _ctrl.click(function(){
      if (_drawer.is(':visible')) {
        _drawer.slideUp();
        $(this).addClass('openIt').text(text2);
      } else {
        _drawer.slideDown();
        $(this).removeClass('openIt').text(text1);
      }
    })
  })





})