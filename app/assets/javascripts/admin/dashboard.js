$(document).ready(function () {
  if ($('.controller_dashboard').length + $('.action_index').length != 2)
    return


  var fetch_data = function (url, params, success) {
    $.ajax({
      type: 'GET',
      url: url,
      data: params,
      dataType: 'json',
      success: function (result) {
        success(result.data);
      }
    })
  }

  //问题分析饼图
  var dashboard_chart_problem_analysis_pie1 = function (data) {
    let courserate = echarts.init(document.getElementById('dashboard-chart-problem-analysis-pie'));
    let option = {

      legend: {
        orient: 'vertical',
        right: '0',
        icon: "circle",
        y: '17%',
        x: '58%',
        textStyle: {
          color: "#klj34",
          fontSize: 12,
        },

        formatter: function (name) {
          var oa = option.series[0].data;
          var num = oa[0].value + oa[1].value + oa[2].value + oa[3].value;
          for (var i = 0; i < option.series[0].data.length; i++) {
            if (name == oa[i].name) {
              return name + '：' + oa[i].value;
            }
            // if (name == '已处理') {
            //     return name + '问题：' + result.yclpro;
            // }
            // if (name == '未处理') {
            //     return name + '问题：' + result.wclpro;
            // }
          }
        },


      },
      series: [
        {
          name: '问题类型',
          type: 'pie',
          radius: ['55%', '40%'],
          color: ['#4572FA', '#00E2B3', '#fcd85a', '#ff7b0a', '#f15b1e'],
          center: ['27%', '45%'],
          data: data,
          itemStyle: {
            borderWidth: 1,
            borderColor: '#2A253D',
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(30, 144, 255，0.5)'
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
        // {
        //   name: '处理情况',
        //   type: 'pie',
        //   radius: [0, '40%'],
        //   center: ['27%', '45%'],
        //   color: ['#4aa5e3', '#f15b1e',],
        //   itemStyle: {
        //     normal: {
        //       // 设置扇形的阴影
        //       shadowBlur: 30,
        //       shadowColor: 'rgba(0,0,0,0.96)',
        //       shadowOffsetX: -5,
        //       shadowOffsetY: 5,
        //     }
        //   },
        //   label: {
        //     normal: {
        //       textStyle: {
        //         fontSize: 11,
        //       },
        //       position: 'inner',
        //       formatter: '{b}' + '\n' + '{c}个',
        //     },
        //   },
        //   labelLine: {
        //     normal: {
        //       show: false
        //     }
        //   },
        //   data: data ,
        // },
      ]
    };

    courserate.setOption(option, true);
  };

  //摄像头在线情况统计
  var dashbxoard_chart_camera_pie = function (data) {

    let courserate = echarts.init(document.getElementById('dashboard-chart-camera-pie'));
    let option = {
      series: [
        {
          name: '监控在线情况',
          type: 'pie',
          radius: ['30%', '45%'],
          center: ['50%', '22%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: '#000000',
            borderWidth: 0.5
          },
          color: ['#00ecbd', '#ea588b', '#ff8d72'],

          labelLine: {
            show: false
          },
          label: {
            show: false
          },
          data: data,
        }
      ]
    };

    courserate.setOption(option, true);
  };

  //督察问题总览地图
  var dashboard_chart_map = function (datas) {
    function getData(data) {
      let problemMap = []
      for (let obj in data) {
        problemMap.push({name: obj, value: data[obj]})
      }
      return problemMap
    }

    let map_location_name = current_location_name;
    let map_chart = echarts.init(document.getElementById('dashboard-chart-map'));
    let map_chart_option = {
      tooltip: {
        backgroundColor: '',
        textStyle: {color: "#fff"},
        formatter: '{b}-发现问题：{c}个'
      },
      title: {
        textStyle: {color: "#1E90FF"},
        text: map_location_name + '督察问题总览图',
        left: 'center',
        y: -5
      },
      visualMap: { //视觉映射组件
        type: "piecewise",
        show: true,
        min: 0,
        max: 5, // 侧边滑动的最大值，从数据中获取
        left: '3%',
        top: '80%',
        textStyle: {color: '#fff'},
        inverse: false, //是否反转 visualMap 组件
        // itemHeight:200,  //图形的高度，即长条的高度
        // text: ['高', '低'], // 文本，默认为数值文本
        calculable: true, //是否显示拖拽用的手柄（手柄能拖拽调整选中范围）
        // seriesIndex: 1, //指定取哪个系列的数据，即哪个系列的 series.data,默认取所有系列
        // orient: "horizontal",
        //range:[4, 4],    //指定手柄对应数值的位置。range 应在 min max 范围内
        pieces: [
          // 自定义『分段式视觉映射组件（visualMapPiecewise）』的每一段的范围，以及每一段的文字，以及每一段的特别的样式
          { gt: 4, lte: 99999, label: ">=5个问题",color: "#ef0d0d" },
          { gt: 2, lte: 4, label: "3-4个问题", color: "#fa8e0e" },
          { gt: 0, lte: 2, label: "1-2个问题", color: "#bebc26" },
          { value:0, label: "未发现问题", color: "#08b8fd" }
        ],
        // inRange: {
        //   color: ['#1d8cf8', '#ffcb72', '#ff8d72', '#f10101'],
        // },
      },
      series: [
        {
          type: 'map',
          map: map_location_name,
          roam: false,  //拖动放大
          layoutCenter: ['50%', '50%'],
          y: 60,
          mapLocation: {
            y: 60
          },
          itemStyle: {
            normal: {
              borderWidth: 0.5,
              borderColor: 'white',
              areaColor: '#303564',
            },
            // normal: {
            //   borderWidth: 2,
            //   borderColor: '#343434',
            //   areaColor: '#565656',
            // },
            emphasis: {
              label: {show: true, fontSize: 12, fontWeight: 'bold', color: '#fff'},
              // borderWidth: 2,
              borderColor: '#EDE7FD',
              areaColor:'',//设置为空字符串可使颜色不变
              // areaColor: 'rgba(255,11,11,0.5)',
            }
          },
          label: {
            normal: {
              formatter: '{b} {c}',
              position: 'right',
              textStyle: {fontSize: 10, color: 'rgb(255,255,255)'},
              show: true
            }
          },
          zoom: 1.1,//放大比例
          data: getData(datas.data1),
        },

      ],
    };

    map_chart.on("mouseover", function (params){
        map_chart.dispatchAction({
          type: 'downplay'
        });
      // }
    });

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
    // $.get('/admin/json/' + map_location_name + '.json', function (yCjson) {
    //   echarts.registerMap(map_location_name, yCjson);
    //   map_chart.setOption(map_chart_option);
    // });

    let map_modal_time = 'day'

    $(document).on('click', '.home-map-tab-button', function () {
      map_modal_time = $(this).data('map-tag')
      if ($(this).data('map-tag') == 'day') {
        map_chart_option.series[0].data = getData(datas.data1)
        map_chart_option.visualMap.pieces = [
          { gt: 4, lte: 99999, label: ">=5个问题",color: "#ef0d0d" },
          { gt: 2, lte: 4, label: "3-4个问题", color: "#fa8e0e" },
          { gt: 0, lte: 2, label: "1-2个问题", color: "#bebc26" },
          { gt: -1, lte: 0, label: "未发现问题", color: "#08b8fd" }
        ]
      } else if ($(this).data('map-tag') == 'week') {
        map_chart_option.series[0].data = getData(datas.data2)
        map_chart_option.visualMap.pieces = [
          { gt: 20, lte: 99999, label: ">20个问题", color: "#ef0d0d" },
          { gt: 10, lte: 20, label: "11-20个问题", color: "#fa8e0e" },
          { gt: 2, lte: 10, label: "3-10个问题", color: "#bebc26" },
          { gt: -1, lte: 2, label: "0-2个问题", color: "#08b8fd" },
          // { value:0, color: "#08b8fd" },
        ]
      } else if ($(this).data('map-tag') == 'month') {
        map_chart_option.series[0].data = getData(datas.data3)
        map_chart_option.visualMap.pieces = [
          { gt: 60, lte: 99999, label: ">60个问题", color: "#ef0d0d" },
          { gt: 30, lte: 60, label: "31-60个问题", color: "#fa8e0e" },
          { gt: 5, lte: 30, label: "6-30个问题", color: "#bebc26" },
          { gt: -1, lte: 5, label: "0-5个问题", color: "#08b8fd" },
        ]
      }
      map_chart.clear();
      map_chart.setOption(map_chart_option);
    })

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

  //每日抓图情况实时汇总
  var dashbxoard_chart_capture_line = function (data) {


    let xArr = []
    let yArr = []

    for (let obj in data) {
      xArr.push(obj)
      yArr.push(data[obj])
    }


    let courserate = echarts.init(document.getElementById('dashboard-chart-capture-line'));
    if(yArr[0] != 2401325){
      courserate.clear();
    }
    let option = {
      grid: {
        top: '7%',
        left: '2%',
        right: '10%',
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
          type: 'category',
          boundaryGap: false,
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(87,255,213,0.2)',
            }
          },
          axisLabel: {//坐标轴刻度设置
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
          data: xArr
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
            color: 'white',
            fontSize: '10',
            margin: 20//刻度标签与轴线之间的距离。
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(98,11,255,0)'
            }
          },
          type: 'value'
        }
      ],

      series:
        {
          name: '巡查情况统计',
          type: 'line',
          smooth: 0.15,
          barWidth: 20,//柱图宽度
          symbol: 'circle',     //折点设定为实心点
          symbolSize: 8,   //设定实心点的大小
          itemStyle: {
            normal: {
              lineStyle: {
                width: 2//设置线条粗细
              },

              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(140,255,129,0.71)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgb(134,255,161)'// 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }

            }
          },
          label: {
            formatter: '{c}',
            show: true, //开启显示
            position: 'top',
            textStyle: { //数值样式
              color: 'rgba(67,255,90,0.71)',
              fontSize: 12,
              fontWeight: 600
            }
          },
          data: yArr,
          markLine: {
            itemStyle: {
              normal: {
                lineStyle:
                  {
                    type: 'dotted',
                    color: 'rgba(86,255,108,0.71)',

                  },
                label:
                  {
                    show: true,
                    formatter: '{b}' + '\n' + '{c}',
                    textStyle: { //数值样式
                      color: 'rgba(109,255,86,0.71)',
                      fontSize: 8,
                      fontWeight: 600
                    }
                  }
              }
            },
            data: [{type: 'average', name: '平均值'}]
          }
        }
    }

    courserate.setOption(option, true);
  };

  //督察预警准确率分析
  var dashbxoard_chart_alert_pie = function (data) {
    let courserate = echarts.init(document.getElementById('dashboard-chart-alert-pie'));
    let option = {
      series: [
        {
          name: '预警准确率',
          type: 'pie',
          radius: ['30%', '45%'],
          center: ['50%', '22%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: '#000000',
            borderWidth: 0.5
          },
          color: ['#00ecbd', '#ea588b'],

          labelLine: {
            show: false
          },
          label: {
            show: false
          },
          data: data,
        }
      ]
    };

    courserate.setOption(option, true);
  };

  //地区问题统计
  var dashbxoard_chart_region_statistics_bar = function (datas) {

    function getData(data) {
      let problemMap = []
      for (let obj in data) {
        problemMap.push({name: obj, value: data[obj]})
      }
      return problemMap
    }

    let courserate = echarts.init(document.getElementById('dashboard-chart-region-statistics-bar'));
    let option = {
      grid: {
        top: '7%',
        left: '2%',
        right: '5%',
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
          type: 'category',
          boundaryGap: false,
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(9,86,255,0.2)',
            }
          },
          axisLabel: {//坐标轴刻度设置
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
          data: getData(datas.data1).map((item) => {
            return item.name
          }),
        }
      ],
      yAxis: [
        {
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(9,86,255,0.2)',
            }
          },
          splitArea: {show: false},
          axisLabel: {//坐标轴刻度设置
            color: 'white',
            fontSize: '10',
            margin: 30//刻度标签与轴线之间的距离。
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(98,11,255,0)'
            }
          },
          type: 'value'
        }
      ],

      series:
        {
          name: '地区问题统计',
          type: 'bar',
          smooth: 0.1,
          barWidth: 20,//柱图宽度
          symbol: 'circle',     //折点设定为实心点
          symbolSize: 8,   //设定实心点的大小
          itemStyle: {
            normal: {
              lineStyle: {
                width: 2//设置线条粗细
              },

              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(14,97,255,0.71)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(15,211,255,0.85)'// 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }

            }
          },
          label: {
            formatter: '{c}',
            show: true, //开启显示
            position: 'top',
            textStyle: { //数值样式
              color: 'rgba(22,104,255,0.71)',
              fontSize: 12,
              fontWeight: 600
            }
          },
          data: getData(datas.data1).map((item) => {
            return item.value
          }),
          markLine: {
            itemStyle: {
              normal: {
                lineStyle:
                  {
                    type: 'dotted',
                    color: 'rgba(13,143,255,0.71)',

                  },
                label:
                  {
                    show: true,
                    formatter: '{b}' + '\n' + '{c}',
                    textStyle: { //数值样式
                      color: 'rgba(11,164,255,0.71)',
                      fontSize: 8,
                      fontWeight: 600
                    }
                  }
              }
            },

            data: [
              {type: 'average', name: '平均值'},]
          }
        }

    };

    courserate.setOption(option, true);

    $(document).on('click', '.home-division-bar-tab-button', function () {

      if ($(this).data('division-tag') == 'day') {
        option.xAxis[0].data = getData(datas.data1).map((item) => {
          return item.name
        })
        option.series.data = getData(datas.data1).map((item) => {
          return item.value
        })
      } else if ($(this).data('division-tag') == 'week') {
        option.xAxis[0].data = getData(datas.data2).map((item) => {
          return item.name
        })
        option.series.data = getData(datas.data2).map((item) => {
          return item.value
        })
      } else if ($(this).data('division-tag') == 'month') {
        option.xAxis[0].data = getData(datas.data3).map((item) => {
          return item.name
        })
        option.series.data = getData(datas.data3).map((item) => {
          return item.value
        })
      }

      courserate.clear();
      courserate.setOption(option);
    })

  };

  //问题流量统计
  var courserate = {}
  var dashbxoard_chart_flow_statistics_line = function (data) {

    let xArr = []
    let yArr = []

    for (let obj in data) {
      xArr.push(obj)
      yArr.push(data[obj])
    }

    courserate = echarts.init(document.getElementById('dashboard-chart-flow-statistics-line'));
    let option = {
      grid: {
        top: '10%',
        left: '2%',
        right: '5%',
        bottom: '0%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: 'rgb(178,86,209)'
          }
        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,20,253,0.2)',
            }
          },
          axisLabel: {//坐标轴刻度设置
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
          data: xArr,
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
            color: 'white',
            fontSize: '10',
            margin: 20//刻度标签与轴线之间的距离。
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(98,11,255,0)'
            }
          },
          type: 'value'
        }
      ],
      series:
        {
          name: '增长流量统计',
          type: 'line',
          smooth: 0.15,
          barWidth: 20,//柱图宽度
          symbol: 'circle',     //折点设定为实心点
          symbolSize: 10,   //设定实心点的大小
          itemStyle: {
            normal: {
              lineStyle: {
                width: 2//设置线条粗细
              },
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(248,0,255,0.71)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(223,137,255,0.85)'// 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
          label: {
            formatter: '{c}',
            show: true, //开启显示
            position: 'top',
            textStyle: { //数值样式
              color: 'rgba(255,0,242,0.71)',
              fontSize: 12,
              fontWeight: 600
            }
          },
          data: yArr,
          markLine: {
            itemStyle: {
              normal: {
                lineStyle:
                  {
                    type: 'dotted',
                    color: 'rgba(231,52,255,0.71)',

                  },
                label:
                  {
                    show: true,
                    formatter: '{b}' + '\n' + '{c}',
                    textStyle: { //数值样式
                      color: 'rgba(255,47,218,0.71)',
                      fontSize: 8,
                      fontWeight: 600
                    }
                  }
              }
            },
            data: [{type: 'average', name: '平均值'},]
          }
        }

    };

    courserate.setOption(option, true);
  };


  //问题分析饼图获取数据并渲染
  // fetch_data(
  //   '/admin/problems',
  //   {
  //     count_period: 'week',
  //     last: 1,
  //     count_period_field: 'issued_at',
  //   },
  //   dashboard_chart_problem_analysis_pie
  // );


  //每日抓图情况实时汇总-数据接入
  $.ajax({
    url: "/admin/dashboard/simulate_data",
    success: function (result) {
      dashbxoard_chart_capture_line(result.data)
    }
  });
  fetch_data(
    '/admin/camera_captures',
    {
      count_period: 'day',
      count_period_last: 7,
      count_period_field: 'created_at',
    },
    dashbxoard_chart_capture_line
  );



  //摄像头在线情况统计-数据接入
  $.ajax({
    url: "/admin/cameras/stats_cameras_group_status",
    success: function (result) {
      let cametaStatus = []
      for (let obj in result) {
        cametaStatus.push({name: obj, value: result[obj]})
      }
      dashbxoard_chart_camera_pie(cametaStatus)

    }
  });

  //摄像头在线情况统计-数据接入
  $.ajax({
    url: "/admin/location_events/stats_location_events_group_status",
    success: function (result) {
      let alertStatus = []
      for (let obj in result) {
        alertStatus.push({name: obj, value: result[obj]})
      }
      dashbxoard_chart_alert_pie(alertStatus)
    }
  });

  //问题处理情况统计-数据接入
  $.ajax({
    url: "/admin/problems/stats_problem_group_type",
    success: function (result) {
      let problemStatus = []
      for (let obj in result.data) {
        problemStatus.push({name: obj, value: result.data[obj]})
      }
      dashboard_chart_problem_analysis_pie1(problemStatus)
    }
  });

  //问题流量统计-数据接入
  fetch_data(
    '/admin/problems',
    {
      count_period: 'day',
      count_period_last: 12,
      count_period_field: 'issued_at',
    },
    dashbxoard_chart_flow_statistics_line
  );

  $(document).on('click', '.home-problem-line-tab-button', function () {

    if ($(this).data('problem-tag') == 'day') {
      courserate.clear()
      fetch_data(
        '/admin/problems',
        {
          count_period: 'day',
          count_period_last: 12,
          count_period_field: 'issued_at',
        },
        dashbxoard_chart_flow_statistics_line
      );
    } else if ($(this).data('problem-tag') == 'week') {
      courserate.clear()
      fetch_data(
        '/admin/problems',
        {
          count_period: 'week',
          count_period_last: 12,
          count_period_field: 'issued_at',
        },
        dashbxoard_chart_flow_statistics_line
      );
    } else if ($(this).data('problem-tag') == 'month') {
      courserate.clear()
      fetch_data(
        '/admin/problems',
        {
          count_period: 'month',
          count_period_last: 12,
          count_period_field: 'issued_at',
        },
        dashbxoard_chart_flow_statistics_line
      );
    }

  })


  //地区问题数量统计-数据接入
  $.ajax({
    url: "/admin/problems/stats_problem_group_division",
    success: function (result) {
      dashbxoard_chart_region_statistics_bar(result)
    }
  });

  //督察问题总览图-数据接入
  $.ajax({
    url: "/admin/problems/stats_problem_group_division",
    success: function (result) {
      // let lastResult = {}
      // for(let obj1 in result){
      //   let fastResult = {}
      //   for(let obj2 in result[obj1]){
      //     fastResult[obj2.replace('派出所','')] = result[obj1][obj2]
      //   }
      //   lastResult[obj1] = fastResult
      // }
      dashboard_chart_map(result)
    }
  });

  $.ajax({
    url: "/admin/dashboard/system_overview_table",
    success: function (result) {
      $('#home-system-overview-container').html(result)
    }
  });

  //右侧三个按钮
  $(document).on("click", ".layout-report-generate-button", function () {
    let from_date = $('#layout_report_query_from_date').val()
    let to_date = $('#layout_report_query_to_date').val()
    if ( from_date != '' && to_date != '' && from_date < to_date){
      // $('.layout-report-text-container').html('时间范围符合要求')
      $.ajax({
        url: "/admin/problems/layout_report?from_date=" + from_date + '&to_date=' + to_date,
        success: function (result) {
          let info_element = ''
          result.info.filter((ele)=>{
            info_element = info_element + '<div style="text-indent:30px;margin-top: 5px; font-weight: 500; font-size: 16px">' + ele +'</div>'

          })
          console.log(info_element)
          $('.layout-report-text-container').html(
            '<div class="text-center text-success" style="font-size: 26px">' + '督察情况分析' +'</div>' +
            '<div class="text-success" style="font-size: 19px; text-indent:38px; margin-bottom: 10px; font-weight: 500">' + result.data +'</div>' +
            info_element
          )
        }
      });
    } else {
      $('.layout-report-text-container').html('请输入合理的时间范围')
    }
  });

});
