$(document).ready(function () {

  if (controller_name === 'location_categories') {

    $(document).on('click', '.btn-secondary', function () {
      var modal = $('#create-location-modal');
      modal.modal('hide');
    })

    $(document).on('click', '.btn-secondary', function () {
      var modal = $('#edit-problem-category-modal');
      modal.modal('hide');
    })
  }

  if (controller_name === 'location_categories' && action_name === 'index') {
    $(document).on('click', '.upload-problem_categories-modal-button', function () {
      var modal = $('#upload-problem_categories-modal');
      modal.modal('show');
      $(document).find('select.select2').not('.select2-hidden-accessible').select2();
    })
  }


  if (controller_name === 'location_categories' && action_name === 'index') {

    $(document).on('click', '.create-location-modal-button', function () {
      var modal = $('#create-location-modal');
      modal.modal('show');
    })

    function fetchTreeNode(id, target) {
      $.ajax({
        url: '/admin/location_categories/tree?category_id=' + String(id),
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
      $('#location_category_parent_id').val(tree_node.data('id'));
    })

    $(document).on('click', '.tree-node-edit', function () {
      var tree_node = $(this).closest('.tree-node');
      console.log(tree_node.data('id'))
      $.ajax({
        url: '/admin/location_categories/edit_modal/' + String(tree_node.data('id')),
        method: 'get',
        success: function (result) {
          $('#edit-location-category-modal-container').html(result);
          var modal = $('#edit-location-category-modal');
          modal.modal('show');
          $(document).find('select.select2').not('.select2-hidden-accessible').select2();
        }
      });
    })

    $(document).on('ajax:success', '.form-location', function (e, data, status, xhr) {
      Swal.fire({
        title: '????????????',
        text: '??????????????????!',
        type: 'success',
        timer: 600,
        confirmButtonText: '??????',
        customClass: {
          confirmButton: 'btn btn-success'
        },
        buttonsStyling: false
      });
    });

    $(document).on('ajax:error', '.form-resource', function (e, data, status, xhr) {

      Swal.fire({
        title: '?????????',
        text: e.originalEvent.detail[0].data,
        type: 'error',
        timer: 5000,
        confirmButtonText: '??????',
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