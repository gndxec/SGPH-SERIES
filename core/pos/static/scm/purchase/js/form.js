var tblProducts, tblSearchProducts, tblSeries;
var current_date;
var fvPurchase, fvProvider, fvSerie;
var select_provider, select_paymentcondition;
var input_datejoined, input_endcredit, input_searchproducts, inputCredit, input_serie;

var purchase = {
    details: {
        products: [],
    },
    index: -1,
    calculate_invoice: function () {
        $.each(this.details.products, function (i, item) {
            item.cant = item.series.length;
            item.subtotal = item.cant * parseFloat(item.price);
        });
    },
    list_products: function () {
        this.calculate_invoice();
        tblProducts = $('#tblProducts').DataTable({
            //responsive: true,
            //autoWidth: false,
            destroy: true,
            data: this.details.products,
            ordering: false,
            lengthChange: false,
            searching: false,
            paginate: false,
            scrollX: true,
            scrollCollapse: true,
            columns: [
                {data: "id"},
                {data: "name"},
                {data: "category.name"},
                {data: "cant"},
                {data: "price"},
                {data: "subtotal"},
            ],
            columnDefs: [
                {
                    targets: [-3],
                    class: 'text-center',
                    render: function (data, type, row) {
                        var cant = row.series.length;
                        return '<a class="btn btn-success btn-xs btn-flat" rel="series"><i class="fas fa-barcode"></i> ' + cant + '</a>';
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    render: function (data, type, row) {
                        return '$' + parseFloat(data).toFixed(2);
                    }
                },
                {
                    targets: [-2],
                    class: 'text-center',
                    render: function (data, type, row) {
                        return '$' + parseFloat(data).toFixed(2);
                    }
                },
                {
                    targets: [0],
                    class: 'text-center',
                    render: function (data, type, row) {
                        return '<a rel="remove" class="btn btn-danger btn-flat btn-xs"><i class="fas fa-times"></i></a>';
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                var tr = $(row).closest('tr');
                tr.find('input[name="cant"]')
                    .TouchSpin({
                        min: 1,
                        max: 10000000,
                        verticalbuttons: true,
                    })
                    .keypress(function (e) {
                        return validate_form_text('numbers', e, null);
                    });
            },
            initComplete: function (settings, json) {
                $("[data-toggle='tooltip']").tooltip();
            },
        });
    },
    get_products_ids: function () {
        return this.details.products.map(value => value.id);
    },
    add_product: function (item) {
        this.details.products.push(item);
        this.list_products();
    },
    list_series: function (index) {
        var series = purchase.details.products[index].series.map(function (value, index, array) {
            return {'index': index, 'serie': value};
        });
        tblSeries = $('#tblSeries').DataTable({
            responsive: true,
            autoWidth: false,
            destroy: true,
            data: series,
            columns: [
                {data: "index"},
                {data: "serie"},
            ],
            ordering: false,
            lengthChange: false,
            searching: false,
            paginate: false,
            info: false,
            columnDefs: [
                {
                    targets: [0],
                    class: 'text-center',
                    render: function (data, type, row) {
                        return '<a rel="remove" class="btn btn-danger btn-flat btn-xs"><i class="fa fa-trash"></i></a>';
                    }
                },
            ],
            rowCallback: function (row, data, index) {

            },
            initComplete: function (settings, json) {

            },
        });
    },
    get_series: function () {
        var series = [];
        purchase.details.products.filter(value => value.series.length > 0).forEach(function (value, index, array) {
            var item = value.series.map(v => v);
            series = [...series, ...item];
        });
        return series;
    }
};

document.addEventListener('DOMContentLoaded', function (e) {
    const frmProvider = document.getElementById('frmProvider');
    fvProvider = FormValidation.formValidation(frmProvider, {
            locale: 'es_ES',
            localization: FormValidation.locales.es_ES,
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                submitButton: new FormValidation.plugins.SubmitButton(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
                icon: new FormValidation.plugins.Icon({
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh',
                }),
            },
            fields: {
                name: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 2,
                        },
                        remote: {
                            url: pathname,
                            data: function () {
                                return {
                                    obj: frmProvider.querySelector('[name="name"]').value,
                                    type: 'name',
                                    action: 'validate_provider'
                                };
                            },
                            message: 'El nombre ya se encuentra registrado',
                            method: 'POST',
                            headers: {
                                'X-CSRFToken': csrftoken
                            },
                        }
                    }
                },
                ruc: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 13
                        },
                        digits: {},
                        remote: {
                            url: pathname,
                            data: function () {
                                return {
                                    obj: frmProvider.querySelector('[name="ruc"]').value,
                                    type: 'ruc',
                                    action: 'validate_provider'
                                };
                            },
                            message: 'El número de ruc ya se encuentra registrado',
                            method: 'POST',
                            headers: {
                                'X-CSRFToken': csrftoken
                            },
                        }
                    }
                },
                mobile: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 10
                        },
                        digits: {},
                        remote: {
                            url: pathname,
                            data: function () {
                                return {
                                    obj: frmProvider.querySelector('[name="mobile"]').value,
                                    type: 'mobile',
                                    action: 'validate_provider'
                                };
                            },
                            message: 'El número de teléfono ya se encuentra registrado',
                            method: 'POST',
                            headers: {
                                'X-CSRFToken': csrftoken
                            },
                        }
                    }
                },
                email: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 5
                        },
                        regexp: {
                            regexp: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i,
                            message: 'El formato email no es correcto'
                        },
                        remote: {
                            url: pathname,
                            data: function () {
                                return {
                                    obj: frmProvider.querySelector('[name="email"]').value,
                                    type: 'email',
                                    action: 'validate_provider'
                                };
                            },
                            message: 'El email ya se encuentra registrado',
                            method: 'POST',
                            headers: {
                                'X-CSRFToken': csrftoken
                            },
                        }
                    }
                },
                address: {
                    validators: {
                        // stringLength: {
                        //     min: 4,
                        // }
                    }
                }
            },
        }
    )
        .on('core.element.validated', function (e) {
            if (e.valid) {
                const groupEle = FormValidation.utils.closest(e.element, '.form-group');
                if (groupEle) {
                    FormValidation.utils.classSet(groupEle, {
                        'has-success': false,
                    });
                }
                FormValidation.utils.classSet(e.element, {
                    'is-valid': false,
                });
            }
            const iconPlugin = fvProvider.getPlugin('icon');
            const iconElement = iconPlugin && iconPlugin.icons.has(e.element) ? iconPlugin.icons.get(e.element) : null;
            iconElement && (iconElement.style.display = 'none');
        })
        .on('core.validator.validated', function (e) {
            if (!e.result.valid) {
                const messages = [].slice.call(frmProvider.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
                messages.forEach((messageEle) => {
                    const validator = messageEle.getAttribute('data-validator');
                    messageEle.style.display = validator === e.validator ? 'block' : 'none';
                });
            }
        })
        .on('core.form.valid', function () {
            var parameters = {};
            $.each($(fvProvider.form).serializeArray(), function (key, item) {
                parameters[item.name] = item.value;
            });
            parameters['action'] = 'create_provider';
            submit_with_ajax('Notificación', '¿Estas seguro de realizar la siguiente acción?', pathname,
                parameters,
                function (request) {
                    var newOption = new Option(request.name + ' / ' + request.ruc, request.id, false, true);
                    select_provider.append(newOption).trigger('change');
                    fvPurchase.revalidateField('provider');
                    $('#myModalProvider').modal('hide');
                }
            );
        });
});

