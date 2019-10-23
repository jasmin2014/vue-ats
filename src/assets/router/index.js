import Main from '../../components/layout/Main.vue'
import Public from '../../components/layout/Public.vue'
import ErrorNotFound from '../../components/error/NotFound.vue'
import ErrorUnauthorized from '../../components/error/Unauthorized.vue'
// org
import OrgDetail from '../pages/org/Detail.vue'
import OrgEdit from '../pages/org/Edit.vue'
import OrgRelList from '../pages/org/RelList'
// customer
import CustomerList from '../pages/customer/List.vue'
import CustomerDetail from '../pages/customer/Detail.vue'
// config
import ConfigProjectList from '../pages/config/project/List'
import ConfigProjectCreate from '../pages/config/project/Create'
import ConfigProjectDetail from '../pages/config/project/Detail'
import ConfigProjectEdit from '../pages/config/project/Edit'
import ConfigProtectionList from '../pages/config/protection/List'
import ConfigProtectionCreate from '../pages/config/protection/Create'
import ConfigProtectionDetail from '../pages/config/protection/Detail'
import ConfigProtectionEdit from '../pages/config/protection/Edit'
// asset
import AssetDetail from '../pages/asset/Detail.vue'
import AssetApplyList from '../pages/asset/List.vue'
import AssetApplyCreate from '../pages/asset/Create.vue'
import AssetApplyEdit from '../pages/asset/Edit.vue'
import AssetUploadBefore from '../pages/asset/upload/Before.vue'
import AssetUploadAfter from '../pages/asset/upload/UploadedList.vue'
import AssetUploadDetail from '../pages/asset/upload/UploadDetail.vue'
import AssetUploadEdit from '../pages/asset/upload/UploadEdit.vue'
import AssetFinishList from '../pages/asset/Manage.vue'
import AssetContinueInfoList from '../pages/asset/ContinueInfo.vue'
// operation
import OperationPlanList from '../pages/operation/PlanList.vue'
import OperationPlanDetail from '../pages/operation/PlanDetail.vue'
import OperationLoanList from '../pages/operation/LoanList.vue'
import OperationPlannedBillList from '../pages/operation/PlannedBillList.vue'
import OperationActualBillList from '../pages/operation/ActualBillList.vue'
import OperationStatList from '../pages/operation/StatList.vue'
// finance
import FinanceAccountList from '../pages/finance/AccountList'
import FinanceAccountCreate from '../pages/finance/AccountCreate'
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
  'OrgEdit': OrgEdit,
  'OrgRel': Public,
  'OrgRelList': OrgRelList,
  'Customer': Public,
  'CustomerInfo': Public,
  'CustomerList': CustomerList,
  'CustomerDetail': CustomerDetail,
  'Config': Public,
  'ConfigProject': Public,
  'ConfigProjectList': ConfigProjectList,
  'ConfigProjectDetail': ConfigProjectDetail,
  'ConfigProjectCreate': ConfigProjectCreate,
  'ConfigProjectEdit': ConfigProjectEdit,
  'ConfigProtection': Public,
  'ConfigProtectionList': ConfigProtectionList,
  'ConfigProtectionDetail': ConfigProtectionDetail,
  'ConfigProtectionCreate': ConfigProtectionCreate,
  'ConfigProtectionEdit': ConfigProtectionEdit,
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
  'AssetContinueInfo': Public,
  'AssetContinueInfoList': AssetContinueInfoList,
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
  'Finance': Public,
  'FinanceAccount': Public,
  'FinanceAccountList': FinanceAccountList,
  'FinanceAccountCreate': FinanceAccountCreate,
  'Account': Public,
  'AccountRole': Public,
  'AccountRoleList': AccountRoleList,
  'AccountUser': Public,
  'AccountUserList': AccountUserList
};
