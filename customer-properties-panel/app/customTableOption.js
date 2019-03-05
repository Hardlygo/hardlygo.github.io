
var assignee = function () {
    return {
        property: 'assignee',
        requestParam: {
            dataType: 'json',
            serviceName: 'mybitisUserService',
            methodName: 'getUserList'
        },
        tableOpt: {
            pagination: true,
            pageList: [10, 25, 50, 100],
            idField: 'user_id',
            singleSelect: true,
            search:true,
            columns: [{
                    checkbox: true,
                    formatter: (value, row, index)=>{
                        return {
                            checked: false
                        };
                    }
                },
                {
                    field: 'user_id',
                    title: '用户ID'
                }, {
                    field: 'user_name',
                    title: '用户名'
                }, {
                    field: 'top_deptname',
                    title: '公司'
                },
                {
                    field: 'dept_name',
                    title: '部门'
                },
                {
                    field: 'position_name',
                    title: '职位'
                }
            ],
            data:[
                {user_id:1,user_name:'小老吕',top_deptname:'广西大学',dept_name:'计算机与电子信息学院',position_name:'副教授'},
                {user_id:2,user_name:'老李',top_deptname:'广西大学',dept_name:'计算机与电子信息学院',position_name:'院长'},
                {user_id:3,user_name:'大老吕',top_deptname:'广西大学',dept_name:'计算机与电子信息学院',position_name:'副教授'},
            ]
        }

    }
}
module.exports.assignee = assignee;
var candidateUsers = function () {
    return {
        property: 'candidateUsers',

        requestParam: {
            dataType: 'json',
            serviceName: 'mybitisUserService',
            methodName: 'getUserList'
        },
        tableOpt: {
            pagination: true,
            pageList: [10, 25, 50, 100],
            idField: 'user_id',
            singleSelect: false,
            search:true,
            columns: [{
                    checkbox: true,
                    formatter: (value, row, index)=>{
                        return {
                            checked: false
                        };
                    }
                },
                {
                    field: 'user_id',
                    title: '用户ID'
                }, {
                    field: 'user_name',
                    title: '用户名'
                }, {
                    field: 'top_deptname',
                    title: '公司'
                },
                {
                    field: 'dept_name',
                    title: '部门'
                },
                {
                    field: 'position_name',
                    title: '职位'
                }
            ],
            data:[
                {user_id:1,user_name:'小老吕',top_deptname:'广西大学',dept_name:'计算机与电子信息学院',position_name:'副教授'},
                {user_id:2,user_name:'老李',top_deptname:'广西大学',dept_name:'计算机与电子信息学院',position_name:'院长'},
                {user_id:3,user_name:'大老吕',top_deptname:'广西大学',dept_name:'计算机与电子信息学院',position_name:'副教授'},
            ]
        }

    }
}
module.exports.candidateUsers = candidateUsers;
var candidateGroups = function () {
    return {
        property: 'candidateGroups',
        requestParam: {
            dataType: 'json',
            serviceName: 'roleService',
            methodName: 'getRoleList2'
        },
        tableOpt: {
            pagination: true,
            pageList: [10, 25, 50, 100],
            idField: 'role_id',
            singleSelect: false,
            search:true,
            columns: [{
                    checkbox: true,
                    formatter: null
                },
                {
                    field: 'role_id',
                    title: '角色ID'
                }, {
                    field: 'role_name2',
                    title: '角色名'
                }
            ],
            data:[
                {role_id:1,role_name2:'软件工程师'},
                {role_id:2,role_name2:'软件组长'},
                {role_id:3,role_name2:'软件架构师'},
            ]
        }

    };
}
module.exports.candidateGroups = candidateGroups;

var listenerValue = function () {
    return {
        property: 'listenerValue',
        requestParam: {
        },
        tableOpt: {
            pagination: true,
            pageList: [10, 25, 50, 100],
            idField: 'listenerValue',
            singleSelect: true,
            search:false,
            columns: [
                {
                    field: 'listenerValue',
                    title: 'java类'
                }
            ],
            data:[
                {listenerValue:'com.elite.mis.common.activiti.TaskCheckCompleteListener'},
                {listenerValue:'com.elite.mis.common.activiti.TaskCheckCompleteListener2'},
                {listenerValue:'com.elite.mis.common.activiti.TaskCheckCompleteListener3'},
            ]
        }
    };
}
module.exports.listenerValue = listenerValue;