document.addEventListener('DOMContentLoaded', function (e) {
    const form = document.getElementById('frmSeries');
    fvSerie = FormValidation.formValidation(form, {
            locale: 'es_ES',
            localization: FormValidation.locales.es_ES,
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                submitButton: new FormValidation.plugins.SubmitButton(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
                icon: new FormValidation.plugins.Icon({
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh',
                }),
            },
            fields: {
                serie: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 2,
                        },
                        remote: {
                            url: pathname,
                            data: function () {
                                return {
                                    pk: form.querySelector('[name="serie"]').value,
                                    series: JSON.stringify(purchase.get_series()),
                                    action: 'validate_serie'
                                };
                            },
                            message: 'La serie ya se encuentra registrada',
                            method: 'POST',
                            headers: {
                                'X-CSRFToken': csrftoken
                            },
                        }
                    }
                },
            },
        }
    )
        .on('core.element.validated', function (e) {
            if (e.valid) {
                const groupEle = FormValidation.utils.closest(e.element, '.form-group');
                if (groupEle) {
                    FormValidation.utils.classSet(groupEle, {
                        'has-success': false,
                    });
                }
                FormValidation.utils.classSet(e.element, {
                    'is-valid': false,
                });
            }
            const iconPlugin = fvSerie.getPlugin('icon');
            const iconElement = iconPlugin && iconPlugin.icons.has(e.element) ? iconPlugin.icons.get(e.element) : null;
            iconElement && (iconElement.style.display = 'none');
        })
        .on('core.validator.validated', function (e) {
            if (!e.result.valid) {
                const messages = [].slice.call(form.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
                messages.forEach((messageEle) => {
                    const validator = messageEle.getAttribute('data-validator');
                    messageEle.style.display = validator === e.validator ? 'block' : 'none';
                });
            }
        })
        .on('core.form.valid', function () {
            var serie = input_serie.val();
            purchase.details.products[purchase.index].series.push(serie);
            fvSerie.resetForm(true);
            input_serie.val('').focus();
            purchase.list_series(purchase.index);
        });
});

