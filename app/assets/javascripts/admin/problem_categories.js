$(document).ready(function () {

  if (controller_name === 'problem_categories') {

    $(document).on('click', '.btn-secondary', function () {
      var modal = $('#create-location-modal');
      modal.modal('hide');
    })

    $(document).on('click', '.btn-secondary', function () {
      var modal = $('#edit-problem-category-modal');
      modal.modal('hide');
    })
  }

  if (controller_name === 'problem_categories' && action_name === 'index') {
    $(document).on('click', '.upload-problem_categories-modal-button', function () {
      var modal = $('#upload-problem_categories-modal');
      modal.modal('show');
      $(document).find('select.select2').not('.select2-hidden-accessible').select2();
    })
  }

  $(document).on('change', '#problem_category_0, #problem_category_1, #problem_category_2', function () {
    var id = $(this).attr('id');
    var id_array = id.split('_');
    var id_index = parseInt(id_array[id_array.length - 1]);
    id_array[id_array.length - 1] = String(id_index + 1);
    var next_id = id_index >= 2 ? '#problem_problem_category_id, #event_problem_category_id' : '#' + id_array.join('_');

    $.ajax({
      url: "/admin/problem_categories?query_parent_id=" + $(this).val() + '&page_size=20',
      dataType: 'json',
      success: function (result) {
        var options = [{text: '请选择', id: ''}];
        for (var i = 0; i < result.data.data.length; i++) {
          options.push({text: result.data.data[i].name, id: result.data.data[i].id})
        }
        $(next_id).select2('destroy').empty().select2({
          data: options
        });
      }
    });
  })

  if (controller_name === 'problem_categories' && action_name === 'index') {

    $(document).on('click', '.create-location-modal-button', function () {
      var modal = $('#create-location-modal');
      modal.modal('show');
    })

    function fetchTreeNode(id, target) {
      $.ajax({
        url: '/admin/problem_categories/tree?category_id=' + String(id),
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
      $('#problem_category_parent_id').val(tree_node.data('id'));
    })

    $(document).on('click', '.tree-node-edit', function () {
      var tree_node = $(this).closest('.tree-node');
      $.ajax({
        url: '/admin/problem_categories/edit_modal/' + String(tree_node.data('id')),
        method: 'get',
        success: function (result) {
          $('#edit-problem-category-modal-container').html(result);
          var modal = $('#edit-problem-category-modal');
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

})