import $ from 'jquery';

import BpmnModeler from 'bpmn-js/lib/Modeler';

import customTranslate from './customTranslate/customTranslate';

import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';

import {
    debounce
} from 'min-dash';

import diagramXML from '../resources/newDiagram.bpmn';

import {
    assignee,
    candidateGroups,
    candidateUsers,
    listenerValue
} from './customTableOption';

import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../node_modules/bootstrap-table/dist/bootstrap-table.min.js';


//给设置值的输入框类型
var currentInput = '';

//选中的监听器
var selectedListener = {};

//选中的监听器类型
var selectedListenerType = '';

var container = $('#js-drop-zone');

var canvas = $('#js-canvas');

// Our custom translation module
// We need to use the array syntax that is used by bpmn-js internally
// 'value' tells bmpn-js to use the function instead of trying to instanciate it
var customTranslateModule = {
    translate: ['value', customTranslate]
};

var bpmnModeler = new BpmnModeler({
    container: canvas,
    propertiesPanel: {
        parent: '#js-properties-panel'
    },
    additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule,
        customTranslateModule
    ],
    moddleExtensions: {
        activiti: camundaModdleDescriptor
    }
});
container.removeClass('with-diagram');

function createNewDiagram() {
    openDiagram(diagramXML);
}

function openDiagram(xml) {

    bpmnModeler.importXML(xml, function (err) {

        if (err) {
            container
                .removeClass('with-diagram')
                .addClass('with-error');

            container.find('.error pre').text(err.message);

            console.error(err);
        } else {
            container
                .removeClass('with-error')
                .addClass('with-diagram');

            console.log(bpmnModeler)
            //监听事件
            /*bpmnModeler.on('selection.changed', (e) => {
                console.log('监听到selection.changed',e);
            });*/

            //监听选择监听器事件
            document.addEventListener('onChangeSelectedListener', function (event) {
                selectedListener = event.dataObj;
            })

            //监听选择监听器类型事件
            document.addEventListener('onSelectListenType', function (event) {
                selectedListenerType = event.dataObj;
            })

            //document上绑定自定义事件onopenModal
            document.addEventListener('onopenModal', function (event) {
                //input值上浮
                /**input赋值 */
                //event.dataObj.value = '6666';

                //取得输入框的值转为数组
                var currentInputVal = [];
                currentInputVal = event.dataObj.value !== '' ? event.dataObj.value.split(',') : [];

                //根据数据对象的名字选择配置（代理人，候选用户。。。）
                currentInput = event.dataObj.name;
                var op = getTableOption(currentInput);

                $('#table').bootstrapTable(op.tableOpt);
                //刷新配置防止有缓存
                $("#table").bootstrapTable('refreshOptions', op.tableOpt);


                
                if (op.property!='listenerValue') {

                    //监听器输入框不可见
                    $('.form-group').css('display', 'none');

                    var successCallBack = function (result, status, XMLHttpRequest) {
                        console.log("查询结果", result);

                        var tableData = result[0].data;
                        var fieldName = op.tableOpt.idField;

                        //设置默认选中的方法
                        var setCheckedFn = function (value, row, index) {
                            for (let i = 0; i < currentInputVal.length; i++) {
                                if (currentInputVal[i] == row[fieldName]) {
                                    return {
                                        checked: true //选中
                                    };
                                } else {
                                    return {
                                        checked: false
                                    };
                                }
                            }

                        };

                        op.tableOpt.columns[0].formatter = setCheckedFn;

                        //修改模态框标题
                        $('#exampleModalScrollableTitle').html("选择" + event.dataObj.computedName);
                        // do something...
                        $("#table").bootstrapTable('load', tableData);
                        $("#table").bootstrapTable('refreshOptions', op.tableOpt);
                    };
                    //sendRquest('GET', remoteUrl, op.requestParam, successCallBack);
                } else {

                    //修改模态框标题
                    $('#exampleModalScrollableTitle').html("选择");
                    //监听器输入框可见
                    $('.form-group').css('display', 'block');

                    //点击行赋值输入框
                    var onClickRow = function (row, $element) {
                        $("#listenerInput").val(row.listenerValue);
                    }
                    op.tableOpt.onClickRow = onClickRow;

                    //输入框原本默认值
                    $("#listenerInput").val(event.dataObj.value);


                    //配置里面有data
                    $("#table").bootstrapTable('refreshOptions', op.tableOpt);

                    //java类表格可见
                    if (selectedListenerType == 'class') {
                        $(".bootstrap-table").css('display', 'block');
                    } else {
                        $(".bootstrap-table").css('display', 'none');
                    }
                }

                //modal弹窗
                $('#exampleModalScrollable').modal('show');
                // $('#exampleModalScrollable').on('shown.bs.modal', function (e) {
                // });

            }, false);

        }


    });
}

