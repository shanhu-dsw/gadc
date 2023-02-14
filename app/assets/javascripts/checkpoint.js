// ...
//= require rails-ujs
//= require action_cable
//= require checkpoint/lib/jquery.min
//= require checkpoint/lib/bootstrap.bundle.min
//= require checkpoint/lib/echarts.min.js

//= require checkpoint/utils
//= require checkpoint/cable
//= require checkpoint/dashboard
//= require checkpoint/location_events


$(document).ready(function () {

  //动态加载巡查图片的长链接
  // var camera_captures = [];
  // var inserted_count = 0;

  // function appendCameraCaptures() {
  //   if (camera_captures.length === 0)
  //     return
  //
  //   var camera_capture = $('#camera-captures');
  //
  //   if (camera_capture.length === 0)
  //     return;
  //
  //   if (inserted_count > 20) {
  //     inserted_count = inserted_count - 1;
  //     camera_capture.find('div:first').remove();
  //   }
  //
  //   var scrollWidth = camera_capture[0].scrollWidth;
  //   var scrollOffset = camera_capture.scrollLeft() + camera_capture.outerWidth() + 100;
  //
  //   var current_camera_capture = camera_captures.shift();
  //   var path = current_camera_capture.camera.location.path
  //
  //   inserted_count = inserted_count + 1;
  //   camera_capture.append('<div class="camera-capture-card">\n' +
  //     '      <img src="' + current_camera_capture.img_data.src + '">\n' +
  //     '      <div class="camera-capture-title text-center">' + path[3].name + '</div>\n' +
  //     '    </div>');
  //
  //   if (scrollOffset >= scrollWidth)
  //     camera_capture.animate({scrollLeft: scrollWidth}, 800);
  // }
  //
  // setInterval(appendCameraCaptures, 1000);

  // App.cable.subscriptions.create({channel: "CameraCaptureChannel"}, {
  //   received: function (data) {
  //     camera_captures.push(data);
  //   }
  // });
  
  //中间底部滑动函数
  var dashboard_captures_sliding_times = 1; //滑动计数

  function dashboard_capture_sliding() {
    let children_element = $('#camera-captures-body').children().length;  //判断可滑动元素数量
    let sliding_distance = (((window.innerWidth - window.innerHeight * 0.96)/3) + window.innerHeight * 0.02) * dashboard_captures_sliding_times;  //计算滑动距离

    if (children_element - 3 >= dashboard_captures_sliding_times) {   //判断是否满足滑动要求
      $('#camera-captures-body').animate({marginLeft: -sliding_distance}, 1500);
      dashboard_captures_sliding_times++
    } else {
    }
  };

  var Home_EVENT_SLIDING_TIME = setInterval(dashboard_capture_sliding, 2000); //定时滑动函数
  // $("#dashboard-event-card-container").mouseenter(function () {   //鼠标移入时，停止滑动
  //   clearInterval(Home_EVENT_SLIDING_TIME);    //停止定时
  // })

});