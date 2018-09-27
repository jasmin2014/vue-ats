import Main from '../../components/layout/Main.vue'
import Public from '../../components/layout/Public.vue'
import ErrorNotFound from '../../components/error/NotFound.vue'
import ErrorUnauthorized from '../../components/error/Unauthorized.vue'
// org
import OrgDetail from '../pages/org/Detail.vue'
import OrgAccountStatement from '../../center/pages/org/AccountStatementList.vue'
// customer
import CustomerList from '../pages/customer/List.vue'
import CustomerDetail from '../pages/customer/Detail.vue'
// asset
import AssetSetting from '../pages/asset/Setting.vue'
import AssetConfig from '../pages/asset/Config.vue'
import AssetApplyList from '../pages/asset/apply/List.vue';
import AssetApplyDetail from '../pages/asset/apply/Detail.vue';
import AssetStoredList from '../pages/asset/store/List.vue';
import AssetStoredDetail from '../pages/asset/store/Detail.vue';
import AssetStoredPlanEdit from '../pages/operation/PlanEdit.vue';
import AssetStoredPush from '../pages/asset/store/Push.vue';
import AssetTargetList from '../pages/asset/target/List.vue';
import AssetTargetDetail from '../pages/asset/target/Detail.vue';
// operation
import OperationPlanList from '../pages/operation/PlanList.vue';
import OperationPlanDetail from '../pages/operation/PlanDetail.vue';
import OperationLoanList from '../pages/operation/LoanList.vue';
import OperationPlannedBillList from '../pages/operation/RecList.vue';
import OperationActualBillList from '../pages/operation/ActList.vue';
import OperationLoanExceptionList from '../pages/operation/LoanExceptionList.vue';
// finance
import FinanceReceiveList from '../pages/finance/RepayList.vue';
import FinanceReceiveCreate from '../pages/finance/RepayCreate.vue';
import FinanceProfitList from '../pages/finance/ProfitList.vue';
import FinanceAccountInfo from '../pages/finance/Account.vue';
import FinanceAccountBind from '../pages/finance/AccountBind.vue';
import FinanceAccountWithdraw from '../pages/finance/AccountWithdraw.vue';
import FinanceAccountWithdrawStatus from '../../modules/finance/WithdrawStatus.vue';
// account
import AccountRoleList from '../pages/account/RoleList.vue'
import AccountUserList from '../pages/account/UserList.vue'

export default {
  'Home': Main,
  'Error': Public,
  'ErrorNotFound': ErrorNotFound,
  'ErrorUnauthorized': ErrorUnauthorized,
  'Org': Public,
  'OrgInfo': Public,
  'OrgDetail': OrgDetail,
  'OrgAccountStatement': OrgAccountStatement,
  'Customer': Public,
  'CustomerInfo': Public,
  'CustomerList': CustomerList,
  'CustomerDetail': CustomerDetail,
  'Asset': Public,
  'AssetSetting': Public,
  'AssetSettingInfo': AssetSetting,
  'AssetConfig': Public,
  'AssetConfigEdit': AssetConfig,
  'AssetApply': Public,
  'AssetApplyList': AssetApplyList,
  'AssetApplyDetail': AssetApplyDetail,
  'AssetStored': Public,
  'AssetStoredList': AssetStoredList,
  'AssetStoredDetail': AssetStoredDetail,
  'AssetStoredPlanEdit': AssetStoredPlanEdit,
  'AssetStoredPush': AssetStoredPush,
  'AssetTarget': Public,
  'AssetTargetList': AssetTargetList,
  'AssetTargetDetail': AssetTargetDetail,
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
  // 'OperationLoanException': Public,
  // 'OperationLoanExceptionList': OperationLoanExceptionList,
  // 'Finance': Public,
  // 'FinanceReceive': Public,
  // 'FinanceReceiveList': FinanceReceiveList,
  // 'FinanceReceiveCreate': FinanceReceiveCreate,
  // 'FinanceProfit': Public,
  // 'FinanceProfitList': FinanceProfitList,
  // 'FinanceAccount': Public,
  // 'FinanceAccountInfo': FinanceAccountInfo,
  // 'FinanceAccountBind': FinanceAccountBind,
  // 'FinanceAccountWithdraw': FinanceAccountWithdraw,
  // 'FinanceAccountWithdrawStatus': FinanceAccountWithdrawStatus,
  'Account': Public,
  'AccountRole': Public,
  'AccountRoleList': AccountRoleList,
  'AccountUser': Public,
  'AccountUserList': AccountUserList
}
