$(document).ready(function () {
    if (controller_name === 'camera_captures' && action_name === 'index') {

      //设置场所二级筛选的代码_start


      let location_categories_arr = []

      $(document).on('change', '#query_location_category_ids', function () {
        var id = $(this).attr('id');


        $.ajax({
          url: "/admin/location_categories?query_parent=" + $(this).val() + '&page_size=999',
          dataType: 'json',
          success: function (result) {
            var location_categories_arr_temp = []
            var options = [{text: '请选择', id: ''}];
            for (var i = 0; i < result.data.data.length; i++) {
              options.push({text: result.data.data[i].name, id: result.data.data[i].id})
              location_categories_arr_temp.push(result.data.data[i].id)
            }
            location_categories_arr = location_categories_arr_temp
            $('#query_location_category_id').select2('destroy').empty().select2({
              data: options
            });
          }
        });
      })

      //设置场所二级筛选的代码_end

        var old_camera_captures = []    //已查看的图片数组
        var new_camera_captures = []    //未查看的图片数组
        var current_camera_capture = null     //正在查看的图片

        var bar = null;        //进度条对象
        var slider = null;      //速度调节器对象
        var camera_capture_filters = {};      //出图过滤器

        $('#camera-capture-img').height($('#camera-capture-img').width() * 0.5625);

        for (var i = 0; i < 5; i++) {
            var location_filter = $('#query_location_id_' + String(i));
            if (location_filter.val() !== '') {
                camera_capture_filters[location_filter.attr('id')] = location_filter.val();
            }
        }

        slider = document.getElementById('sliderRegular');
        noUiSlider.create(slider, {
            start: [5],
            connect: true,
            range: {
                'min': 0,
                'max': 10
            },
            step: 1
        });

        // 加载进度条
        let progress = document.getElementById('progress');
        bar = new ProgressBar.Line(progress, {
            strokeWidth: 1,
            duration: 1000 * slider.noUiSlider.get(),
            color: '#ED6A5A',
            text: {
                style: {
                    display: 'none'
                },
                autoStyleContainer: false
            },
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: {width: '100%', height: '100%'},
            from: {color: '#ED6A5A'},
            to: {color: '#FFEA82'},
            step: function (state, bar) {
                bar.path.setAttribute('stroke', state.color);
                bar.setText(Math.round(bar.value() * 100) + ' %');
            }
        });

        function apply_camera_capture_filters(data) {
            if (data.camera.status !== 'normal') return false;

            var filters = Object.keys(camera_capture_filters);
            var path_hash = {}, i;
            for (i = 0; i < data.camera.location.path.length; i++) {
                path_hash[data.camera.location.path[i].id] = data.camera.location.path[i]
            }

            for (i = 0; i < filters.length; i++) {
                var key = filters[i];
                if (key === 'query_location_id_0' && !path_hash[camera_capture_filters[key]]) return false;
                if (key === 'query_location_id_1' && !path_hash[camera_capture_filters[key]]) return false;
                if (key === 'query_location_id_2' && !path_hash[camera_capture_filters[key]]) return false;
                if (key === 'query_location_id_3' && !path_hash[camera_capture_filters[key]]) return false;
                if (key === 'query_location_id_4' && !path_hash[camera_capture_filters[key]]) return false;
                if (key === 'bodies_greater_or_equal_than' && camera_capture_filters[key] >= data.bodies_count) return false;
                if (key === 'bodies_less_or_equal_than' && camera_capture_filters[key] <= data.bodies_count) return false;
                if (key === 'query_camera_id' && data.camera.id !== parseInt(camera_capture_filters[key])) return false;
                if (key === 'query_location_category_ids' && location_categories_arr.indexOf(data.camera.location.location_category_id) < 0) return false;
                if (key === 'query_location_category_id' && data.camera.location.location_category_id !== parseInt(camera_capture_filters[key])) return false;
            }

            return true;
        }

        // 加载CameraCapture长链接
        App.cable.subscriptions.create({channel: "CameraCaptureChannel"}, {
            received: function (data) {
              console.log(data)
                if (new_camera_captures.length <= 10000 && apply_camera_capture_filters(data)) {
                    new_camera_captures.push(data);
                    if (current_camera_capture) updateCameraCapturesInfo(); else cameraCapturePlayNext();
                }
            }
        });

        //上一个按钮事件
        $(document).on('click', '.camera-capture-play-prev', function () {
            cameraCapturePlayPrev()
        })

        //下一个按钮事件
        $(document).on('click', '.camera-capture-play-next', function () {
            cameraCapturePlayNext()
        })

        //上一个方法
        function cameraCapturePlayPrev() {
            if (current_camera_capture) new_camera_captures.unshift(current_camera_capture);
            current_camera_capture = old_camera_captures.pop();
            updateCurrentCameraCaptureInfo(true);
            bar.stop();
        }

        //下一个方法
        function cameraCapturePlayNext() {
            if (current_camera_capture) old_camera_captures.push(current_camera_capture);
            current_camera_capture = new_camera_captures.shift();
            updateCurrentCameraCaptureInfo(false);
        }

        //输入搜索条件弹窗
        $("#query_location_id_0,#query_location_id_1,#query_location_id_2,#query_location_id_3,#query_location_id_4,#query_camera_id,#bodies_greater_or_equal_than,#bodies_less_or_equal_than,#query_location_category_id,#query_location_category_ids").change(function () {
            if ($(this).val() !== '') {
                camera_capture_filters[$(this).attr('id')] = $(this).val()
            } else {
                delete camera_capture_filters[$(this).attr('id')];
            }

            var filtered_new_camera_captures = [], filtered_old_camera_captures = [], i;

            for (i = 0; i < new_camera_captures.length; i++) {
                if (apply_camera_capture_filters(new_camera_captures[i]))
                    filtered_new_camera_captures.push(new_camera_captures[i])
            }

            new_camera_captures = filtered_new_camera_captures;

            for (i = 0; i < old_camera_captures.length; i++) {
                if (apply_camera_capture_filters(old_camera_captures[i]))
                    filtered_old_camera_captures.push(old_camera_captures[i])
            }

            old_camera_captures = filtered_old_camera_captures;
        });

        //已查看未查看数量更新方法
        function updateCameraCapturesInfo() {
            $('#camera-capture-viewed-number').html(old_camera_captures.length);
            $('#camera-capture-no-viewed-number').html(new_camera_captures.length);
        }

        //更新图片及详细信息方法
        function updateCurrentCameraCaptureInfo(pause) {
            if (current_camera_capture) {              //如果有图片执行的代码
                $('#camera-capture-url').attr('href', '/admin/camera_captures/' + current_camera_capture.id + '?locale=zh-CN');

                var path = current_camera_capture.camera.location.path

                for (var i = 0; i < path.length; i++) {
                    $('#camera-capture-location-name-' + String(i)).html(path[i].name);
                }
                $('#problem_location_id').val(current_camera_capture.camera.location.id);
                $('#problem_camera_capture_ids').val(String(current_camera_capture.id));
                $('#camera-capture-camera-name').html(current_camera_capture.camera.name);
                $('#camera-capture-created-at').html(current_camera_capture.created_at.substr(0, 10) + '\t' + current_camera_capture.created_at.substr(11, 8));
                $('#camera-capture-img').attr("src", current_camera_capture.img_data.src);
                $('#camera-capture-create-problem-button').removeAttr("disabled");
                bar.set(0);
                if (!pause) {
                    bar.set(1.0);
                    bar.animate(0, {
                        duration: 1000 * slider.noUiSlider.get()
                    }, cameraCapturePlayNext);
                }

            } else {      //如果没图片执行的代码
                $('#camera-capture-url').attr('href', '');
                // $('#camera-capture-create-problem-button').attr("disabled","disabled");
                $('#camera-capture-camera-0').html('');
                $('#camera-capture-camera-1').html('');
                $('#camera-capture-camera-2').html('');
                $('#camera-capture-camera-3').html('');
                $('#camera-capture-camera-4').html('');
                $('#problem_location_id').val('');
                $('#camera-capture-created-at').html('');
                $('#camera-capture-img').attr("src", "/admin/images/admin_search.gif");
                $('#camera-captures-face').html('')
                $('#camera-capture-camera-name').html('')
                $('#camera-capture-location-name-0').html('')
                $('#camera-capture-location-name-1').html('')
                $('#camera-capture-location-name-2').html('')
                $('#camera-capture-location-name-3').html('')
                $('#camera-capture-location-name-4').html('')
                bar.set(0);
            }

            //更新已查看未查看数量
            updateCameraCapturesInfo()
        }

        // 创建问题打开新页面
        $(document).on('ajax:success', '#mark-problem-form', function (e, data, status, xhr) {
            $('#create-problem-modal').modal('hide')
            $.ajax({
                url: "/admin/problems/open_problem_show",
                success: function (result) {
                    window.open(result.data);
                }
            });
        });

        $(document).on('ajax:error', '#mark-problem-form', function (e, data, status, xhr) {

        });
    }

//创建问题弹窗
    $(document).on('click', '.create-problem-modal-button', function () {
        var modal = $('#create-problem-modal');
        modal.modal('show');
        bar.stop();
    });


    //创建巡检数据
    if (controller_name === 'camera_captures') {
        $('#camera_capture_location_division_id').on('change', function () {

            $.ajax({
                url: "/admin/locations/location_children/" + $('#camera_capture_location_division_id').val(),
                success: function (result) {
                    let data = result.map(function (a) {
                        return {text: a.name, id: a.id}
                    });

                    $('#camera_capture_location_id').select2('destroy').empty().select2({
                        data: data
                    });

                    if (data.length > 0) {
                        $('#camera_capture_location_id').val(data[0].id).change();
                    }

                }
            });

        });

        $('#camera_capture_location_id,#camera_capture_location_division_id').on('change', function () {

            $.ajax({
                url: "/admin/cameras/location_camera?location_id=" + $('#camera_capture_location_id').val(),
                success: function (result) {
                    let data = result.map(function (a) {
                        return {text: a.name, id: a.id}
                    });

                    $('#camera_capture_camera_id').select2('destroy').empty().select2({
                        data: data
                    });

                    if (data.length > 0) {
                        $('#camera_capture_camera_id').val(data[0].id).change();
                    }
                }
            });

        });

        $(document).on('click', '.location-upload-map-btn', function () {
            $('.location-form-control-map').click()
        })

        $(document).on('change', '.location-form-control-map', function (e) {
            $('.location-upload-map-btn').html(e.currentTarget.files[0].name)
        })

        $(document).on('click', '.location-upload-map-btn2', function () {
            $('.location-form-control-map2').click()
        })

        $(document).on('change', '.location-form-control-map2', function (e) {
            $('.location-upload-map-btn2').html(e.currentTarget.files[0].name)
        })

    }

});

$(document).on('click', '.create-problem-modal-button-history', function () {
    var modal = $('#create-problem-modal');
    modal.modal('show');
});



