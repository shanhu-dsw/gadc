$(document).ready(function () {
    if (controller_name === 'problems' && action_name === 'show') {

        $(document).on('click', '.problem-notification-push-btn', function () {
            var modal = $('#problem-push-modal');
            if (modal.length)
                modal.remove();

            $.ajax({
                url: '/admin/notifications/push?problem_id=' + String($(this).data('resource-id')),
                method: 'get',
                success: function (result) {
                    $('body').append(result);
                    modal = $('#problem-push-modal');
                    modal.modal('show');
                }
            });
        })
    }

    if (controller_name === 'problems' && action_name === 'report') {

        $('.problem-report-wizard').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',

            onNext: function (tab, navigation, index) {
                var params = {
                    query_problem_category_id: $('#query_problem_category_id').val(),
                    query_from_date: $('#query_from_date').val(),
                    query_to_date: $('#query_to_date').val(),
                    query_problem_status: $('#query_problem_status').val(),
                    query_report_type: $('input[name="query_report_type"]:checked').val(),
                }

                if (params.query_problem_status.length === 0 || params.query_problem_status[0].length === 0) {
                    params.query_problem_status = ["waiting", "correcting", "corrected", "negated", "reviewing"]
                }

                if (index === 1) {
                    $.ajax({
                        type: 'GET',
                        url: '/admin/problems/report_problems',
                        data: params,
                        success: function (result) {
                            $('#report-problems').html(result);
                        }
                    })
                } else if (index === 3) {
                    if (params.query_report_type != 4) {
                        window.open('/admin/problems/report_generation_' + params.query_report_type + '.docx?query_from_date=' + params.query_from_date + '&query_to_date=' + params.query_to_date + '&query_problem_status_arr=' + params.query_problem_status + '&query_problem_category_id=' + params.query_problem_category_id)
                    } else {
                        window.open('/admin/problems/report_generation_' + params.query_report_type + '.xlsx?query_from_date=' + params.query_from_date + '&query_to_date=' + params.query_to_date + '&query_problem_status_arr=' + params.query_problem_status + '&query_problem_category_id=' + params.query_problem_category_id)
                    }
                }
            },
            onInit: function (tab, navigation, index) {
                //check number of tabs and fill the entire row
                var $total = navigation.find('li').length;
                $width = 100 / $total;

                navigation.find('li').css('width', $width + '%');
            },

            onTabChange: function (tab, navigation, index) {

                if (index === 0) {
                    if ($('#query_from_date').val() === '' || $('#query_to_date').val() === '') {
                        Swal.fire({
                            title: '出错了',
                            text: '请选择开始时间和结束时间～',
                            type: 'error',
                            timer: 5000,
                            confirmButtonText: '好的',
                            customClass: {
                                confirmButton: 'btn btn-info'
                            },
                            buttonsStyling: false
                        });
                        return false;
                    }
                }

                return true
            },

            onTabShow: function (tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index + 1;

                var $wizard = navigation.closest('.card-wizard');

                // If it's the last tab then hide the last button and show the finish instead
                if ($current >= $total) {
                    $($wizard).find('.btn-next').hide();
                    $($wizard).find('.btn-finish').show();
                } else {
                    $($wizard).find('.btn-next').show();
                    $($wizard).find('.btn-finish').hide();
                }

                //update progress
                var move_distance = 100 / $total;
                move_distance = move_distance * (index) + move_distance / 2;
                move_distance = $current === 4 ? 100 : move_distance
                $wizard.find($('.progress-bar')).css({
                    width: move_distance + '%'
                });
                //e.relatedTarget // previous tab

                $wizard.find($('.card-wizard .nav-pills li .nav-link.active')).addClass('checked');
            }
        });

        // $(document).on("click", "#report_type_4", function () {
        //   window.open('/admin/problems/report_generation_4.xlsx?' + window.location.search, "_blank")
        // });
    }

    var problems = [];

    function display_problem_notification() {
        if (problems.length === 0) return

        var problem = problems[0];
        var message_text = '智慧督察在';
        var path = problem.location.path;

        var authorized = false;

        for (var i = 0; i < path.length; i++) {
            if (i > current_location_level_index)
                message_text = message_text + path[i].name;
            authorized = authorized || path[i].id === current_location_id;
        }

        if (!authorized) display_problem_notification();

        message_text = message_text + '确认了';

        if (problem.problem_category)
            message_text = message_text + location_event.problem_category.name;

        message_text = message_text + '问题';

        let utterance = new SpeechSynthesisUtterance();

        utterance.text = message_text;
        utterance.lang = 'zh-CN';
        speechSynthesis.speak(utterance);

        $.notify({
            icon: "tim-icons icon-bell-55",
            message: message_text,
            url: '/admin/problems/' + problem.id
        }, {
            type: 'danger',
            timer: 1000,
            placement: {
                from: 'top',
                align: 'right'
            },
            onClosed: function () {
                display_problem_notification();
            }
        });
    }

    App.cable.subscriptions.create({channel: "ProblemChannel"}, {
        received: function (data) {
            problems.push(data);
            if (problems.length === 1) display_problem_notification();
        }
    });


    if (controller_name === 'problems' && action_name === 'edit') {
        //创建问题弹窗
        let evidence_img_id = null
        let problem_id = null
        var modal = $('#change-evidence-time-modal');
        $(document).on('click', '.change-evidence-time-modal-button', function () {
            evidence_img_id = $(this).data('evidence-img-id')
            problem_id = $(this).data('problem-id')
            modal.modal('show');
        });

        $(document).on('click', '.change-evidence-time-modal-submit', function () {
            if ($('#change-evidence-time-data').val()) {

                $.ajax({
                    url: "/admin/problems/change_evidence_time?evidence_id=" + evidence_img_id + '&evidence_time=' + $('#change-evidence-time-data').val() + '&problem_id=' + problem_id,
                    success: function (result) {
                        $('#data-evidence-' + evidence_img_id).html($('#change-evidence-time-data').val())
                        modal.modal('hide');
                    }
                });


            } else {
                alert('提交错误，请选择开始时间！')
            }

        });


    }


    $(document).on('change', '#query_location_category_ids', function () {
        var id = $(this).attr('id');


        $.ajax({
            url: "/admin/location_categories?query_parent=" + $(this).val() + '&page_size=999',
            dataType: 'json',
            success: function (result) {
                var options = [{text: '请选择', id: ''}];
                for (var i = 0; i < result.data.data.length; i++) {
                    options.push({text: result.data.data[i].name, id: result.data.data[i].id})
                }

                $('#query_location_category_id').select2('destroy').empty().select2({
                    data: options
                });
            }
        });
    })

    function getLocationCategorys() {
        let location_category_id = $('#query_location_category_ids').val()
        if (location_category_id) {
            $.ajax({
                url: "/admin/location_categories?query_parent=" + location_category_id + '&page_size=999',
                dataType: 'json',
                success: function (result) {
                    var options = [{text: '请选择', id: ''}];
                    for (var i = 0; i < result.data.data.length; i++) {
                        options.push({text: result.data.data[i].name, id: result.data.data[i].id})
                    }

                    $('#query_location_category_id').select2('destroy').empty().select2({
                        data: options
                    });
                }
            });
        }
    }

    getLocationCategorys()

    //临时测试，用于改善返回不刷新问题
    window.onpageshow = function (event) {
        if (event.persisted) {
            window.location.reload();
        }
    }

})