function saveSVG(done) {
    bpmnModeler.saveSVG(done);
}

function saveDiagram(done) {

    bpmnModeler.saveXML({
        format: true
    }, function (err, xml) {
        done(err, xml);
    });
}

function registerFileDrop(container, callback) {

    function handleFileSelect(e) {
        e.stopPropagation();
        e.preventDefault();

        var files = e.dataTransfer.files;

        var file = files[0];

        var reader = new FileReader();

        reader.onload = function (e) {

            var xml = e.target.result;

            callback(xml);
        };

        reader.readAsText(file);
    }

    function handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();

        e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    container.get(0).addEventListener('dragover', handleDragOver, false);
    container.get(0).addEventListener('drop', handleFileSelect, false);
}


////// file drag / drop ///////////////////////

// check file api availability
if (!window.FileList || !window.FileReader) {
    window.alert(
        'Looks like you use an older browser that does not support drag and drop. ' +
        'Try using Chrome, Firefox or the Internet Explorer > 10.');
} else {
    registerFileDrop(container, openDiagram);
}

// bootstrap diagram functions

$(function () {

    var txt2Save = '';
    $('#js-create-diagram').click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        createNewDiagram();
    });

    //保存选中
    $('#saveChoosed').click(function (e) {
        //取得选中的行数组
        var choosedRows = $('#table').bootstrapTable('getSelections');

        var inputVal = '';
        //确定那个字段的值写入输入框
        var fieldName = getTableOption(currentInput).tableOpt.idField;
        for (let index = 0; index < choosedRows.length; index++) {
            //取得的行id相连,分割
            if (index !== choosedRows.length - 1) {
                inputVal += choosedRows[index][fieldName] + ',';
            } else {
                inputVal += choosedRows[index][fieldName];
            }
        }

        /**input赋值 */
        //更新属性assignee等
        var selectedElement = bpmnModeler.get('selection').get();
        var modeling = bpmnModeler.get('modeling');

        let canvas = bpmnModeler.get('canvas');
        let rootElement = canvas.getRootElement();

        //无选中则是根元素
        if (!selectedElement[0]) {
            selectedElement[0] = rootElement;
        }

        var property = {};
        property[currentInput] = inputVal;


        if (currentInput == 'listenerValue') {
            inputVal = $("#listenerInput").val();
            var extensionElementsArry = selectedElement[0].businessObject.get('extensionElements').get('values');

            //取出tasklistener
            var taskListenerArry = extensionElementsArry.filter(function (item) {
                return item["$type"] === "camunda:TaskListener";
            });

            //取出ExecutionListener
            var executionListenerArry = extensionElementsArry.filter(function (i) {
                return i["$type"] === "camunda:ExecutionListener";
            });


            if (selectedListener.id.indexOf('taskListener') !== -1) {
                if (selectedListener.selected) {
                    let index = selectedListener.selected.idx;
                    taskListenerArry[index][selectedListenerType] = inputVal;
                }
            } else if (selectedListener.id.indexOf('executionListener') !== -1) {
                if (selectedListener.selected) {
                    let index = selectedListener.selected.idx;
                    executionListenerArry[index][selectedListenerType] = inputVal;
                }
            }

            executionListenerArry.push.apply(executionListenerArry, taskListenerArry);

            selectedElement[0].businessObject.get('extensionElements').values = executionListenerArry;

            property = {
                extensionElements: selectedElement[0].businessObject.get('extensionElements')
            }

        }
        //更新属性
        modeling.updateProperties(selectedElement[0], property);

        $('#exampleModalScrollable').modal('hide');
    });

    var downloadLink = $('#js-download-diagram');
    var downloadSvgLink = $('#js-download-svg');
    var save2ServerLink = $("#js-save-diagram");

    $('.buttons a').click(function (e) {
        if (!$(this).is('.active')) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    //保存内容到服务器
    $("#js-save-diagram").click(function (e) {
        if (!$(this).is('.active')) {
            return;
        }
        console.log(txt2Save)
        let successCallBack = function (result, status, XMLHttpRequest) {
            console.log(result);
        };

        let requestParam = {
            appName: "com.elite.mis",
            appVersion: "hmis_gg_01", //sysConfig.appInfo.app_version,
            dataType: 'json',
            serviceName: 'activitiService',
            methodName: 'getStringActContent',
            actContent: txt2Save
        };
        //sendRquest('GET', remoteUrl, requestParam, successCallBack);
    })

    function setEncoded(link, name, data) {

        var encodedData = encodeURIComponent(data);

        if (data) {
            link.addClass('active').attr({
                'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
                'download': name
            });
        } else {
            link.removeClass('active');
        }
    }

    function cansave(link, data) {
        if (data) {
            link.addClass('active');
            txt2Save = data;
            console.log(typeof data);
        } else {
            link.removeClass('active');
        }
    }

    var exportArtifacts = debounce(function () {

        saveSVG(function (err, svg) {
            setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
        });

        saveDiagram(function (err, xml) {
            setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
        });
        //保存到服务器转换
        saveDiagram(function (err, xml) {
            cansave(save2ServerLink,xml);
        });

    }, 500);

    bpmnModeler.on('commandStack.changed', exportArtifacts);


});

