$(document).on('ajax:success', '.form-resource', function (e, data, status, xhr) {
  if (e.originalEvent.detail[0].data)
    window.location.replace(e.originalEvent.detail[0].data);
});

$(document).on('ajax:error', '.form-resource', function (e, data, status, xhr) {

  Swal.fire({
    title: '出错了',
    text: e.originalEvent.detail[0].data,
    type: 'error',
    timer: 5000,
    confirmButtonText: '好的',
    customClass: {
      confirmButton: 'btn btn-info'
    },
    buttonsStyling: false
  });
});


$(document).ready(function () {
  var body = $('body');
  window.controller_name = body.data('controller-name');
  window.action_name = body.data('action-name');
  window.current_location_id = body.data('current-location-id');
  window.current_location_name = body.data('current-location-name');
  window.current_location_level_index = body.data('current-location-level-index');

  $(document).find('select.select2').not('.select2-hidden-accessible').select2();
});


$(document).on('click', '.image-preview', function () {
  let id = $(this).data('capture-id');
  if (id) {
    $('.problem-tracking-btn').removeClass('d-none')
    $('#problem-tracking-link').attr('href', '/admin/camera_captures/' + id + '?locale=zh-CN');
  }
  var modal = $('#image-preview-modal');
  $(modal).find('img').attr('src', $(this).attr('src'));
  $(modal).modal('show');
})

$(document).on('change', 'input[name="resource_selection"]', function () {
  if ($('input[name="resource_selection"]:checked').length > 0) {
    $('#resources-destroy-all').show();
    $('#resources-select-all').show();
  } else {
    $('#resources-destroy-all').hide();
    $('#resources-select-all').hide();
  }
});

$(document).on('click', '#resources-select-all', function () {

  if ($('#resources-select-all').text() == '取消全部选中') {
    $('#resources-select-all').html('本页全部选中')
    $('#resources-destroy-all').hide();
    $('#resources-select-all').hide();
    $('input[name="resource_selection"]:checkbox').each(function () {
      $(this).prop('checked', false);
      $(this).data('waschecked', false);
    })
  } else {
    $('#resources-select-all').html('取消全部选中')
    $('input[name="resource_selection"]:checkbox').each(function () {
      $(this).prop('checked', true);
      $(this).data('waschecked', true);
    })
  }
})

$(document).on('click', '#resources-destroy-all', function () {
  if (confirm('确认要删除全部选中数据吗？')) {
    var success_count = $('input[name="resource_selection"]:checked').length;

    $('input[name="resource_selection"]:checked').each(function () {
      var id = $(this).data('id');
      $.ajax({
        url: '/admin/' + controller_name + '/' + String(id),
        method: 'delete',
        data: {
          "authenticity_token": $('meta[name=csrf-token]').attr('content')
        },
        success: function () {
          success_count = success_count - 1;
          if (success_count <= 0) {
            window.location.reload();
          }
        }
      });
    })
  }
})

$(document).on("click", ".go-back", function (e) {
  window.history.back();
  e.preventDefault();

});

$(document).on("click", ".data-layout-report-group-button", function () {
  $('.layout-report-text-container-box').addClass('d-none')
  $('.layout-report-text-container-' + $(this).data('layout-report')).removeClass('d-none')
});