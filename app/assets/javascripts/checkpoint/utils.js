$(document).ready(function () {
  var body = $('body');
  window.controller_name = body.data('controller-name');
  window.action_name = body.data('action-name');
  window.current_location_name = body.data('current-location-name');
  window.current_location_level_index = body.data('current-location-level-index');
});