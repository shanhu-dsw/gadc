$(document).ready(function () {
  var location_events = [];

  function display_location_event_notification() {
    if (location_events.length === 0) return;

    var location_event = location_events[0];
    location_events.shift();

    var message_text = '智慧督察在';
    var path = location_event.location.path;

    var authorized = false;
    for (var i = 0; i < path.length; i++) {
      if (i > current_location_level_index)
        message_text = message_text + path[i].name;
      authorized = authorized || path[i].id === current_location_id;
    }

    if (!authorized) {
      display_location_event_notification();
      return;
    }

    message_text = message_text + '产生了' + location_event.event.name + '预警';

    var utterance = new SpeechSynthesisUtterance();

    utterance.text = message_text;
    utterance.lang = 'zh-CN';
    speechSynthesis.speak(utterance);

    $.notify({
      icon: "tim-icons icon-bell-55",
      message: message_text,
      url: '/admin/location_events/' + location_event.id
    }, {
      type: 'info',
      timer: 1000,
      placement: {
        from: 'top',
        align: 'right'
      },
      onClosed: function () {
        display_location_event_notification();
      }
    });
  }

  App.cable.subscriptions.create({channel: "LocationEventChannel"}, {
    received: function (data) {
      location_events.push(data);
      if (location_events.length === 1) display_location_event_notification();
    }
  });

  $('#location_event_location_division_id').on('change', function () {

    $.ajax({
      url: "/admin/locations/location_children/" + $('#location_event_location_division_id').val(), success: function (result) {
        let data = result.map(function (a) {
          return {text: a.name, id: a.id}
        });

        $('#location_event_location_id').select2('destroy').empty().select2({
          data: data
        });
      }
    });
  });

  function mark_alert_img_ids() {
    let capture_img_ids = []
    $('.camera_capture_selected').each(function (key, item) {
      capture_img_ids.push($(item).data('camera-capture-id'))
    })
    return capture_img_ids;
  }

  let location_event_id = $('.created-location-event-camera-capture-images').data('location-event-id')
  $(document).on('click', '.camera_capture_select', function () {
    let element_content = $(this).text();
    if ($(this).hasClass('camera_capture_selected')) {
      $(this).removeClass('camera_capture_selected btn-success');
      $(this).html(element_content.replace('已选中','未选中'))
    } else {
      $(this).addClass('camera_capture_selected btn-success');
      $(this).html(element_content.replace('未选中','已选中'))
    }
  })

  $(document).on('click', '.created-location-event-camera-capture-images', function () {
    $.ajax({
      url: "/admin/location_events/create_event_capture?camera_capture_id=" + mark_alert_img_ids() + '&location_event_id=' + location_event_id, success: function (result) {
        window.location.replace(result.url);
      }
    });
  })

  $(document).on('change', '#query_location_category_ids', function () {
    var id = $(this).attr('id');


    $.ajax({
      url: "/admin/location_categories?query_parent=" + $(this).val() + '&page_size=999',
      dataType: 'json',
      success: function (result) {
        var options = [{text: '请选择', id: ''}];
        for (var i = 0; i < result.data.data.length; i++) {
          options.push({text: result.data.data[i].name, id: result.data.data[i].id})
        }

        $('#query_location_category_id').select2('destroy').empty().select2({
          data: options
        });
      }
    });
  })

  function getLocationCategorys(){
    let location_category_id = $('#query_location_category_ids').val()
    if(location_category_id) {
      $.ajax({
        url: "/admin/location_categories?query_parent=" + location_category_id + '&page_size=999',
        dataType: 'json',
        success: function (result) {
          var options = [{text: '请选择', id: ''}];
          for (var i = 0; i < result.data.data.length; i++) {
            options.push({text: result.data.data[i].name, id: result.data.data[i].id})
          }

          $('#query_location_category_id').select2('destroy').empty().select2({
            data: options
          });
        }
      });
    }
  }
  getLocationCategorys()


  //临时测试，用于改善返回不刷新问题
  window.onpageshow = function(event) {
    if (event.persisted) {
      window.location.reload();
    }
  }

});