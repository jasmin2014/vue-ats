import Main from '../../components/layout/Main.vue'
import Public from '../../components/layout/Public.vue'
import ErrorNotFound from '../../components/error/NotFound.vue'
import ErrorUnauthorized from '../../components/error/Unauthorized.vue'
// org
import OrgList from '../pages/org/List.vue'
import OrgDetail from '../pages/org/Detail.vue'
import OrgEdit from '../pages/org/Edit.vue'
import OrgCreate from '../pages/org/Create.vue'
import OrgRelList from '../pages/org/RelList.vue'
// customer
import CustomerList from '../pages/customer/List.vue'
import CustomerDetail from '../pages/customer/Detail.vue'
// config
import ConfigAutoAuditSetting from '../pages/config/AutoAudit'
import ConfigProjectList from '../pages/config/project/ProjectConfigList'
import ConfigProjectDetail from '../pages/config/project/ProjectConfigDetail'
import ConfigProjectAudit from '../pages/config/project/ProjectConfigAudit'
import ConfigProjectEdit from '../pages/config/project/ProjectConfigEdit'
// audit
import AuditRiskList from '../pages/audit/RiskList.vue'
import AuditRiskDetail from '../pages/audit/RiskDetail.vue'
import AuditRecordList from '../pages/audit/RecordList'
import AuditRecordDetail from '../pages/audit/RecordDetail.vue'
import AuditAssetList from '../pages/audit/AssetList'
import AuditAssetDetail from '../pages/audit/RecordDetail.vue'
import AuditStatList from '../pages/audit/StatList'
// asset
import AssetList from '../pages/asset/List.vue'
import AssetDetail from '../pages/asset/Detail'
// operation
import OperationPlanList from '../pages/operation/PlanList'
import OperationPlanDetail from '../pages/operation/PlanDetail'
import OperationLoanList from '../pages/operation/LoanList.vue'
import OperationPlannedBillList from '../pages/operation/ShouldRepayBill.vue'
import OperationActualBillList from '../pages/operation/ActualBill.vue'
import OperationStatList from '../pages/operation/StatList'
// account
import AccountRoleList from '../pages/account/RoleList.vue'
import AccountUserList from '../pages/account/UserList.vue'
// system
import SystemMenuConfig from '../pages/system/MenuConfig.vue'
import SystemConstantList from '../pages/system/ConstantList'
import SystemEnumList from '../pages/system/EnumList'
import SystemKeyList from '../pages/system/KeyList'
import SystemTaskList from '../pages/system/TaskList'

export default {
  'Home': Main,
  'Error': Public,
  'ErrorNotFound': ErrorNotFound,
  'ErrorUnauthorized': ErrorUnauthorized,
  'Org': Public,
  'OrgInfo': Public,
  'OrgList': OrgList,
  'OrgCreate': OrgCreate,
  'OrgEdit': OrgEdit,
  'OrgDetail': OrgDetail,
  'OrgRel': Public,
  'OrgRelList': OrgRelList,
  'Customer': Public,
  'CustomerInfo': Public,
  'CustomerList': CustomerList,
  'CustomerDetail': CustomerDetail,
  'Config': Public,
  'ConfigAutoAudit': Public,
  'ConfigAutoAuditSetting': ConfigAutoAuditSetting,
  'ConfigProject': Public,
  'ConfigProjectList': ConfigProjectList,
  'ConfigProjectDetail': ConfigProjectDetail,
  'ConfigProjectAudit': ConfigProjectAudit,
  'ConfigProjectEdit': ConfigProjectEdit,
  'Audit': Public,
  'AuditRisk': Public,
  'AuditRiskList': AuditRiskList,
  'AuditRiskDetail': AuditRiskDetail,
  'AuditRecord': Public,
  'AuditRecordList': AuditRecordList,
  'AuditRecordDetail': AuditRecordDetail,
  'AuditAsset': Public,
  'AuditAssetList': AuditAssetList,
  'AuditAssetDetail': AuditAssetDetail,
  'AuditStat': Public,
  'AuditStatList': AuditStatList,
  'Asset': Public,
  'AssetInfo': Public,
  'AssetList': AssetList,
  'AssetDetail': AssetDetail,
  'AssetPlanDetail': OperationPlanDetail, // 与运营管理共用还款计划详情组件
  'Operation': Public,
  'OperationPlan': Public,
  'OperationPlanList': OperationPlanList,
  'OperationPlanDetail': OperationPlanDetail,
  'OperationLoan': Public,
  'OperationLoanList': OperationLoanList,
  'OperationPlannedBill': Public,
  'OperationPlannedBillList': OperationPlannedBillList,
  'OperationActualBill': Public,
  'OperationActualBillList': OperationActualBillList,
  'OperationStat': Public,
  'OperationStatList': OperationStatList,
  'Account': Public,
  'AccountRole': Public,
  'AccountRoleList': AccountRoleList,
  'AccountUser': Public,
  'AccountUserList': AccountUserList,
  'System': Public,
  'SystemMenu': Public,
  'SystemMenuConfig': SystemMenuConfig,
  'SystemConstant': Public,
  'SystemConstantList': SystemConstantList,
  'SystemEnum': Public,
  'SystemEnumList': SystemEnumList,
  'SystemKey': Public,
  'SystemKeyList': SystemKeyList,
  'SystemTask': Public,
  'SystemTaskList': SystemTaskList
};