/**
 * 利用jQuery的ajax实现get/post请求方法
 */
var sendRquest = function (requestType, url, data, successCallBack, errCallBack, finallyCallBack) {
    $.ajax({
        type: requestType ? requestType : 'GET', //请求的类型,GET、POST等	
        url: url, //向服务器请求的地址。
        data: data,
        contentType: 'application/json', //向服务器发送内容的类型，默认值是：application/x-www-form-urlencoded
        dataType: 'JSON', //预期服务器响应类型
        async: true, //默认值是true,表示请求是异步的，false是同步请求，同步请求会阻碍浏览器的其他操作（不建议使用）
        timeout: '5000', //设置本地的请求超时时间（单位是毫秒）
        cache: true, //设置浏览器是否缓存请求的页面
        success: function (result, status, XMLHttpRequest) { //请求成功是执行的函数,result：服务器返回的数据，    status：服务器返回的状态，
            if (successCallBack) {
                successCallBack(result, status, XMLHttpRequest);
            }
        },
        error: function (xhr, status, error) { //请求失败是执行的函数
            if (errCallBack) {
                errCallBack(xhr, status, error);
            }
        },
        complete: function (xhr, status) { //不管请求失败还是请求成功，都执行的函数
            if (finallyCallBack) {
                finallyCallBack(xhr, status);
            }
        }
    });

}

var getTableOption = function (type) {
    var option = null;
    switch (type) {
        case "assignee":
            option = assignee();
            break;
        case "candidateUsers":
            option = candidateUsers();
            break;
        case "candidateGroups":
            option = candidateGroups();
            break;
        case "listenerValue":
            option = listenerValue();
            break;

    }
    return option;
}