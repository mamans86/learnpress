
        var $ = jQuery;
        var $doc = $(document);
        var $win = $(window);

        var makePaymentsSortable = function makePaymentsSortable() {
          // Make payments sortable
          $('.learn-press-payments.sortable tbody').sortable({
            handle: '.dashicons-menu',
            helper: function helper(e, ui) {
              ui.children().each(function () {
                $(this).width($(this).width());
              });
              return ui;
            },
            axis: 'y',
            start: function start(event, ui) {},
            stop: function stop(event, ui) {},
            update: function update(event, ui) {
              var order = $(this).children().map(function () {
                return $(this).find('input[name="payment-order"]').val();
              }).get();
              $.post({
                url: '',
                data: {
                  'lp-ajax': 'update-payment-order',
                  order: order
                },
                success: function success(response) {}
              });
            }
          });
        };

        var initTooltips = function initTooltips() {
          $('.learn-press-tooltip').each(function () {
            var $el = $(this),
                args = $.extend({
                  title: 'data-tooltip',
                  offset: 10,
                  gravity: 's'
                }, $el.data());
            $el.tipsy(args);
          });
        };

        var initSelect2 = function initSelect2() {
          if ($.fn.select2) {
            $('.lp-select-2 select').select2();
          }
        };

        var initSingleCoursePermalink = function initSingleCoursePermalink() {
          $doc.on('change', '.learn-press-single-course-permalink input[type="radio"]', function () {
            var $check = $(this),
                $row = $check.closest('.learn-press-single-course-permalink');

            if ($row.hasClass('custom-base')) {
              $row.find('input[type="text"]').prop('readonly', false);
            } else {
              $row.siblings('.custom-base').find('input[type="text"]').prop('readonly', true);
            }
          }).on('change', 'input.learn-press-course-base', function () {
            $('#course_permalink_structure').val($(this).val());
          }).on('focus', '#course_permalink_structure', function () {
            $('#learn_press_custom_permalink').click();
          }).on('change', '#learn_press_courses_page_id', function () {
            $('tr.learn-press-courses-page-id').toggleClass('hide-if-js', !parseInt(this.value));
          });
        };

        var togglePaymentStatus = function togglePaymentStatus(e) {
          e.preventDefault();
          var $row = $(this).closest('tr'),
              $button = $(this),
              status = $row.find('.status').hasClass('enabled') ? 'no' : 'yes';
          $.ajax({
            url: '',
            data: {
              'lp-ajax': 'update-payment-status',
              status: status,
              id: $row.data('payment')
            },
            success: function success(response) {
              response = LP.parseJSON(response);

              for (var i in response) {
                $('#payment-' + i + ' .status').toggleClass('enabled', response[i]);
              }
            }
          });
        };

        var updateEmailStatus = function updateEmailStatus() {
          (function () {
            $.post({
              url: window.location.href,
              data: {
                'lp-ajax': 'update_email_status',
                status: $(this).parent().hasClass('enabled') ? 'no' : 'yes',
                id: $(this).data('id')
              },
              dataType: 'text',
              success: $.proxy(function (res) {
                res = LP.parseJSON(res);

                for (var i in res) {
                  $('#email-' + i + ' .status').toggleClass('enabled', res[i]);
                }
              }, this)
            });
          }).apply(this);
        };

        var toggleSalePriceSchedule = function toggleSalePriceSchedule() {
          var $el = $(this),
              id = $el.attr('id');

          if (id === '_lp_sale_price_schedule') {
            $(this).hide();
            $('#field-_lp_sale_start, #field-_lp_sale_end').removeClass('hide-if-js');
            $win.trigger('resize.calculate-tab');
          } else {
            $('#_lp_sale_price_schedule').show();
            $('#field-_lp_sale_start, #field-_lp_sale_end').addClass('hide-if-js').find('#_lp_sale_start, #_lp_sale_end').val('');
            $win.trigger('resize.calculate-tab');
          }

          return false;
        };

        var callbackFilterTemplates = function callbackFilterTemplates() {
          var $link = $(this);

          if ($link.hasClass('current')) {
            return false;
          }

          var $templatesList = $('#learn-press-template-files'),
              $templates = $templatesList.find('tr[data-template]'),
              template = $link.data('template'),
              filter = $link.data('filter');
          $link.addClass('current').siblings('a').removeClass('current');

          if (!template) {
            if (!filter) {
              $templates.removeClass('hide-if-js');
            } else {
              $templates.map(function () {
                $(this).toggleClass('hide-if-js', $(this).data('filter-' + filter) !== 'yes');
              });
            }
          } else {
            $templates.map(function () {
              $(this).toggleClass('hide-if-js', $(this).data('template') !== template);
            });
          }

          $('#learn-press-no-templates').toggleClass('hide-if-js', !!$templatesList.find('tr.template-row:not(.hide-if-js):first').length);
          return false;
        };

        var toggleEmails = function toggleEmails(e) {
          e.preventDefault();
          var $button = $(this),
              status = $button.data('status');
          $.ajax({
            url: '',
            data: {
              'lp-ajax': 'update_email_status',
              status: status
            },
            success: function success(response) {
              response = LP.parseJSON(response);

              for (var i in response) {
                $('#email-' + i + ' .status').toggleClass('enabled', response[i]);
              }
            }
          });
        };

        var duplicatePost = function duplicatePost(e) {
          e.preventDefault();

          var _self = $(this),
              _id = _self.data('post-id');

          $.ajax({
            url: '',
            data: {
              'lp-ajax': 'duplicator',
              id: _id
            },
            success: function success(response) {
              response = LP.parseJSON(response);

              if (response.success) {
                window.location.href = response.data;
              } else {
                alert(response.data);
              }
            }
          });
        };

        var importCourses = function importCourses() {
          var $container = $('#learn-press-install-sample-data-notice'),
              action = $(this).attr('data-action');

          if (!action) {
            return;
          }

          e.preventDefault();

          if (action === 'yes') {
            $container.find('.install-sample-data-notice').slideUp().siblings('.install-sample-data-loading').slideDown();
          } else {
            $container.fadeOut();
          }

          $.ajax({
            url: ajaxurl,
            dataType: 'html',
            type: 'post',
            data: {
              action: 'learnpress_install_sample_data',
              yes: action
            },
            success: function success(response) {
              response = LP.parseJSON(response);

              if (response.url) {
                $.ajax({
                  url: response.url,
                  success: function success() {
                    $container.find('.install-sample-data-notice').html(response.message).slideDown().siblings('.install-sample-data-loading').slideUp();
                  }
                });
              } else {
                $container.find('.install-sample-data-notice').html(response.message).slideDown().siblings('.install-sample-data-loading').slideUp();
              }
            }
          });
        };

        var onChangeCoursePrices = function onChangeCoursePrices(e) {
          var _self = $(this),
              _price = $('#_lp_price'),
              _sale_price = $('#_lp_sale_price'),
              _target = $(e.target).attr('id');

          _self.find('#field-_lp_price div, #field-_lp_sale_price div').remove('.learn-press-tip-floating');

          if (parseInt(_sale_price.val()) >= parseInt(_price.val())) {
            if (_target === '_lp_price') {
              _price.parent('.rwmb-input').append('<div class="learn-press-tip-floating">' + lpAdminCourseEditorSettings.i18n.notice_price + '</div>');
            } else if (_target === '_lp_sale_price') {
              _sale_price.parent('.rwmb-input').append('<div class="learn-press-tip-floating">' + lpAdminCourseEditorSettings.i18n.notice_sale_price + '</div>');
            }
          }
        };

        var onChangeSaleStartDate = function onChangeSaleStartDate(e) {
          var _sale_start_date = $(this),
              _sale_end_date = $('#_lp_sale_end'),
              _start_date = Date.parse(_sale_start_date.val()),
              _end_date = Date.parse(_sale_end_date.val()),
              _parent_start = _sale_start_date.parent('.rwmb-input'),
              _parent_end = _sale_end_date.parent('.rwmb-input');

          if (!_start_date) {
            _parent_start.append('<div class="learn-press-tip-floating">' + lpAdminCourseEditorSettings.i18n.notice_invalid_date + '</div>');
          }

          $('#field-_lp_sale_start div, #field-_lp_sale_end div').remove('.learn-press-tip-floating');

          if (_start_date > _end_date) {
            _parent_start.append('<div class="learn-press-tip-floating">' + lpAdminCourseEditorSettings.i18n.notice_sale_start_date + '</div>');
          }
        };

        var onChangeSaleEndDate = function onChangeSaleEndDate(e) {
          var _sale_end_date = $(this),
              _sale_start_date = $('#_lp_sale_start'),
              _start_date = Date.parse(_sale_start_date.val()),
              _end_date = Date.parse(_sale_end_date.val()),
              _parent_start = _sale_start_date.parent('.rwmb-input'),
              _parent_end = _sale_end_date.parent('.rwmb-input');

          if (!_end_date) {
            _parent_end.append('<div class="learn-press-tip-floating">' + lpAdminCourseEditorSettings.i18n.notice_invalid_date + '</div>');
          }

          $('#field-_lp_sale_start div, #field-_lp_sale_end div').remove('.learn-press-tip-floating');

          if (_start_date > _end_date) {
            _parent_end.append('<div class="learn-press-tip-floating">' + lpAdminCourseEditorSettings.i18n.notice_sale_end_date + '</div>');
          }
        };

        var onReady = function onReady() {
          makePaymentsSortable();
          initSelect2();
          initTooltips();
          initSingleCoursePermalink();
          $('.learn-press-tabs').LP('AdminTab');
          $(document).on('click', '.learn-press-payments .status .dashicons', togglePaymentStatus).on('click', '.change-email-status', updateEmailStatus).on('click', '#_lp_sale_price_schedule', toggleSalePriceSchedule).on('click', '#_lp_sale_price_schedule_cancel', toggleSalePriceSchedule).on('click', '.learn-press-filter-template', callbackFilterTemplates).on('click', '#learn-press-enable-emails, #learn-press-disable-emails', toggleEmails).on('click', '.lp-duplicate-row-action .lp-duplicate-post', duplicatePost).on('click', '#learn-press-install-sample-data-notice a', importCourses).on('input', '#meta-box-tab-course_payment', onChangeCoursePrices).on('change', '#_lp_sale_start', onChangeSaleStartDate).on('change', '#_lp_sale_end', onChangeSaleEndDate);
        };

        $(document).ready(onReady);



        // (function ($) {
        //   $.fn.LP_Chart_Line = function (data, config) {
        //     return $.each(this, function () {
        //       var $elem = $(this),
        //           $canvas = $('<canvas />');
        //       $elem.html('');
        //       $canvas.appendTo($elem);
        //       new Chart($canvas.get(0).getContext('2d')).Line(data, config);
        //     }); //
        //   };
        //
        //   $.fn.LP_Statistic_Users = function () {
        //     if (parseInt($(this).length) === 0) {
        //       return;
        //     }
        //
        //     return $.each(this, function () {
        //       var $buttons = $('.chart-buttons button').on('click', function () {
        //             var $button = $(this),
        //                 type = $button.data('type'),
        //                 from = '',
        //                 to = '',
        //                 $container = $('#learn-press-chart');
        //             $buttons.not(this).not('[data-type="user-custom-time"]').prop('disabled', false);
        //
        //             if (type == 'user-custom-time') {
        //               from = $('input[name="from"]').val();
        //               to = $('input[name="to"]').val();
        //
        //               if (from == '' || to == '') {
        //                 return false;
        //               }
        //             } else {
        //               $button.prop('disabled', true);
        //             }
        //
        //             $container.addClass('loading');
        //             $.ajax({
        //               url: 'admin-ajax.php',
        //               data: {
        //                 action: 'learnpress_load_chart',
        //                 type: type,
        //                 range: [from, to]
        //               },
        //               dataType: 'text',
        //               success: function success(response) {
        //                 response = LP.parseJSON(response);
        //                 $container.LP_Chart_Line(response, LP_Chart_Config);
        //                 $container.removeClass('loading');
        //               }
        //             });
        //             return false;
        //           }),
        //           $inputs = $('.chart-buttons #user-custom-time input[type="text"]').change(function () {
        //             var _valid_date = function _valid_date() {
        //               if (new Date($inputs[0].value) < new Date($inputs[1].value)) {
        //                 return true;
        //               }
        //             };
        //
        //             $buttons.filter('[data-type="user-custom-time"]').prop('disabled', $inputs.filter(function () {
        //               return this.value == '';
        //             }).get().length || !_valid_date());
        //           });
        //     });
        //   };
        //
        //   $.fn.LP_Statistic_Courses = function () {
        //     if (parseInt($(this).length) === 0) {
        //       return;
        //     }
        //
        //     return $.each(this, function () {
        //       var $buttons = $('.chart-buttons button').on('click', function () {
        //             var $button = $(this),
        //                 type = $button.data('type'),
        //                 from = '',
        //                 to = '',
        //                 $container = $('#learn-press-chart');
        //             $buttons.not(this).not('[data-type="course-custom-time"]').prop('disabled', false);
        //
        //             if (type == 'course-custom-time') {
        //               from = $('#course-custom-time input[name="from"]').val();
        //               to = $('#course-custom-time input[name="to"]').val();
        //
        //               if (from == '' || to == '') {
        //                 return false;
        //               }
        //             } else {
        //               $button.prop('disabled', true);
        //             }
        //
        //             $container.addClass('loading');
        //             $.ajax({
        //               url: 'admin-ajax.php',
        //               data: {
        //                 action: 'learnpress_load_chart',
        //                 type: type,
        //                 range: [from, to]
        //               },
        //               dataType: 'text',
        //               success: function success(response) {
        //                 response = LP.parseJSON(response);
        //                 $container.LP_Chart_Line(response, LP_Chart_Config);
        //                 $container.removeClass('loading');
        //               }
        //             });
        //             return false;
        //           }),
        //           $inputs = $('.chart-buttons #course-custom-time input[type="text"]').change(function () {
        //             var _valid_date = function _valid_date() {
        //               if (new Date($inputs[0].value) < new Date($inputs[1].value)) {
        //                 return true;
        //               }
        //             };
        //
        //             $buttons.filter('[data-type="course-custom-time"]').prop('disabled', $inputs.filter(function () {
        //               return this.value == '';
        //             }).get().length || !_valid_date());
        //           });
        //     });
        //   };
        //
        //   $.fn.LP_Statistic_Orders = function () {
        //     if (parseInt($(this).length) === 0) {
        //       return;
        //     }
        //
        //     $('.panel_report_option').hide();
        //     $('#panel_report_sales_by_' + $('#report_sales_by').val()).show();
        //     $('#report_sales_by').on('change', function () {
        //       $('.panel_report_option').hide();
        //       $('#panel_report_sales_by_' + $(this).val()).show();
        //
        //       if ('date' == $(this).val()) {
        //         LP_Statistic_Orders_Upgrade_Chart();
        //       }
        //     });
        //     /**
        //      * Upgrade Chart for Order Statistics
        //      * @returns {Boolean}
        //      */
        //
        //     var LP_Statistic_Orders_Upgrade_Chart = function LP_Statistic_Orders_Upgrade_Chart() {
        //       var type = '',
        //           from = '',
        //           to = '',
        //           report_sales_by = 'date',
        //           cat_id = 0,
        //           course_id = 0;
        //       report_sales_by = $('#report_sales_by').val();
        //       $container = $('#learn-press-chart');
        //       $container.addClass('loading'); // get type
        //
        //       var $buttons = $('.chart-buttons button:disabled').not('[data-type="order-custom-time"]');
        //
        //       if (parseInt($buttons.length) > 0) {
        //         type = $($buttons[0]).data('type');
        //       } else {
        //         type = 'order-custom-time';
        //         from = $('#order-custom-time input[name="from"]').val();
        //         to = $('#order-custom-time input[name="to"]').val();
        //
        //         if (from == '' || to == '') {
        //           return false;
        //         }
        //       }
        //
        //       if ('course' === report_sales_by) {
        //         course_id = $('#report-by-course-id').val();
        //       } else if ('category' === report_sales_by) {
        //         cat_id = $('#report-by-course-category-id').val();
        //       }
        //
        //       $.ajax({
        //         url: 'admin-ajax.php',
        //         data: {
        //           action: 'learnpress_load_chart',
        //           type: type,
        //           range: [from, to],
        //           report_sales_by: report_sales_by,
        //           course_id: course_id,
        //           cat_id: cat_id
        //         },
        //         dataType: 'text',
        //         success: function success(response) {
        //           response = LP.parseJSON(response);
        //           $container.LP_Chart_Line(response, LP_Chart_Config);
        //           $container.removeClass('loading');
        //         }
        //       });
        //     };
        //
        //     $('#report-by-course-id').select2({
        //       placeholder: 'Select a course',
        //       minimumInputLength: 1,
        //       ajax: {
        //         url: ajaxurl + '?action=learnpress_search_course',
        //         dataType: 'json',
        //         quietMillis: 250,
        //         data: function data(term, page) {
        //           return {
        //             q: term // search term
        //
        //           };
        //         },
        //         results: function results(data, page) {
        //           return {
        //             results: data.items
        //           };
        //         },
        //         cache: true
        //       }
        //     });
        //     $('#report-by-course-id').on('change', function () {
        //       LP_Statistic_Orders_Upgrade_Chart();
        //     });
        //     $('#report-by-course-category-id').select2({
        //       placeholder: 'Select a course',
        //       minimumInputLength: 1,
        //       ajax: {
        //         url: ajaxurl + '?action=learnpress_search_course_category',
        //         dataType: 'json',
        //         quietMillis: 250,
        //         data: function data(term, page) {
        //           return {
        //             q: term // search term
        //
        //           };
        //         },
        //         results: function results(data, page) {
        //           return {
        //             results: data.items
        //           };
        //         },
        //         cache: true
        //       }
        //     });
        //     $('#report-by-course-category-id').on('change', function () {
        //       LP_Statistic_Orders_Upgrade_Chart();
        //     });
        //     var $buttons = $('.chart-buttons button').on('click', function () {
        //       var $button = $(this),
        //           type = $button.data('type'),
        //           from = '',
        //           to = '',
        //           $container = $('#learn-press-chart');
        //       $buttons.not(this).not('[data-type="order-custom-time"]').prop('disabled', false);
        //
        //       if (type !== 'order-custom-time') {
        //         $button.prop('disabled', true);
        //         $('#order-custom-time input[name="from"]').val('');
        //         $('#order-custom-time input[name="to"]').val('');
        //       }
        //
        //       LP_Statistic_Orders_Upgrade_Chart();
        //       return false;
        //     });
        //     var $inputs = $('.chart-buttons #order-custom-time input[type="text"]').change(function () {
        //       var _valid_date = function _valid_date() {
        //         if (new Date($inputs[0].value) < new Date($inputs[1].value)) {
        //           return true;
        //         }
        //       };
        //
        //       $buttons.filter('[data-type="order-custom-time"]').prop('disabled', $inputs.filter(function () {
        //         return this.value == '';
        //       }).get().length || !_valid_date());
        //     });
        //   };
        //
        //   $(document).ready(function () {
        //
        //     $('.learn-press-statistic-users').LP_Statistic_Users();
        //     $('.learn-press-statistic-courses').LP_Statistic_Courses();
        //     $('.learn-press-statistic-orders').LP_Statistic_Orders();
        //   });
        //   return;
        //   var student_chart;
        //
        //   window.drawStudentsChart = drawStudentsChart = function drawStudentsChart(data, config) {
        //     var $student_chart = $("#lpr-chart-students").clone().attr('style', '').removeAttr("width").removeAttr('height');
        //     $("#lpr-chart-students").replaceWith($student_chart);
        //     $student_chart = $student_chart[0].getContext("2d");
        //     student_chart = new Chart($student_chart).Line(data, config);
        //   };
        //
        //   if (typeof last_seven_days == 'undefined') return;
        //   drawStudentsChart(last_seven_days, config);
        //   var courses_chart;
        //
        //   window.drawCoursesChart = drawCoursesChart = function drawCoursesChart(data, config) {
        //     var $courses_chart = $("#lpr-chart-courses").clone().attr('style', '').removeAttr("width").removeAttr('height');
        //     $("#lpr-chart-courses").replaceWith($courses_chart);
        //     $courses_chart = $courses_chart[0].getContext("2d");
        //     courses_chart = new Chart($courses_chart).Bar(data, config);
        //   };
        //
        //   if (typeof data == 'undefined') return;
        //   drawCoursesChart(data, config);
        // })(jQuery);



        (function ($) {
          var Sync_Base = {
            id: 'sync-base',
            syncing: false,
            items: false,
            completed: false,
            callback: null,
            methodGetItems: '',
            itemsKey: '',
            chunkSize: 50,
            sync: function sync(callback) {
              if (this.syncing) {
                return;
              }

              this.callback = callback;

              if (this.items === false) {
                this.get_items();
              } else {
                if (!this.dispatch()) {
                  this.completed = true;
                  this.callToCallback();
                  return;
                }
              }

              this.syncing = true;
            },
            init: function init() {
              this.syncing = false;
              this.items = false;
              this.completed = false;
            },
            is_completed: function is_completed() {
              return this.completed;
            },
            dispatch: function dispatch() {
              var that = this,
                  items = this.items ? this.items.splice(0, this.chunkSize) : false;

              if (!items || items.length === 0) {
                return false;
              }

              $.ajax({
                url: '',
                data: {
                  'lp-ajax': this.id,
                  sync: items
                },
                method: 'post',
                success: function success(response) {
                  response = LP.parseJSON(response);
                  that.syncing = false;

                  if (response.result !== 'success') {
                    that.completed = true;
                  }

                  that.callToCallback();

                  if (that.is_completed()) {
                    return;
                  }

                  that.sync(that.callback);
                }
              });
              return true;
            },
            callToCallback: function callToCallback() {
              this.callback && this.callback.call(this);
            },
            get_items: function get_items() {
              var that = this;
              $.ajax({
                url: '',
                data: {
                  'lp-ajax': this.id,
                  sync: this.methodGetItems
                },
                success: function success(response) {
                  that.syncing = false;
                  response = LP.parseJSON(response);

                  if (response[that.itemsKey]) {
                    that.items = response[that.itemsKey];
                    that.sync(that.callback);
                  } else {
                    that.completed = true;
                    that.items = [];
                    that.callToCallback();
                  }
                }
              });
            }
          };
          var Sync_Course_Orders = $.extend({}, Sync_Base, {
            id: 'sync-course-orders',
            methodGetItems: 'get-courses',
            itemsKey: 'courses'
          });
          var Sync_User_Courses = $.extend({}, Sync_Base, {
            id: 'sync-user-courses',
            methodGetItems: 'get-users',
            itemsKey: 'users',
            chunkSize: 500
          });
          var Sync_User_Orders = $.extend({}, Sync_Base, {
            id: 'sync-user-orders',
            methodGetItems: 'get-users',
            itemsKey: 'users',
            chunkSize: 500
          });
          var Sync_Course_Final_Quiz = $.extend({}, Sync_Base, {
            id: 'sync-course-final-quiz',
            methodGetItems: 'get-courses',
            itemsKey: 'courses',
            chunkSize: 500
          });
          var Sync_Remove_Older_Data = $.extend({}, Sync_Base, {
            id: 'sync-remove-older-data',
            methodGetItems: 'remove-older-data',
            itemsKey: '_nothing_here',
            chunkSize: 500
          });
          var Sync_Calculate_Course_Results = $.extend({}, Sync_Base, {
            id: 'sync-calculate-course-results',
            methodGetItems: 'get-users',
            itemsKey: 'users',
            chunkSize: 1
          });
          window.LP_Sync_Data = {
            syncs: [],
            syncing: 0,
            options: {},
            start: function start(options) {
              this.syncs = [];
              this.options = $.extend({
                onInit: function onInit() {},
                onStart: function onStart() {},
                onCompleted: function onCompleted() {},
                onCompletedAll: function onCompletedAll() {}
              }, options || {});

              if (!this.get_syncs()) {
                return;
              }

              this.reset();
              this.options.onInit.call(this);

              var that = this,
                  syncing = 0,
                  totalSyncs = this.syncs.length,
                  syncCallback = function syncCallback($sync) {
                    if ($sync.is_completed()) {
                      syncing++;
                      that.options.onCompleted.call(that, $sync);

                      if (syncing >= totalSyncs) {
                        that.options.onCompletedAll.call(that);
                        return;
                      }

                      that.sync(syncing, syncCallback);
                    }
                  };

              this.sync(syncing, syncCallback);
            },
            reset: function reset() {
              for (var sync in this.syncs) {
                try {
                  this[this.syncs[sync]].init();
                } catch (e) {}
              }
            },
            sync: function sync(_sync, callback) {
              var that = this,
                  $sync = this[this.syncs[_sync]];
              that.options.onStart.call(that, $sync);
              $sync.sync(function () {
                callback.call(that, $sync);
              });
            },
            get_syncs: function get_syncs() {
              var syncs = $('input[name^="lp-repair"]:checked').serializeJSON()['lp-repair'];

              if (!syncs) {
                return false;
              }

              for (var sync in syncs) {
                if (syncs[sync] !== 'yes') {
                  continue;
                }

                sync = sync.replace(/[-]+/g, '_');

                if (!this[sync]) {
                  continue;
                }

                this.syncs.push(sync);
              }

              return this.syncs;
            },
            get_sync: function get_sync(id) {
              id = id.replace(/[-]+/g, '_');
              return this[id];
            },
            sync_course_orders: Sync_Course_Orders,
            sync_user_orders: Sync_User_Orders,
            sync_user_courses: Sync_User_Courses,
            sync_course_final_quiz: Sync_Course_Final_Quiz,
            sync_remove_older_data: Sync_Remove_Older_Data,
            sync_calculate_course_results: Sync_Calculate_Course_Results
          };
          $(document).ready(function () {
            function initSyncs() {
              var $chkAll = $('#learn-press-check-all-syncs'),
                  $chks = $('#learn-press-syncs').find('[name^="lp-repair"]');
              $chkAll.on('click', function () {
                $chks.prop('checked', this.checked);
              });
              $chks.on('click', function () {
                $chkAll.prop('checked', $chks.filter(':checked').length === $chks.length);
              });
            }

            initSyncs();
          }).on('click', '.lp-button-repair', function () {
            function getInput(sync) {
              return $('ul#learn-press-syncs').find('input[name*="' + sync + '"]');
            }

            LP_Sync_Data.start({
              onInit: function onInit() {
                $('ul#learn-press-syncs').children().removeClass('syncing synced');
                $('.lp-button-repair').prop('disabled', true);
              },
              onStart: function onStart($sync) {
                getInput($sync.id).closest('li').addClass('syncing');
              },
              onCompleted: function onCompleted($sync) {
                getInput($sync.id).closest('li').removeClass('syncing').addClass('synced');
              },
              onCompletedAll: function onCompletedAll() {
                $('ul#learn-press-syncs').children().removeClass('syncing synced');
                $('.lp-button-repair').prop('disabled', false);
              }
            });
          });
        })(jQuery);

        (function ($) {
          var $doc = $(document),
              isRunning = false;

          var installSampleCourse = function installSampleCourse(e) {
            e.preventDefault();
            var $button = $(this);

            if (isRunning) {
              return;
            }

            if (!confirm(lpGlobalSettings.i18n.confirm_install_sample_data)) {
              return;
            }

            $button.addClass('disabled').html($button.data('installing-text'));
            $('.lp-install-sample-data-response').remove();
            isRunning = true;
            $.ajax({
              url: $button.attr('href'),
              data: $('.lp-install-sample-data-options').serializeJSON(),
              success: function success(response) {
                $button.removeClass('disabled').html($button.data('text'));
                isRunning = false;
                $(response).insertBefore($button.parent());
              },
              error: function error() {
                $button.removeClass('disabled').html($button.data('text'));
                isRunning = false;
              }
            });
          };

          var uninstallSampleCourse = function uninstallSampleCourse(e) {
            e.preventDefault();
            var $button = $(this);

            if (isRunning) {
              return;
            }

            if (!confirm(lpGlobalSettings.i18n.confirm_uninstall_sample_data)) {
              return;
            }

            $button.addClass('disabled').html($button.data('uninstalling-text'));
            isRunning = true;
            $.ajax({
              url: $button.attr('href'),
              success: function success(response) {
                $button.removeClass('disabled').html($button.data('text'));
                isRunning = false;
              },
              error: function error() {
                $button.removeClass('disabled').html($button.data('text'));
                isRunning = false;
              }
            });
          };

          var clearHardCache = function clearHardCache(e) {
            e.preventDefault();
            var $button = $(this);

            if ($button.hasClass('disabled')) {
              return;
            }

            $button.addClass('disabled').html($button.data('cleaning-text'));
            $.ajax({
              url: $button.attr('href'),
              data: {},
              success: function success(response) {
                $button.removeClass('disabled').html($button.data('text'));
              },
              error: function error() {
                $button.removeClass('disabled').html($button.data('text'));
              }
            });
          };

          var toggleHardCache = function toggleHardCache() {
            $.ajax({
              url: 'admin.php?page=lp-toggle-hard-cache-option',
              data: {
                v: this.checked ? 'yes' : 'no'
              },
              success: function success(response) {},
              error: function error() {}
            });
          };

          var toggleOptions = function toggleOptions(e) {
            e.preventDefault();
            $('.lp-install-sample-data-options').toggleClass('hide-if-js');
          };

          $doc.on('click', '#learn-press-install-sample-data', installSampleCourse).on('click', '#learn-press-uninstall-sample-data', uninstallSampleCourse).on('click', '#learn-press-clear-cache', clearHardCache).on('click', 'input[name="enable_hard_cache"]', toggleHardCache).on('click', '#learn-press-install-sample-data-options', toggleOptions);
        })(jQuery);
