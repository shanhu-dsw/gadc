$(document).ready(function () {
  if ($('.controller_location_events').length + $('.action_index').length != 2 && $('.controller_location_events').length + $('.action_show').length != 2 )
    return


  //督察问题总览地图
  var dashboard_chart_map = function () {

    let map_location_name = '山东省'
    let map_chart = echarts.init(document.getElementById('location-events-map'));
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
        show: false,
      },
      visualMap: { //视觉映射组件
        show: false,
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
        roam: false,  //拖动放大
        zoom: 2.3,
        layoutCenter: ['50%', '50%'],
        y: 400,
        x: 600,
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
            borderWidth: 5,//区域边框宽度
            borderColor: '#111111',//区域边框颜色
            shadowColor: 'rgb(75,58,2)',
            shadowBlur: 8,
            areaColor: "#014069",//区域颜色
            label: {show: false},
          },
          emphasis: {
            show: false,
            label: {show: true, fontSize: 12, fontWeight: 'bold', color: '#fff'},
            borderWidth: 5,
            borderColor: '#111111',//区域边框颜色
            shadowColor: 'rgb(75,58,2)',
            shadowBlur: 8,
            areaColor: "#014069",//区域颜色
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
          zoom: 1,//放大比例
          data: [],
          symbolSize: 15,
          showEffectOn: 'render',
          rippleEffect: {
            period: 5, //波纹秒数
            brushType: 'stroke', //stroke(涟漪)和fill(扩散)，两种效果
            scale: 3 //波纹范围
          },
          hoverAnimation: true,

          label: {
            show: true,
            formatter: (p) => {
              var dataCon = p.data;
              var txtCon = dataCon.name + ' : 问题共计' + dataCon.value[2] + '个';
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

    $.get('/admin/json/' + map_location_name + '.json', function (yCjson) {
      echarts.registerMap(map_location_name, yCjson);
      map_chart.setOption(map_chart_option);
    });

    map_chart.on('click', function (params) { //点击事件
      if (params.componentType === 'series') {
        $.ajax({
          url: "/admin/problems/stats_problem_map_modal?name=" + params.name + '&time=' + map_modal_time,
          success: function (result) {
            $('#problem-map-modal-container').html(result);
            $('#problem-map-modal').modal('show');
          }
        });
      }
    })

  };
  dashboard_chart_map();

});
