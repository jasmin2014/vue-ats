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
import CustomerEdit from '../pages/customer/Edit.vue'
import CustomerCreate from '../pages/customer/Create.vue'
// asset
import AssetDetail from '../pages/asset/Detail.vue'
import AssetApplyList from '../pages/asset/List.vue'
import AssetApplyCreate from '../pages/asset/Create.vue'
import AssetApplyEdit from '../pages/asset/Edit.vue'
import AssetUploadBefore from '../pages/asset/UploadBefore.vue'
import AssetUploadAfter from '../pages/asset/UploadedList.vue'
import AssetUploadDetail from '../pages/asset/UploadDetail.vue'
import AssetUploadEdit from '../pages/asset/UploadEdit.vue'
import AssetFinishList from '../pages/asset/Manage.vue'
// operation
import OperationPlanList from '../pages/operation/PlanList.vue'
import OperationPlanDetail from '../pages/operation/PlanDetail.vue'
import OperationLoanList from '../pages/operation/LoanList.vue'
import OperationPlannedBillList from '../pages/operation/PlannedBillList.vue'
import OperationActualBillList from '../pages/operation/ActualBillList.vue'
import OperationLoanExceptionList from '../pages/operation/LoanExceptionList.vue'
// finance
import FinanceRepayList from '../pages/finance/RepayList.vue'
import FinanceProfitList from '../pages/finance/ProfitList.vue'
import FinanceAccountInfo from '../pages/finance/Account.vue'
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
  'CustomerEdit': CustomerEdit,
  'CustomerCreate': CustomerCreate,
  'Asset': Public,
  'AssetApply': Public,
  'AssetApplyList': AssetApplyList,
  'AssetApplyEdit': AssetApplyEdit,
  'AssetApplyCreate': AssetApplyCreate,
  'AssetApplyDetail': AssetDetail,
  'AssetApplyPlanDetail': OperationPlanDetail,
  'AssetUpload': Public,
  'AssetUploadBefore': AssetUploadBefore,
  'AssetUploadAfter': AssetUploadAfter,
  'AssetUploadDetail': AssetUploadDetail,
  'AssetUploadEdit': AssetUploadEdit,
  'AssetFinish': Public,
  'AssetFinishList': AssetFinishList,
  'AssetFinishDetail': AssetDetail,
  'AssetFinishPlanDetail': OperationPlanDetail,
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
  // 'FinanceRepay': Public,
  // 'FinanceRepayList': FinanceRepayList,
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
};
