import Main from '../../components/layout/Main.vue'
import Public from '../../components/layout/Public.vue'
import ErrorNotFound from '../../components/error/NotFound.vue'
import ErrorUnauthorized from '../../components/error/Unauthorized.vue'
import MenuSetting from '../../components/menu/MenuSetting.vue'
// org
import OrgList from '../pages/org/List.vue'
import OrgDetail from '../pages/org/Detail.vue'
import OrgEdit from '../pages/org/Edit.vue'
import OrgCreate from '../pages/org/Create.vue'
import OrgRelList from '../pages/org/RelList.vue'
import OrgAccountList from '../pages/org/AccountStatementList.vue'
// customer
import CustomerList from '../pages/customer/List.vue'
import CustomerDetail from '../pages/customer/Detail.vue'
// audit
import AuditRiskList from '../pages/audit/RiskList.vue'
import AuditRiskDetail from '../pages/audit/RiskDetail.vue'
// asset
import AssetList from '../pages/asset/List.vue'
import AssetDetail from '../pages/asset/Detail'
import AssetCategoryList from '../pages/asset/CatList.vue'
import AssetCategoryOrgRate from '../pages/asset/OrgRate'
import AssetCategoryRisk from '../pages/asset/RiskConfig.vue'
import AssetCategorySource from '../pages/asset/DataSourceConfig.vue'
// operation
import OperationPlanList from '../pages/operation/PlanList'
import OperationPlanDetail from '../pages/operation/PlanDetail'
import OperationLoanList from '../pages/operation/LoanList.vue'
import OperationPlannedBillList from '../pages/operation/ShouldRepayBill.vue'
import OperationActualBillList from '../pages/operation/ActualBill.vue'
// finance
import FinanceRepayList from '../pages/finance/RepayList.vue'
import FinanceProfitList from '../pages/finance/ProfitList.vue'
// account
import AccountRoleList from '../pages/account/RoleList.vue'
import AccountUserList from '../pages/account/UserList.vue'

export default {
  'Home': Main,
  'Error': Public,
  'ErrorNotFound': ErrorNotFound,
  'ErrorUnauthorized': ErrorUnauthorized,
  'MenuSetting': NODE_ENV === 'development' ? MenuSetting : {},
  'Org': Public,
  'OrgInfo': Public,
  'OrgList': OrgList,
  'OrgCreate': OrgCreate,
  'OrgEdit': OrgEdit,
  'OrgDetail': OrgDetail,
  'OrgAccountStatement': OrgAccountList,
  'OrgRel': Public,
  'OrgRelList': OrgRelList,
  'Customer': Public,
  'CustomerInfo': Public,
  'CustomerList': CustomerList,
  'CustomerDetail': CustomerDetail,
  'Audit': Public,
  'AuditRisk': Public,
  'AuditRiskList': AuditRiskList,
  'AuditRiskDetail': AuditRiskDetail,
  'Asset': Public,
  'AssetInfo': Public,
  'AssetList': AssetList,
  'AssetDetail': AssetDetail,
  'AssetPlanDetail': OperationPlanDetail, // 与运营管理共用还款计划详情组件
  'AssetCategory': Public,
  'AssetCategoryList': AssetCategoryList,
  'AssetCategoryOrgRate': AssetCategoryOrgRate,
  'AssetCategoryRisk': AssetCategoryRisk,
  'AssetCategorySource': AssetCategorySource,
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
  // 'Finance': Public,
  // 'FinanceRepay': Public,
  // 'FinanceRepayList': FinanceRepayList,
  // 'FinanceProfit': Public,
  // 'FinanceProfitList': FinanceProfitList,
  'Account': Public,
  'AccountRole': Public,
  'AccountRoleList': AccountRoleList,
  'AccountUser': Public,
  'AccountUserList': AccountUserList
};