document.addEventListener('DOMContentLoaded', function (e) {
    const frmPurchase = document.getElementById('frmPurchase');
    fvPurchase = FormValidation.formValidation(frmPurchase, {
            locale: 'es_ES',
            localization: FormValidation.locales.es_ES,
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                submitButton: new FormValidation.plugins.SubmitButton(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
                excluded: new FormValidation.plugins.Excluded(),
                icon: new FormValidation.plugins.Icon({
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh',
                }),
            },
            fields: {
                payment_condition: {
                    validators: {
                        notEmpty: {
                            message: 'Seleccione una forma de pago'
                        },
                    }
                },
                provider: {
                    validators: {
                        notEmpty: {
                            message: 'Seleccione un proveedor'
                        },
                    }
                },
                sucursal: {
                    validators: {
                        notEmpty: {
                            message: 'Seleccione una sucursal'
                        },
                    }
                },
                date_joined: {
                    validators: {
                        notEmpty: {
                            message: 'La fecha es obligatoria'
                        },
                        date: {
                            format: 'YYYY-MM-DD',
                            message: 'La fecha no es válida'
                        }
                    }
                },
                end_credit: {
                    validators: {
                        notEmpty: {
                            message: 'La fecha es obligatoria'
                        },
                        date: {
                            format: 'YYYY-MM-DD',
                            message: 'La fecha no es válida'
                        }
                    }
                },
            },
        }
    )
        .on('core.element.validated', function (e) {
            if (e.valid) {
                const groupEle = FormValidation.utils.closest(e.element, '.form-group');
                if (groupEle) {
                    FormValidation.utils.classSet(groupEle, {
                        'has-success': false,
                    });
                }
                FormValidation.utils.classSet(e.element, {
                    'is-valid': false,
                });
            }
            const iconPlugin = fvPurchase.getPlugin('icon');
            const iconElement = iconPlugin && iconPlugin.icons.has(e.element) ? iconPlugin.icons.get(e.element) : null;
            iconElement && (iconElement.style.display = 'none');
        })
        .on('core.validator.validated', function (e) {
            if (!e.result.valid) {
                const messages = [].slice.call(frmPurchase.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
                messages.forEach((messageEle) => {
                    const validator = messageEle.getAttribute('data-validator');
                    messageEle.style.display = validator === e.validator ? 'block' : 'none';
                });
            }
        })
        .on('core.form.valid', function () {
            var parameters = new FormData($(fvPurchase.form)[0]);
            parameters.append('action', $('input[name="action"]').val());
            parameters.append('end_credit', input_endcredit.val());
            if (purchase.details.products.length === 0) {
                message_error('Debe tener al menos un item en el detalle');
                return false;
            }
            if (purchase.details.products.filter(value => value.series.length > 0).length === 0) {
                message_error('Existen productos que no ha registrado al menos 1 número de serie');
                return false;
            }
            parameters.append('products', JSON.stringify(purchase.details.products));
            submit_formdata_with_ajax('Notificación',
                '¿Estas seguro de realizar la siguiente acción?',
                pathname,
                parameters,
                function () {
                    location.href = fvPurchase.form.getAttribute('data-url');
                },
            );
        });
});

$(function () {

    inputCredit = $('.inputCredit');
    current_date = new moment().format("YYYY-MM-DD");
    input_datejoined = $('input[name="date_joined"]');
    input_endcredit = $('input[name="end_credit"]');
    input_serie = $('input[name="serie"]');
    select_provider = $('select[name="provider"]');
    input_searchproducts = $('input[name="searchproducts"]');
    select_paymentcondition = $('select[name="payment_condition"]');

    $('.select2').select2({
        theme: 'bootstrap4',
        language: "es",
    });

    /* Products */

    input_searchproducts.autocomplete({
        source: function (request, response) {
            $.ajax({
                url: pathname,
                data: {
                    'action': 'search_products',
                    'term': request.term,
                    'ids': JSON.stringify(purchase.get_products_ids()),
                },
                dataType: "json",
                type: "POST",
                headers: {
                    'X-CSRFToken': csrftoken
                },
                beforeSend: function () {

                },
                success: function (data) {
                    response(data);
                }
            });
        },
        min_length: 3,
        delay: 300,
        select: function (event, ui) {
            event.preventDefault();
            $(this).blur();
            ui.item.cant = 1;
            ui.item.series = [];
            purchase.add_product(ui.item);
            $(this).val('').focus();
        }
    });

    $('.btnClearProducts').on('click', function () {
        input_searchproducts.val('').focus();
    });

    $('#tblProducts tbody')
        .off()
        .on('click', 'a[rel="series"]', function () {
            var tr = tblProducts.cell($(this).closest('td, li')).index();
            purchase.index = tr.row;
            purchase.list_series(purchase.index);
            $('#myModalSeries').modal('show');
        })
        .on('change', 'input[name="cant"]', function () {
            var tr = tblProducts.cell($(this).closest('td, li')).index();
            purchase.details.products[tr.row].cant = parseInt($(this).val());
            purchase.calculate_invoice();
            $('td:eq(5)', tblProducts.row(tr.row).node()).html('$' + purchase.details.products[tr.row].subtotal.toFixed(2));
        })
        .on('change', 'input[name="price"]', function () {
            var tr = tblProducts.cell($(this).closest('td, li')).index();
            purchase.details.products[tr.row].price = parseFloat($(this).val());
            purchase.calculate_invoice();
            $('td:eq(5)', tblProducts.row(tr.row).node()).html('$' + purchase.details.products[tr.row].subtotal.toFixed(2));
        })
        .on('click', 'a[rel="remove"]', function () {
            var tr = tblProducts.cell($(this).closest('td, li')).index();
            purchase.details.products.splice(tr.row, 1);
            tblProducts.row(tr.row).remove().draw();
            //purchase.list_products();
            $('.tooltip').remove();
        });

    $('.btnSearchProducts').on('click', function () {
        tblSearchProducts = $('#tblSearchProducts').DataTable({
            // responsive: true,
            // autoWidth: false,
            destroy: true,
            ajax: {
                url: pathname,
                type: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken
                },
                data: {
                    'action': 'search_products',
                    'term': input_searchproducts.val(),
                    'ids': JSON.stringify(purchase.get_products_ids()),
                },
                dataSrc: ""
            },
            //paging: false,
            //ordering: false,
            //info: false,
            scrollX: true,
            scrollCollapse: true,
            columns: [
                {data: "name"},
                {data: "category.name"},
                {data: "price"},
                {data: "pvp"},
                {data: "stock"},
                {data: "id"},
            ],
            columnDefs: [
                {
                    targets: [-3, -4],
                    class: 'text-center',
                    render: function (data, type, row) {
                        return '$' + parseFloat(data).toFixed(2);
                    }
                },
                {
                    targets: [-2],
                    class: 'text-center',
                    render: function (data, type, row) {
                        if (row.stock > 0) {
                            return '<span class="badge badge-success">' + data + '</span>'
                        }
                        return '<span class="badge badge-warning">' + data + '</span>'
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    render: function (data, type, row) {
                        return '<a rel="add" class="btn btn-success btn-flat btn-xs"><i class="fas fa-plus"></i></a>'
                    }
                }
            ],
            rowCallback: function (row, data, index) {
                var tr = $(row).closest('tr');
                if (data.stock === 0) {
                    $(tr).css({'background': '#dc3345', 'color': 'white'});
                }
            },
        });
        $('#myModalSearchProducts').modal('show');
    });

    $('#myModalSearchProducts').on('shown.bs.modal', function () {
        purchase.list_products();
    });

    $('#tblSearchProducts tbody')
        .off()
        .on('click', 'a[rel="add"]', function () {
            var row = tblSearchProducts.row($(this).parents('tr')).data();
            row.cant = 1;
            row.series = [];
            purchase.add_product(row);
            tblSearchProducts.row($(this).parents('tr')).remove().draw();
        });

    $('.btnRemoveAllProducts').on('click', function () {
        if (purchase.details.products.length === 0) return false;
        dialog_action('Notificación', '¿Estas seguro de eliminar todos los items de tu detalle?', function () {
            purchase.details.products = [];
            purchase.list_products();
        }, function () {

        });
    });

    /* Series */
    input_serie.on('keyup', function () {
        $(this).val($(this).val().toUpperCase());
    });

    $('.btnGenSerie').on('click', function () {
        $.ajax({
            url: pathname,
            data: {
                'action': 'generate_serie'
            },
            method: 'POST',
            dataType: 'json',
            headers: {
                'X-CSRFToken': csrftoken
            },
            beforeSend: function () {
                $('.tooltip').remove();
                fvSerie.resetForm(true);
                input_serie.val('');
            },
            success: function (request) {
                if (!request.hasOwnProperty('error')) {
                    input_serie.val(request.serie);
                    return false;
                }
                message_error(request.error);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                message_error(errorThrown + ' ' + textStatus);
            }
        });
    });

    $('.btnClearSerie').on('click', function () {
        fvSerie.resetForm(true);
        input_serie.val('').focus();
    });

    $('#myModalSeries').on('hidden.bs.modal', function () {
        purchase.list_products();
    });

    $('#tblSeries tbody')
        .off()
        .on('click', 'a[rel="remove"]', function () {
            var tr = tblSeries.cell($(this).closest('td, li')).index();
            purchase.details.products[purchase.index].series.splice(tr.row, 1);
            tblSeries.row(tr.row).remove().draw();
            //purchase.list_series(purchase.index);
        });

    $('.btnRemoveAllSeries').on('click', function () {
        dialog_action('Notificación', '¿Estas seguro de eliminar todos los items?', function () {
            purchase.details.products[purchase.index].series = [];
            purchase.list_series(purchase.index);
        }, function () {

        });
    });

    /* Search Provider */

    select_provider.select2({
        theme: "bootstrap4",
        language: 'es',
        allowClear: true,
        ajax: {
            delay: 250,
            type: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            url: pathname,
            data: function (params) {
                var queryParameters = {
                    term: params.term,
                    action: 'search_provider'
                }
                return queryParameters;
            },
            processResults: function (data) {
                return {
                    results: data
                };
            },
        },
        placeholder: 'Ingrese un nombre o ruc',
        minimumInputLength: 1,
    })
        .on('select2:select', function (e) {
            fvPurchase.revalidateField('provider');
        })
        .on('select2:clear', function (e) {
            fvPurchase.revalidateField('provider');
        });

    $('select[name="sucursal"]').on('change', function () {
        fvPurchase.revalidateField('sucursal');
    });

    $('.btnAddProvider').on('click', function () {
        $('#myModalProvider').modal('show');
    });

    $('#myModalProvider').on('hidden.bs.modal', function () {
        fvProvider.resetForm(true);
    });

    $('input[name="ruc"]').keypress(function (e) {
        return validate_form_text('numbers', e, null);
    });

    $('input[name="mobile"]').keypress(function (e) {
        return validate_form_text('numbers', e, null);
    });

    /* Form */

    select_paymentcondition
        .on('change.select2', function () {
            fvPurchase.revalidateField('payment_condition');
            var id = $(this).val();
            var start_date = input_datejoined.val();
            input_endcredit.datetimepicker('minDate', start_date);
            input_endcredit.datetimepicker('date', start_date);
            inputCredit.hide();
            if (id === 'credito') {
                inputCredit.show();
            }
        });

    input_datejoined.datetimepicker({
        format: 'YYYY-MM-DD',
        useCurrent: false,
        locale: 'es',
        orientation: 'bottom',
        keepOpen: false
    });

    input_datejoined.on('change.datetimepicker', function (e) {
        fvPurchase.revalidateField('date_joined');
        input_endcredit.datetimepicker('minDate', e.date);
        input_endcredit.datetimepicker('date', e.date);
    });

    input_endcredit.datetimepicker({
        useCurrent: false,
        format: 'YYYY-MM-DD',
        locale: 'es',
        keepOpen: false,
        minDate: current_date
    });

    input_endcredit.datetimepicker('date', input_endcredit.val());

    input_endcredit.on('change.datetimepicker', function (e) {
        fvPurchase.revalidateField('end_credit');
    });

    inputCredit.hide();

    $('i[data-field="provider"]').hide();
    $('i[data-field="searchproducts"]').hide();
});