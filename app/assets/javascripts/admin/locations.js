$(document).ready(function () {

  if (controller_name === 'locations') {

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

    $(document).on('click', '.btn-secondary', function () {
      var modal = $('#create-location-modal');
      modal.modal('hide');
    })

    $(document).on('click', '.btn-secondary', function () {
      var modal = $('#edit-location-modal');
      modal.modal('hide');
    })
  }


  if (controller_name === 'locations' && action_name === 'map') {
    var location_chart_map = function (data) {
      var map_location_name = current_location_name;
      var map_chart = echarts.init(document.getElementById('location-chart-map'));
      var map_chart_option = {
        tooltip: {
          backgroundColor: "#4D46F9",
          textStyle: {color: "#fff"},
          formatter: '{b}'
        },
        title: {
          textStyle: {fontSize: 26, color: "#1E90FF"},
          text: map_location_name + '督察地图',
          left: 'center',
          y: 0,
          // show: false,
        },
        visualMap: { //视觉映射组件
          show: true,
          min: 0,
          max: 20, // 侧边滑动的最大值，从数据中获取
          left: '5%',
          top: '93%',
          textStyle: {color: '#fff'},
          inverse: false, //是否反转 visualMap 组件
          itemHeight: 200,  //图形的高度，即长条的高度
          text: ['高（数据来源：月）', '低'], // 文本，默认为数值文本
          calculable: true, //是否显示拖拽用的手柄（手柄能拖拽调整选中范围）
          // seriesIndex: 1, //指定取哪个系列的数据，即哪个系列的 series.data,默认取所有系列
          orient: "horizontal",
          //range:[4, 4],    //指定手柄对应数值的位置。range 应在 min max 范围内
          inRange: {
            color: ['#1d8cf8', '#ff8d72'],
          },
        },
        geo: {
          map: map_location_name,
          roam: true,  //拖动放大
          zoom: 3,
          layoutCenter: ['50%', '50%'],
          y: 80,
          mapLocation: {
            y: 60,
          },
          label: {
            normal: {
              show: true,//显示省份标签
              textStyle: {
                color: 'white',
                fontWeight: 500,
                fontSize: 14,
              }//省份标签字体颜色
            },
            emphasis: {//对应的鼠标悬浮效果
              show: false,
              textStyle: {
                color: "#fffffb",
              },
            }
          },
          itemStyle: {
            normal: {
              borderWidth: 2,//区域边框宽度
              borderColor: '#02faff',//区域边框颜色
              shadowColor: 'rgb(75,58,2)',
              shadowBlur: 10,
              areaColor: "rgba(2,250,255,0.05)",//区域颜色
              label: {show: false},
            },
            emphasis: {
              show: false,
              label: {show: true, fontSize: 12, fontWeight: 'bold', color: '#fff'},
              borderWidth: 1.5,
              borderColor: '#74c9bb',
              shadowColor: '#5AC3B5',
              shadowBlur: 10,
              areaColor: 'rgba(12,69,153,0.1)',
            }
          },
          tooltip: {
            show: true,       //不显示提示标签
            trigger: 'item',
          },
        },
        series: [
          {
            name: 'villages',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zoom: 1.1,//放大比例
            data: data,
            symbolSize: 15,
            showEffectOn: 'render',
            rippleEffect: {
              period: 5, //波纹秒数
              brushType: 'stroke', //stroke(涟漪)和fill(扩散)，两种效果
              scale: 2 //波纹范围
            },
            hoverAnimation: true,

            label: {
              show: true,
              formatter: (p) => {
                var dataCon = p.data;
                var txtCon = dataCon.name + ':' + dataCon.value[2];
                return txtCon
              },
              position: 'bottom'
            },

            itemStyle: {
              color: '#1effff'
            },
            emphasis: {
              label: {
                show: true
              }
            }
          },

        ],
      };

      // $.get('/admin/json/' + map_location_name + '.json', function (yCjson) {
      //   echarts.registerMap(map_location_name, yCjson);
      //   map_chart.setOption(map_chart_option);
      // });
      $.ajax({
        url: '/admin/locations/map_json/?name=' + map_location_name,
        method: 'get',
        success: function (result) {
          $("#get-map-json-hide").load(result.map_data.src,
            function(data) {
              echarts.registerMap(map_location_name, JSON.parse(data));
              map_chart.setOption(map_chart_option);
            })
        }
      });

      map_chart.on('click', function (params) {//点击事件

        if (params.componentType === 'series') {
          $.ajax({
            url: "/admin/locations/stats_big_problem_map_modal?name=" + params.name + '&time=' + 'month',
            success: function (result) {
              $('#supervise-map-modal-container').html(result);
              $('#problem-map-modal').modal('show');
            }
          });
        }
      })
    };


    //督察问题总览图-数据接入
    $.ajax({
      url: "/admin/locations/stats_location_group_data",
      success: function (result) {
        var problemMap = []
        for (var obj in result.data) {
          problemMap.push({name: obj, value: result.data[obj]})
        }
        location_chart_map(problemMap)
      }
    });
  }

  if (controller_name === 'locations' && action_name === 'index') {

    $(document).on('click', '.create-location-modal-button', function () {
      var modal = $('#create-location-modal');
      modal.modal('show');
      $(document).find('select.select2').not('.select2-hidden-accessible').select2();
    })

    function fetchTreeNode(id, target) {
      $.ajax({
        url: '/admin/locations/tree/' + String(id),
        method: 'get',
        success: function (result) {
          target.html(result);
        }
      });
    }

    $(document).on('click', '.tree-switch', function () {
      var tree_node = $(this).closest('.tree-node');
      if ($(this).find('i').hasClass('fa-chevron-right')) {
        $(this).find('i').removeClass('fa-chevron-right').addClass('fa-chevron-down');
        fetchTreeNode(tree_node.data('id'), tree_node.find('.tree-node-children'));
      } else {
        $(this).find('i').removeClass('fa-chevron-down').addClass('fa-chevron-right')
        tree_node.find('.tree-node-children').html('');
      }
    })

    $(document).on('click', '.tree-node-new', function () {
      var tree_node = $(this).closest('.tree-node');
      var modal = $('#create-location-modal');
      modal.modal('show');
      $(document).find('select.select2').not('.select2-hidden-accessible').select2();
      $('#location_parent_id').val(tree_node.data('id'));
    })

    $(document).on('click', '.tree-node-edit', function () {
      var tree_node = $(this).closest('.tree-node');
      $.ajax({
        url: '/admin/locations/edit_modal/' + String(tree_node.data('id')),
        method: 'get',
        success: function (result) {
          $('#edit-location-modal-container').html(result);
          var modal = $('#edit-location-modal');
          modal.modal('show');
          $(document).find('select.select2').not('.select2-hidden-accessible').select2();
        }
      });
    })

    $(document).on('ajax:success', '.form-location', function (e, data, status, xhr) {
      Swal.fire({
        title: '操作成功',
        text: '成功修改地点!',
        type: 'success',
        timer: 600,
        confirmButtonText: '好的',
        customClass: {
          confirmButton: 'btn btn-success'
        },
        buttonsStyling: false
      });
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

    var tree_root = $('#tree-root');
    if (tree_root.length > 0) {
      fetchTreeNode(tree_root.data('id'), tree_root);
    }
  }

  $(document).on('change', '#location_id_0, #location_id_1, #location_id_2, #location_id_3, #query_location_id_0, #query_location_id_1, #query_location_id_2, #query_location_id_3', function () {
    var id = $(this).attr('id');
    var id_array = id.split('_');
    var id_index = parseInt(id_array[id_array.length - 1]);
    id_array[id_array.length - 1] = String(id_index + 1);
    var next_id = id_index >= 4 ? '#problem_location_id' : '#' + id_array.join('_');

    $.ajax({
      url: "/admin/locations?query_parent_id=" + $(this).val(),
      dataType: 'json',
      success: function (result) {
        var options = [{text: id_array[0] === 'query' ? '全部' : '请选择', id: ''}];
        for (var i = 0; i < result.data.data.length; i++) {
          options.push({text: result.data.data[i].name, id: result.data.data[i].id})
        }

        if ($(next_id).length > 0)
          $(next_id).select2('destroy').empty().select2({
            data: options
          });
      }
    });
  })


});
