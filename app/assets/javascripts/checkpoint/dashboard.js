$(document).ready(function () {
  if ($('.controller_dashboard').length + $('.action_index').length != 2)
    return

  //督察问题总览地图
  var dashboard_chart_map = function (places) {
    var map_location_name = current_location_name;
    let map_chart = echarts.init(document.getElementById('dashboard-map'));
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
        roam: true,  //拖动放大
        zoom: 2,
        scaleLimit: { //滚轮缩放的极限控制
          min: 2,
          max: 2
        },
        layoutCenter: ['50%', '50%'],
        y: 250,
        x: 700,
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
          data: places,
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
              var txtCon = dataCon.name + ': 预警共' + dataCon.value[2] + '个';
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

  //预警单位数据
  var dashboard_chart_location_statistics_bar = function (names, location_events_counts) {

    let courserate = echarts.init(document.getElementById('dashboard-chart-bar'));
    let option = {
      grid: {
        top: '7%',
        left: '2%',
        right: '8%',
        bottom: '0%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: 'rgb(22,104,255)'
          }
        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'value',
          boundaryGap: false,
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(9,86,255,0)',
            }
          },
          axisLabel: {//坐标轴刻度设置
            show: false,
            color: 'white',
            fontSize: '12',
            bottom: '40%',
            margin: 10//刻度标签与轴线之间的距离。
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(18,174,192,0)'
            }
          },
        }
      ],
      yAxis: [
        {
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(9,86,255,0)',
            }
          },
          splitArea: {show: false},

          axisLabel: {//坐标轴刻度设置
            color: '#E2E2E2',
            fontSize: '10',
            margin: 10,//刻度标签与轴线之间的距离。
            // formatter: function (value) {
            //   if (value.length <= 8) {
            //     return value.substr(0, 10) + '\n' + value.substr(4, 4)
            //   } else {
            //     return value.substr(0, 4) + '\n' + value.substr(4, 3) + '....'
            //   }
            // },
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(98,11,255,0)'
            }
          },
          type: 'category',
          data: names,
        }
      ],

      series:
        {
          name: '地区问题统计',
          type: 'bar',
          smooth: 0.1,
          barWidth: 15,//柱图宽度
          symbol: 'circle',     //折点设定为实心点
          symbolSize: 8,   //设定实心点的大小
          itemStyle: {
            normal: {
              barBorderRadius: 5,
              lineStyle: {
                width: 2//设置线条粗细
              },

              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(15,211,255,0.4)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(15,211,255,0.95)'// 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }

            }
          },
          label: {
            formatter: '{c}',
            show: true, //开启显示
            position: 'right',
            textStyle: { //数值样式
              color: '#f6f6f6',
              fontSize: 12,
              fontWeight: 600
            }
          },
          data: location_events_counts,
        }
    };

    courserate.setOption(option, true)
  };

  //问题整改数据
  var dashboard_chart_pie1 = function (discover_types, total) {
    let courserate = echarts.init(document.getElementById('dashboard-chart-pie1'));
    let option = {
      title: {
        text: '问题总数',//主标题文本
        subtext: total.toString(),//副标题文本
        left: 'center',
        top: '38%',
        textStyle: {
          fontSize: 12,
          color: '#f1f1f5',
          align: 'center'
        },
        subtextStyle: {
          fontFamily: "微软雅黑",
          fontSize: 12,
          color: '#ffffff',
        }
      },
      series: [
        {
          name: '问题类型',
          type: 'pie',
          radius: ['65%', '40%'],
          color: ['#2b82d5', '#57eeff', '#37ffaa', '#8266ff'],
          center: ['50%', '50%'],
          hoverAnimation: false,　　//鼠标悬浮是否有区域弹出动画，false:无 true:有
          data: discover_types,
          itemStyle: {
            borderWidth: 5,
            borderColor: '#1a2436',
            emphasis: {
              show: false,
              shadowBlur: 0,
              shadowOffsetX: 0,
            }
          },

          label: {            //饼图图形上的文本标签
            normal: {
              show: false,
            }
          },

          labelLine: {    //引导线设置
            normal: {
              show: false,   //引导线显示
            }
          },


        },
      ]
    };

    courserate.setOption(option, true);
  };

  $.ajax({
    type: 'GET',
    url: '/checkpoint/dashboard/places',
    dataType: 'json',
    success: function (result) {
      var place_coordinates = [];
      var place_names = [];
      var place_location_event_counts = [];

      for (var i = 0; i < result.data.length; i++) {
        place_names.push(result.data[i].name);
        place_location_event_counts.push(result.data[i].location_event_count);
        place_coordinates.push({
          name: result.data[i].name,
          value: [result.data[i].lon, result.data[i].lat, result.data[i].location_event_count]
        })
      }

      dashboard_chart_map(place_coordinates);
      dashboard_chart_location_statistics_bar(place_names, place_location_event_counts);
    }
  })

  $.ajax({
    type: 'GET',
    url: '/checkpoint/dashboard/problems_group_by_status',
    dataType: 'json',
    success: function (result) {
      var problem_statuses = [];
      var total = 0;
      var keys = Object.keys(result.data);
      for (var i = 0; i < keys.length; i++) {
        total = total + result.data[keys[i]];
        problem_statuses.push({name: keys[i], value: result.data[keys[i]]})
      }
      dashboard_chart_pie1(problem_statuses, total);
      $('#problem-reviewing-count').html(result.data['上级审核']);
      $('#problem-waiting-count').html(result.data['待审核']);
      $('#problem-correcting-count').html(result.data['整改中']);
      $('#problem-corrected-count').html(result.data['已整改']);
    }
  })


  var dashboard_chart_pie2 = function (events, total) {
    let courserate = echarts.init(document.getElementById('dashboard-chart-pie2'));
    let option = {
      title: {
        text: '预警总数',//主标题文本
        subtext: total.toString(),//副标题文本
        left: 'center',
        top: '41%',
        textStyle: {
          fontSize: 12,
          color: '#f1f1f5',
          align: 'center'
        },
        subtextStyle: {
          fontFamily: "微软雅黑",
          fontSize: 12,
          color: '#ffffff',
        }
      },
      series: [
        {
          name: '问题类型',
          type: 'pie',
          radius: ['65%', '40%'],
          color: ['#f94242', '#fa9545', '#fbcb45', '#fbcb45'],
          center: ['50%', '50%'],
          hoverAnimation: false,　　//鼠标悬浮是否有区域弹出动画，false:无 true:有
          data: events,
          itemStyle: {
            borderWidth: 5,
            borderColor: '#1a2436',
            emphasis: {
              show: false,
              shadowBlur: 0,
              shadowOffsetX: 0,
            }
          },

          label: {            //饼图图形上的文本标签
            normal: {
              show: false,
            }
          },

          labelLine: {    //引导线设置
            normal: {
              show: false,   //引导线显示
            }
          },
        },
      ]
    };

    courserate.setOption(option, true);
  };

  $.ajax({
    type: 'GET',
    url: '/checkpoint/dashboard/location_events_group_by_event',
    dataType: 'json',
    success: function (result) {
      var events = [];
      var total = 0
      var keys = Object.keys(result.data);
      for (var i = 0; i < keys.length; i++) {
        total = total + result.data[keys[i]];
        events.push({name: keys[i], value: result.data[keys[i]]})
      }
      dashboard_chart_pie2(events, total);
    }
  })

  var dashboard_events_sliding_times = 1; //滑动计数

  function dashboard_event_sliding() {
    let children_element = $('#dashboard-event-card-container').children().length;  //判断可滑动元素数量
    let sliding_distance = (window.innerHeight * 0.14) * dashboard_events_sliding_times;  //计算滑动距离

    if (children_element - 3 >= dashboard_events_sliding_times) {   //判断是否满足滑动要求
      $('#dashboard-event-card-container').animate({marginTop: -sliding_distance}, 1500);
      dashboard_events_sliding_times++
    } else {
    }
  };

  var Home_EVENT_SLIDING_TIME = setInterval(dashboard_event_sliding, 3000); //定时滑动函数
  $("#dashboard-event-card-container").mouseenter(function () {   //鼠标移入时，停止滑动
    clearInterval(Home_EVENT_SLIDING_TIME);    //停止定时
  })

  // $(".alert-card-body").scroll(function(){
  //   let element_height = $(this)[0].scrollHeight
  //   if($(this)[0].scrollTop + $(".alert-card-body").height() + 5 > element_height){
  //     console.log('到低')
  //   }else if ($(this)[0].scrollTop <= 0){
  //     console.log('到头')
  //     dashboard_events_sliding_times = 1; //滑动计数
  //     var Home_EVENT_SLIDING_TIME = setInterval(dashboard_event_sliding, 2000); //定时滑动函数
  //   }else {
  //     clearInterval(Home_EVENT_SLIDING_TIME);    //停止定时
  //   }
  //
  // })

});
