$(document).ready(function () {
  $sidebar = $('.sidebar');
  $navbar = $('.navbar');
  $main_panel = $('.main-panel');

  $full_page = $('.full-page');

  $sidebar_responsive = $('body > .navbar-collapse');
  sidebar_mini_active = true;
  white_color = false;

  window_width = $(window).width();

  fixed_plugin_open = $('.sidebar .sidebar-wrapper .nav li.active a p').html();


  $('.fixed-plugin a').click(function (event) {
    if ($(this).hasClass('switch-trigger')) {
      if (event.stopPropagation) {
        event.stopPropagation();
      } else if (window.event) {
        window.event.cancelBubble = true;
      }
    }
  });

  $('.fixed-plugin .background-color span').click(function () {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');

    var new_color = $(this).data('color');

    if ($sidebar.length != 0) {
      $sidebar.attr('data', new_color);
    }

    if ($main_panel.length != 0) {
      $main_panel.attr('data', new_color);
    }

    if ($full_page.length != 0) {
      $full_page.attr('filter-color', new_color);
    }

    if ($sidebar_responsive.length != 0) {
      $sidebar_responsive.attr('data', new_color);
    }
  });

  $('.switch-sidebar-mini input').on("switchChange.bootstrapSwitch", function () {
    var $btn = $(this);

    if (sidebar_mini_active == true) {
      $('body').removeClass('sidebar-mini');
      sidebar_mini_active = false;
      blackDashboard.showSidebarMessage('Sidebar mini deactivated...');
    } else {
      $('body').addClass('sidebar-mini');
      sidebar_mini_active = true;
      blackDashboard.showSidebarMessage('Sidebar mini activated...');
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    var simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event('resize'));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  });

  $('.switch-change-color input').on("switchChange.bootstrapSwitch", function () {
    var $btn = $(this);

    if (white_color == true) {

      $('body').addClass('change-background');
      setTimeout(function () {
        $('body').removeClass('change-background');
        $('body').removeClass('white-content');
      }, 900);
      white_color = false;
    } else {

      $('body').addClass('change-background');
      setTimeout(function () {
        $('body').removeClass('change-background');
        $('body').addClass('white-content');
      }, 900);

      white_color = true;
    }


  });

  $('.light-badge').click(function () {
    $('body').addClass('white-content');
  });

  $('.dark-badge').click(function () {
    $('body').removeClass('white-content');
  });

  //?????????????????????js??????
  // demo.initNowUiWizard();

  setTimeout(function () {
    $('.card.card-wizard').addClass('active');
  }, 200);

  //????????????js??????
  $('#datatable').DataTable({
    pagingType: false,
    lengthMenu: false,
    paging: false,
    ordering: false,
    info: false,
    searching: false,
    responsive: false,
  });

  var table = $('#datatable').DataTable();

  // Edit record
  table.on('click', '.edit', function () {
    $tr = $(this).closest('tr');
    if ($($tr).hasClass('child')) {
      $tr = $tr.prev('.parent');
    }

    var data = table.row($tr).data();
    alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
  });

  // Delete a record
  table.on('click', '.remove', function (e) {
    $tr = $(this).closest('tr');
    if ($($tr).hasClass('child')) {
      $tr = $tr.prev('.parent');
    }
    table.row($tr).remove().draw();
    e.preventDefault();
  });

  //Like record
  table.on('click', '.like', function () {
    alert('You clicked on Like button');
  });

  //????????????????????????
  blackDashboard.initDateTimePicker();

  // Initialise Sweet Alert library
  demo.showSwal();

});