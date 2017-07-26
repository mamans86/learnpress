;(function ($, Vue, data) {
    Vue.component('lp-course-editor', {
        template: '#tmpl-lp-course-editor',
        data: function () {
            return data;
        }
    });

    Vue.component('lp-curriculum', {
        template: '#tmpl-lp-course-curriculum',
        props: ['sections']
    });

    Vue.component('lp-list-sections', {
        template: '#tmpl-lp-list-sections',
        props: ['sections'],
        methods: {
            clickNewSection: function () {
                this.sections.push({
                    course_id: data.course_id,
                    title: '',
                    description: '',
                    items: [],
                    id: -1
                });
            }
        }
    });

    Vue.component('lp-section', {
        template: '#tmpl-lp-section',
        props: ['section', 'order'],
        data: function () {
            return {
                isOpen: true
            };
        },
        methods: {
            toggle: function () {
                this.isOpen = !this.isOpen;
            }
        },
        computed: {
            encode: function () {
                var data = this.section || {};
                data.order = this.order;

                return JSON.stringify(data);
            }
        }
    });

    Vue.component('lp-section-item', {
        template: '#tmpl-lp-section-item',
        props: ['item']
    });

    $(document).ready(function () {
        window.LP_Course_Editor = new Vue({
            el: '#course-editor-v2',
            template: '<lp-course-editor></lp-course-editor>'
        });
    });
})(jQuery, window.Vue, lq_course_editor);