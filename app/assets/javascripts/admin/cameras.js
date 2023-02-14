$(document).ready(function () {
  if (controller_name === 'cameras' && action_name === 'index') {
    $(document).on('click', '.upload-cameras-modal-button', function () {
      var modal = $('#upload-cameras-modal');
      modal.modal('show');
    })

    $(document).on('click', '.download-cameras-modal-button', function () {
      window.open('/admin/cameras/camera_download_excel.xlsx' + window.location.search, "_blank")
    })

  }

  if (controller_name === 'cameras' && action_name === 'show') {
    var initEventCameraDraw = null;

    $(document).on('click', '.edit-event-camera-modal-button', function () {
      var modal = $('#edit-event-camera-modal');
      if (modal.length)
        modal.remove();

      $.ajax({
        url: '/admin/event_cameras/' + String($(this).data('resource-id')) + '/edit',
        method: 'get',
        success: function (result) {
          $('body').append(result);
          modal = $('#edit-event-camera-modal');
          modal.modal('show');
          modal.on('shown.bs.modal', function (e) {
            initEventCameraDraw(modal)
          })
        }
      });
    })

    var shapes, shape_labels;
    var width, height, stage, layer;

    initEventCameraDraw = function () {
      shapes = {
        '#event_camera_box_a': null, '#event_camera_box_b': null, '#event_camera_box_c': null,
        '#event_camera_box_d': null, '#event_camera_line_a': null, '#event_camera_line_b': null
      };

      shape_labels = {
        '#event_camera_box_a': null, '#event_camera_box_b': null, '#event_camera_box_c': null,
        '#event_camera_box_d': null, '#event_camera_line_a': null, '#event_camera_line_b': null
      };

      width = $('#camera-position-container').width();
      height = width * 0.5625;

      stage = new Konva.Stage({
        container: 'camera-position-container',
        width: width,
        height: height
      });

      // Adding a Layer
      layer = new Konva.Layer();
      stage.add(layer);

      var tr = new Konva.Transformer({
        boundBoxFunc: function (oldBoundBox, newBoundBox) {
          if (Math.abs(newBoundBox.width) > width || Math.abs(newBoundBox.height) > height) {
            return oldBoundBox;
          }
          return newBoundBox;
        },
      });

      layer.add(tr);

      var shape_keys = Object.keys(shapes);

      for (var i = 0; i < shape_keys.length; i++) {
        var shape_key = shape_keys[i];
        var values = $(shape_key).val();

        if (values) {
          var points = values.split(',');
          var x1 = parseFloat(points[0]) * width, y1 = parseFloat(points[1]) * height,
            x2 = parseFloat(points[2]) * width, y2 = parseFloat(points[3]) * height;

          initShape(shape_key, x1, y1, x2, y2);
        }
      }

      stage.on('click', function (e) {

        if (e.target === stage) {
          tr.nodes([]);
          layer.draw();
          return;
        }

        if (e.target.attrs.shape_type === 'line') {
          tr.nodes([e.target]);
        } else if (e.target.attrs.shape_type === 'rect') {
          tr.nodes([e.target]);
        }

        layer.draw();
      });

    }


    function initShape(shape_key, x1, y1, x2, y2) {
      var shape;

      if (shape_key.includes('box')) {
        shape = new Konva.Rect({
          x: x1,
          y: y1,
          width: x2 - x1,
          height: y2 - y1,
          draggable: true,
          dragBoundFunc: function (pos) {
            var pos_start = this.absolutePosition();
            var pos_end = getTransformedEndPoint(this);
            return {
              x: Math.max(0, Math.min(pos.x, width - Math.abs(pos_end.x - pos_start.x))),
              y: Math.max(0, Math.min(pos.y, height - Math.abs(pos_end.y - pos_start.y))),
            };
          },
          shape_type: 'rect',
          stroke: '#e55353',
          strokeWidth: 3,
          strokeScaleEnabled: false,
        });
      } else if (shape_key.includes('line')) {
        shape = new Konva.Line({
          x: x1,
          y: y1,
          points: [0, 0, x2 - x1, y2 - y1],
          draggable: true,
          dragBoundFunc: function (pos) {
            var pos_start = this.absolutePosition();
            var pos_end = getTransformedEndPoint(this);

            return {
              x: Math.max(0, Math.min(pos.x, width - Math.abs(pos_end.x - pos_start.x))),
              y: Math.max(0, Math.min(pos.y, height - Math.abs(pos_end.y - pos_start.y))),
            };
          },
          shape_type: 'line',
          stroke: '#f9b115',
          strokeWidth: 3,
          strokeScaleEnabled: false,
        });
      }

      var text = new Konva.Text({
        x: (x1 + x2) / 2 - 20,
        y: (y1 + y2) / 2 - 25,
        text: shape_key.slice(-1).toUpperCase(),
        fontSize: 60,
        fill: shape_key.includes('box') ? '#e55353' : '#f9b115',
      });

      shape.on('dragmove', function (e) {
        var pos_start = e.target.absolutePosition();

        if (e.target.attrs.points) {
          pos_start.x = pos_start.x + e.target.attrs.points[0];
          pos_start.y = pos_start.y + e.target.attrs.points[1];
        }

        var pos_end = getTransformedEndPoint(e.target);
        saveShape(shape_key, pos_start, pos_end);
        var text = shape_labels[shape_key];
        text.x((pos_end.x + pos_start.x) / 2 - 20);
        text.y((pos_end.y + pos_start.y) / 2 - 25);
      });

      shape.on('transform', function (e) {
        var pos_start = e.target.absolutePosition();
        var pos_end = getTransformedEndPoint(e.target);
        saveShape(shape_key, pos_start, pos_end);
        var text = shape_labels[shape_key];
        text.x((pos_end.x + pos_start.x) / 2 - 20);
        text.y((pos_end.y + pos_start.y) / 2 - 25);
      });

      shapes[shape_key] = shape;
      shape_labels[shape_key] = text;

      layer.add(text);
      layer.add(shape);
      layer.draw();
    }

    function saveShape(shape_key, pos_start, pos_end) {
      $(shape_key).val([pos_start.x / width, pos_start.y / height, pos_end.x / width, pos_end.y / height]);
    }

    function getTransformedEndPoint(target) {
      if (target.attrs.points) {
        return target.getAbsoluteTransform().point({
          x: target.attrs.points[2] - target.attrs.points[0],
          y: target.attrs.points[3] - target.attrs.points[1]
        });
      } else {
        return target.getAbsoluteTransform().point({x: target.attrs.width, y: target.attrs.height});
      }
    }

    $(document).on('click', '.btn-box-camera-position, .btn-line-camera-position', function () {
      var shape_key = $(this).data('target');
      var shape = shapes[shape_key];
      var text = shape_labels[shape_key];

      if (shape) {
        shape.destroy();
        text.destroy();
        shapes[shape_key] = null;
        shape_labels[shape_key] = null;
        layer.draw();
        $(shape_key).val('');
      } else {
        initShape(shape_key, 0, 0, 0.4 * width, 0.4 * height);
      }
    })
  }

  if (controller_name === 'cameras' && action_name === 'new') {
    $('#camera_location_division_id').on('change', function () {
      $.ajax({
        url: "/admin/locations/location_children/" + $('#camera_location_division_id').val(), success: function (result) {

          let data = result.map(function (a) {
            return {text: a.name, id: a.id}
          });

          $('#camera_location_id').select2('destroy').empty().select2({
            data: data
          });

          if (data.length > 0) {
            $('#camera_location_id').val(data[0].id).change();
          }

        }
      });
    });
  }

})