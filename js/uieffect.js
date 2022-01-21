$(function(){

  var _html = $('html');
  var _body = $('body');
  var _window = $(window);

  var ww = _window.width();
  var wh = _window.height();
  var wwNew = ww;

  const wwMedium = 640; //此值以下是手機
  const wwWide = 960;  //此值以上是電腦
  const wwMaximum = 1200;
  const wwSlim = 500;

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











  // ======================================================================
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